from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.response import Response, Answer
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/responses", tags=["responses"])

class AnswerCreate(BaseModel):
    question_id: str
    text_answer: Optional[str] = None
    numeric_value: Optional[int] = None
    selected_options: Optional[List] = None

class ResponseCreate(BaseModel):
    survey_id: str
    user_id: Optional[str] = None
    answers: List[AnswerCreate]

@router.post("/")
def submit_response(data: ResponseCreate, db: Session = Depends(get_db)):
    response = Response(
        survey_id=data.survey_id,
        user_id=data.user_id,
        is_complete=True
    )
    db.add(response)
    db.flush()

    for a in data.answers:
        answer = Answer(
            response_id=response.id,
            question_id=a.question_id,
            text_answer=a.text_answer,
            numeric_value=a.numeric_value,
            selected_options=a.selected_options
        )
        db.add(answer)

    db.commit()
    return {"message": "Ответы сохранены", "response_id": response.id}