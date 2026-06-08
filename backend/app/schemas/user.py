from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    phone: str
    name: Optional[str] = None
    role: str = "employee"
    department: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    phone: str
    name: Optional[str]
    role: str
    department: Optional[str]

    class Config:
        from_attributes = True

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    code: str