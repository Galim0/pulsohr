from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.survey import Survey, Question
from app.models.response import Response, Answer

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/{survey_id}")
def get_analytics(survey_id: str, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    total_responses = db.query(Response).filter(
        Response.survey_id == survey_id,
        Response.is_complete == True
    ).count()

    questions = db.query(Question).filter(Question.survey_id == survey_id).all()
    questions_stats = []

    for q in questions:
        answers = db.query(Answer).filter(Answer.question_id == q.id).all()

        if q.type == 'scale':
            values = [a.numeric_value for a in answers if a.numeric_value is not None]
            avg = round(sum(values) / len(values), 1) if values else 0
            distribution = {str(i): values.count(i) for i in range(1, 6)}
            questions_stats.append({
                "question": q.text,
                "type": q.type,
                "total_answers": len(values),
                "average": avg,
                "distribution": distribution,
            })

        elif q.type == 'text':
            texts = [a.text_answer for a in answers if a.text_answer]
            questions_stats.append({
                "question": q.text,
                "type": q.type,
                "total_answers": len(texts),
                "answers": texts[:10],
            })

        elif q.type in ('single', 'multiple'):
            counts = {}
            for a in answers:
                opts = a.selected_options or []
                for opt in opts:
                    counts[opt] = counts.get(opt, 0) + 1
            questions_stats.append({
                "question": q.text,
                "type": q.type,
                "total_answers": len(answers),
                "distribution": counts,
            })

    return {
        "survey_title": survey.title,
        "total_responses": total_responses,
        "questions": questions_stats,
    }