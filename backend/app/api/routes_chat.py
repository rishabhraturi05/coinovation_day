from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse
from ..services.companion_service import generate_companion_reply

router = APIRouter(prefix="/api/chat", tags=["Campus Companion"])

@router.post("/companion", response_model=ChatResponse)
def companion_chat(req: ChatRequest):
    """
    Campus Companion support navigation assistant.
    Provides empathetic guidance towards university resources without medical or diagnostic claims.
    """
    reply_data = generate_companion_reply(req.message)
    return ChatResponse(
        reply=reply_data["reply"],
        suggested_actions=reply_data.get("suggested_actions", []),
        category_detected=reply_data.get("category_detected")
    )
