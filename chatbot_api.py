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
    session_id = data.get("session_id")
    agent = get_agent(user_id, session_id)
    try:
        response = agent.run(message=message, user_id=user_id)
        if hasattr(response, "content"):
            reply = response.content
        else:
            reply = str(response)
        return {"reply": reply, "session_id": agent.session_id}
    except Exception as e:
        return {"reply": f"Error: {str(e)}", "session_id": agent.session_id}

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