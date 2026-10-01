from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# CheckIn Schemas
class CheckInCreate(BaseModel):
    student_id: int
    stress_score: int = Field(..., ge=1, le=5)
    sleep_score: int = Field(..., ge=1, le=5)
    workload_score: int = Field(..., ge=1, le=5)
    social_connection_score: int = Field(..., ge=1, le=5)
    overwhelmed_score: int = Field(..., ge=1, le=5)
    attendance_problem: bool = False
    support_requested: bool = False
    support_type: Optional[str] = None
    free_text: Optional[str] = None

class CheckInResponse(BaseModel):
    id: int
    student_id: int
    stress_score: int
    sleep_score: int
    workload_score: int
    social_connection_score: int
    overwhelmed_score: int
    attendance_problem: bool
    support_requested: bool
    support_type: Optional[str]
    free_text: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Student Schemas
class StudentResponse(BaseModel):
    id: int
    student_code: str
    name: str
    department: str
    year: str
    created_at: datetime

    class Config:
        from_attributes = True

# Support Request Schemas
class SupportRequestCreate(BaseModel):
    student_id: int
    checkin_id: Optional[int] = None
    support_type: str
    priority: Optional[str] = "Standard"
    notes: Optional[str] = None

class SupportRequestUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[str] = None

class SupportRequestResponse(BaseModel):
    id: int
    student_id: int
    checkin_id: Optional[int]
    support_type: str
    priority: str
    status: str
    assigned_to: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    student_code: Optional[str] = None
    department: Optional[str] = None

    class Config:
        from_attributes = True

# Support Resource Schemas
class SupportResourceResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    url: Optional[str]
    department: str

    class Config:
        from_attributes = True

# AI/ML Analysis Schemas
class SignalItem(BaseModel):
    name: str
    direction: str          # 'up', 'down', 'stable'
    explanation: str

class TextTopic(BaseModel):
    topic: str
    confidence: float

class AnalysisResponse(BaseModel):
    status: str             # 'stable', 'emerging_concern', 'support_recommended', 'urgent_support_pathway'
    trend: str              # 'improving', 'stable', 'worsening'
    strain_score: float     # 0.0 to 1.0
    signals: List[SignalItem]
    text_topics: List[TextTopic]
    reasons: List[str]
    recommended_support: List[str]
    consecutive_deteriorating: int = 0
    history_summary: Optional[Dict[str, Any]] = None

# Free text classification schema
class TextClassifyRequest(BaseModel):
    text: str

class TextClassifyResponse(BaseModel):
    detected_categories: List[Dict[str, Any]]

# Companion Chat Schema
class ChatRequest(BaseModel):
    message: str
    student_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    category_detected: Optional[str] = None
