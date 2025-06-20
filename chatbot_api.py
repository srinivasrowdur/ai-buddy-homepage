from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agno.agent import Agent
from agno.memory.v2.db.sqlite import SqliteMemoryDb
from agno.memory.v2.memory import Memory
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from dotenv import load_dotenv
from textwrap import dedent
import os
from fastapi.responses import JSONResponse
import sqlite3
import ast
import uuid
from fastapi import Body

load_dotenv()
app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only! Restrict in prod.
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_agent(user_id: str, session_id: str = None, db_file="tmp/agent.db"):
    memory = Memory(
        model=OpenAIChat(id="gpt-4o"),
        db=SqliteMemoryDb(table_name="agent_memory", db_file=db_file),
    )
    agent_storage = SqliteStorage(table_name="agent_sessions", db_file=db_file)
    agent = Agent(
        model=OpenAIChat(id="gpt-4o"),
        user_id=user_id,
        session_id=session_id,
        memory=memory,
        storage=agent_storage,
        enable_user_memories=True,
        enable_session_summaries=True,
        add_memory_references=True,
        add_history_to_messages=True,
        num_history_responses=5,
        markdown=True,
        description=dedent("""\
            You are a helpful and friendly AI assistant with excellent memory.
            - Remember important details about users and reference them naturally
            - Maintain a warm, positive tone while being precise and helpful  
            - When appropriate, refer back to previous conversations and memories
            - Always be truthful about what you remember or don't remember
            - Keep responses conversational and engaging"""),
    )
    return agent

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_id = data.get("user_id", "User")
    message = data.get("message")
    session_id = data.get("session_id") or str(uuid.uuid4())
    print(f"[DEBUG] /chat called with user_id={user_id}, session_id={session_id}, message={message}")
    agent = get_agent(user_id, session_id)
    db_file = "tmp/agent.db"
    try:
        # Save user message
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO chat_messages (id, user_id, session_id, sender, text) VALUES (?, ?, ?, ?, ?)",
            (str(uuid.uuid4()), user_id, session_id, "user", message)
        )
        conn.commit()
        # Generate a concise title from all messages in the session
        cursor.execute("SELECT text FROM chat_messages WHERE user_id = ? AND session_id = ? ORDER BY created_at ASC", (user_id, session_id))
        all_text = ' '.join([row[0] for row in cursor.fetchall()])
        import re
        words = re.findall(r'\w+', all_text)
        title = ' '.join(words[:3]) if words else 'Chat Session'
        title = title.title()
        # Update or insert session with title
        cursor.execute("SELECT session_id FROM agent_sessions WHERE user_id = ? AND session_id = ?", (user_id, session_id))
        if cursor.fetchone():
            cursor.execute("UPDATE agent_sessions SET title = ? WHERE user_id = ? AND session_id = ?", (title, user_id, session_id))
        else:
            cursor.execute("INSERT INTO agent_sessions (user_id, session_id, title, created_at) VALUES (?, ?, ?, datetime('now'))", (user_id, session_id, title))
        conn.commit()
        # Get bot response
        response = agent.run(message=message, user_id=user_id)
        if hasattr(response, "content"):
            reply = response.content
        else:
            reply = str(response)
        # Save bot message
        cursor.execute(
            "INSERT INTO chat_messages (id, user_id, session_id, sender, text) VALUES (?, ?, ?, ?, ?)",
            (str(uuid.uuid4()), user_id, session_id, "bot", reply)
        )
        conn.commit()
        conn.close()
        return {"reply": reply, "session_id": session_id}
    except Exception as e:
        print(f"[DEBUG] /chat error: {e}")
        return {"reply": f"Error: {str(e)}", "session_id": session_id}

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running"}

@app.get("/last_session")
def last_session():
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        # Check if the table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='agent_sessions'")
        if not cursor.fetchone():
            conn.close()
            return JSONResponse({"user_id": None, "session_id": None})
        # Get the most recent session's user_id and session_id
        cursor.execute("SELECT user_id, session_id FROM agent_sessions ORDER BY created_at DESC LIMIT 1")
        result = cursor.fetchone()
        conn.close()
        if result:
            return JSONResponse({"user_id": result[0], "session_id": result[1]})
        else:
            return JSONResponse({"user_id": None, "session_id": None})
    except Exception as e:
        return JSONResponse({"user_id": None, "session_id": None, "error": str(e)})

@app.get("/sessions")
def get_sessions(user_id: str):
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        # Check if the table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='agent_sessions'")
        if not cursor.fetchone():
            conn.close()
            return JSONResponse([])
        # Get all sessions for the user, with the stored title
        cursor.execute("""
            SELECT session_id, title, created_at
            FROM agent_sessions
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (user_id,))
        sessions = [
            {"session_id": row[0], "title": row[1] or f"Chat Session ({row[0][:8]})", "created_at": row[2]} for row in cursor.fetchall()
        ]
        conn.close()
        return JSONResponse(sessions)
    except Exception as e:
        print(f"[DEBUG] /sessions error: {e}")
        return JSONResponse([], status_code=500)

@app.get("/session_messages")
def get_session_messages(user_id: str, session_id: str):
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT sender, text, created_at FROM chat_messages WHERE user_id = ? AND session_id = ? ORDER BY created_at ASC",
            (user_id, session_id)
        )
        messages = [
            {"sender": row[0], "text": row[1], "created_at": row[2]} for row in cursor.fetchall()
        ]
        print(f"[DEBUG] /session_messages for user_id={user_id}, session_id={session_id}: {messages}")
        conn.close()
        return JSONResponse(messages)
    except Exception as e:
        print(f"[DEBUG] /session_messages error: {e}")
        return JSONResponse([], status_code=500)

@app.get("/debug_sessions")
def debug_sessions():
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, session_id, created_at FROM agent_sessions ORDER BY created_at DESC")
        sessions = [
            {"user_id": row[0], "session_id": row[1], "created_at": row[2]} for row in cursor.fetchall()
        ]
        conn.close()
        return JSONResponse(sessions)
    except Exception as e:
        return JSONResponse([], status_code=500)

@app.get("/debug_memory_schema")
def debug_memory_schema():
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(agent_memory)")
        schema = cursor.fetchall()
        conn.close()
        print(f"[DEBUG] agent_memory schema: {schema}")
        return JSONResponse(schema)
    except Exception as e:
        print(f"[DEBUG] /debug_memory_schema error: {e}")
        return JSONResponse([], status_code=500)

@app.get("/debug_memory_rows")
def debug_memory_rows():
    db_file = "tmp/agent.db"
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM agent_memory LIMIT 20")
        rows = cursor.fetchall()
        conn.close()
        print(f"[DEBUG] agent_memory rows: {rows}")
        return JSONResponse(rows)
    except Exception as e:
        print(f"[DEBUG] /debug_memory_rows error: {e}")
        return JSONResponse([], status_code=500)

@app.post("/delete_session")
async def delete_session(request: Request):
    db_file = "tmp/agent.db"
    try:
        data = await request.json()
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        if not user_id or not session_id:
            return JSONResponse({"error": "user_id and session_id required"}, status_code=400)
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        # Delete from chat_messages
        cursor.execute("DELETE FROM chat_messages WHERE user_id = ? AND session_id = ?", (user_id, session_id))
        # Delete from agent_sessions
        cursor.execute("DELETE FROM agent_sessions WHERE user_id = ? AND session_id = ?", (user_id, session_id))
        conn.commit()
        conn.close()
        return JSONResponse({"success": True})
    except Exception as e:
        print(f"[DEBUG] /delete_session error: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)