from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models.user import User
from app.models.survey import Survey, Question
from app.models.response import Response, Answer
from app.models.push_subscription import PushSubscription
from app.api import auth, surveys, responses, analytics, push
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PulseHR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://172.18.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(surveys.router)
app.include_router(responses.router)
app.include_router(analytics.router)
app.include_router(push.router)

@app.get("/")
def root():
    return {"message": "PulseHR API работает!"}

@app.get("/health")
def health():
    return {"status": "ok"}