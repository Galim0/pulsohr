from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.survey import Survey, Question
from app.schemas.survey import SurveyCreate, SurveyResponse
from typing import List

router = APIRouter(prefix="/surveys", tags=["surveys"])

@router.post("/", response_model=SurveyResponse)
def create_survey(data: SurveyCreate, db: Session = Depends(get_db)):
    survey = Survey(
        title=data.title,
        description=data.description,
        is_anonymous=data.is_anonymous,
        ends_at=data.ends_at,
        status="draft"
    )
    db.add(survey)
    db.flush()

    for q in data.questions:
        question = Question(
            survey_id=survey.id,
            type=q.type,
            text=q.text,
            order_num=q.order_num,
            options=q.options,
            conditions=q.conditions
        )
        db.add(question)

    db.commit()
    db.refresh(survey)
    return survey

@router.get("/", response_model=List[SurveyResponse])
def get_surveys(db: Session = Depends(get_db)):
    return db.query(Survey).all()

@router.get("/{survey_id}", response_model=SurveyResponse)
def get_survey(survey_id: str, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Опрос не найден")
    return survey

@router.patch("/{survey_id}/publish")
def publish_survey(survey_id: str, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Опрос не найден")
    survey.status = "active"
    db.commit()
    return {"message": "Опрос опубликован"}