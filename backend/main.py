# main.py
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import asyncio
import json
import os
import base64  # <-- ADD THIS
from typing import Dict, List, Optional

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Gemini Chat API", version="2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS: Dict[str, List[dict]] = {}
MODEL_NAME = "gemini-2.5-flash"
model = genai.GenerativeModel(MODEL_NAME)

class ChatMessage(BaseModel):
    role: str
    text: Optional[str] = None
    image: Optional[str] = None  # base64 string
    mime_type: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    history: List[ChatMessage]

def get_session(session_id: str) -> List[dict]:
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
    return SESSIONS[session_id]

async def stream_response(prompt_parts, delay_ms: int = 30):
    try:
        response = await model.generate_content_async(prompt_parts, stream=True)
        async for chunk in response:
            if chunk.text:
                await asyncio.sleep(delay_ms / 1000.0)
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.get("/")
def home():
    return {"message": "Gemini Chat API – /docs"}

@app.get("/sessions/{session_id}")
def get_history(session_id: str):
    return {"session_id": session_id, "history": get_session(session_id)}

@app.post("/chat/", response_model=ChatResponse)
async def chat_text(
    message: str = Form(...),
    session_id: str = Form("default"),
    image: Optional[UploadFile] = File(None)
):
    session = get_session(session_id)
    user_parts = []

    if image:
        img_bytes = await image.read()
        # Convert to base64 string (safe for JSON)
        img_b64 = base64.b64encode(img_bytes).decode('utf-8')
        user_parts.append({
            "inline_data": {
                "mime_type": image.content_type,
                "data": img_bytes  # raw bytes for Gemini
            }
        })
    if message:
        user_parts.append({"text": message})

    session.append({"role": "user", "parts": user_parts})
    full_parts = [p for msg in session for p in msg["parts"]]

    try:
        response = await model.generate_content_async(full_parts)
        reply = response.text
        session.append({"role": "model", "parts": [{"text": reply}]})

        # Build history with base64 image (safe for JSON)
        output_history = []
        for msg in session:
            role = "user" if msg["role"] == "user" else "assistant"
            text = next((p["text"] for p in msg["parts"] if "text" in p), None)
            img = next((p["inline_data"] for p in msg["parts"] if "inline_data" in p), None)
            output_history.append(ChatMessage(
                role=role,
                text=text,
                image=base64.b64encode(img["data"]).decode('utf-8') if img else None,
                mime_type=img["mime_type"] if img else None
            ).dict())

        return ChatResponse(reply=reply, session_id=session_id, history=output_history)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/stream")
async def chat_stream(
    message: str = Form(...),
    session_id: str = Form("default"),
    image: Optional[UploadFile] = File(None)
):
    session = get_session(session_id)
    user_parts = []

    if image:
        img_bytes = await image.read()
        user_parts.append({
            "inline_data": {
                "mime_type": image.content_type,
                "data": img_bytes
            }
        })
    if message:
        user_parts.append({"text": message})

    session.append({"role": "user", "parts": user_parts})
    full_parts = [p for msg in session for p in msg["parts"]]

    return StreamingResponse(
        stream_response(full_parts),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )