from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import OTPRequest, OTPVerify, UserResponse
import random

router = APIRouter(prefix="/auth", tags=["auth"])

# Временное хранилище кодов (в реальном проекте — Redis)
otp_storage = {}

@router.post("/send-otp")
def send_otp(data: OTPRequest):
    # В MVP генерируем код и просто возвращаем его (имитация SMS)
    code = str(random.randint(1000, 9999))
    otp_storage[data.phone] = code
    print(f"OTP для {data.phone}: {code}")  # видно в терминале
    return {"message": "Код отправлен", "debug_code": code}

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    code = otp_storage.get(data.phone)
    if not code or code != data.code:
        raise HTTPException(status_code=400, detail="Неверный код")

    # Ищем пользователя или создаём нового
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        user = User(phone=data.phone)
        db.add(user)
        db.commit()
        db.refresh(user)

    del otp_storage[data.phone]
    return user