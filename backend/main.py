# backend/main.py  ← COPY THIS EXACT FILE
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import asyncio
import json
import os
import base64
from typing import Dict, List, Optional
import time


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

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
    image: Optional[str] = None
    mime_type: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    history: List[ChatMessage]


def get_session(session_id: str) -> List[dict]:
    return SESSIONS.setdefault(session_id, [])


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
    return {"message": "Gemini Chat API Running"}


# THIS IS THE MISSING ENDPOINT

@app.post("/chat/new")
def new_chat():
    # Use time.time() instead of get_event_loop()
    new_id = f"chat_{int(time.time() * 1000)}"
    SESSIONS[new_id] = []
    return {"session_id": new_id}

@app.post("/chat/", response_model=ChatResponse)
async def chat_text(
    message: str = Form(...),
    session_id: str = Form("default"),
    image: Optional[UploadFile] = File(None),
):
    session = get_session(session_id)
    user_parts = []

    if image:
        img_bytes = await image.read()
        user_parts.append({
            "inline_data": {
                "mime_type": image.content_type or "image/jpeg",
                "data": img_bytes,
            }
        })

    if message.strip():
        user_parts.append({"text": message})

    if not user_parts:
        raise HTTPException(status_code=400, detail="Message or image required")

    session.append({"role": "user", "parts": user_parts})
    full_parts = [part for msg in session for part in msg["parts"]]

    try:
        response = await model.generate_content_async(full_parts)
        reply = response.text or ""
        session.append({"role": "model", "parts": [{"text": reply}]})

        output_history = []
        for msg in session:
            role = "user" if msg["role"] == "user" else "assistant"
            text = next((p["text"] for p in msg["parts"] if "text" in p), None)
            img = next((p["inline_data"] for p in msg["parts"] if "inline_data" in p), None)
            output_history.append(
                ChatMessage(
                    role=role,
                    text=text,
                    image=base64.b64encode(img["data"]).decode() if img else None,
                    mime_type=img["mime_type"] if img else None,
                ).dict()
            )

        return ChatResponse(reply=reply, session_id=session_id, history=output_history)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(
    message: str = Form(...),
    session_id: str = Form("default"),
    image: Optional[UploadFile] = File(None),
):
    session = get_session(session_id)
    user_parts = []

    if image:
        img_bytes = await image.read()
        user_parts.append({
            "inline_data": {
                "mime_type": image.content_type or "image/jpeg",
                "data": img_bytes,
            }
        })

    if message.strip():
        user_parts.append({"text": message})

    if not user_parts:
        return StreamingResponse(
            iter([f"data: {json.dumps({'error': 'Message or image required'})}\n\n"]),
            media_type="text/event-stream",
        )

    session.append({"role": "user", "parts": user_parts})
    full_parts = [part for msg in session for part in msg["parts"]]

    return StreamingResponse(
        stream_response(full_parts),
        media_type="text/event-stream",
    )