from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.sqlite import TEXT
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import uuid

class Response(Base):
    __tablename__ = "responses"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    survey_id = Column(TEXT, ForeignKey("surveys.id"))
    user_id = Column(TEXT, nullable=True)
    session_id = Column(TEXT, default=lambda: str(uuid.uuid4()))
    is_complete = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    answers = relationship("Answer", back_populates="response")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    response_id = Column(TEXT, ForeignKey("responses.id"))
    question_id = Column(TEXT, ForeignKey("questions.id"))
    text_answer = Column(Text, nullable=True)
    numeric_value = Column(Integer, nullable=True)
    selected_options = Column(JSON, nullable=True)

    response = relationship("Response", back_populates="answers")