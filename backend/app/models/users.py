from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.sqlite import TEXT
from app.core.database import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True, nullable=False)
    name = Column(String(100))
    role = Column(String(20), default="employee")  # employee / hr
    department = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)