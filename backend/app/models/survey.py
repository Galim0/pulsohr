from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.sqlite import TEXT
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import uuid

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by = Column(TEXT, ForeignKey("users.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="draft")  # draft/active/finished
    is_anonymous = Column(Boolean, default=False)
    starts_at = Column(DateTime)
    ends_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    questions = relationship("Question", back_populates="survey")

class Question(Base):
    __tablename__ = "questions"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    survey_id = Column(TEXT, ForeignKey("surveys.id"))
    type = Column(String(30))  # single/multiple/scale/text
    text = Column(Text, nullable=False)
    order_num = Column(String(10))
    options = Column(JSON)      # варианты ответов
    conditions = Column(JSON)   # логика ветвления

    survey = relationship("Survey", back_populates="questions")