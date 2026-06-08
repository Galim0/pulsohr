from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class QuestionCreate(BaseModel):
    type: str
    text: str
    order_num: str
    options: Optional[List[Any]] = None
    conditions: Optional[dict] = None

class QuestionResponse(BaseModel):
    id: str
    type: str
    text: str
    order_num: str
    options: Optional[List[Any]]
    conditions: Optional[dict]

    class Config:
        from_attributes = True

class SurveyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_anonymous: bool = False
    ends_at: Optional[datetime] = None
    questions: List[QuestionCreate] = []

class SurveyResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    is_anonymous: bool
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True