import sqlite3

db_file = "tmp/agent.db"
conn = sqlite3.connect(db_file)
cursor = conn.cursor()

# Check if 'title' column already exists
cursor.execute("PRAGMA table_info(agent_sessions)")
columns = [row[1] for row in cursor.fetchall()]

if 'title' not in columns:
    cursor.execute("ALTER TABLE agent_sessions ADD COLUMN title TEXT")
    print("'title' column added to agent_sessions table.")
else:
    print("'title' column already exists in agent_sessions table.")

conn.commit()
conn.close()
print("Migration complete: agent_sessions table now has a 'title' column.")
