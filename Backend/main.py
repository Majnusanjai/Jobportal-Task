from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import Optional
import shutil
import os

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="majnusanjai2001*",
        database="jobportal"
    )

class Applicant(BaseModel):
    name: str
    email: str
    job_id: str

@app.post("/apply")
async def apply_job(
    name: str = Form(...),
    email: str = Form(...),
    job_id: str = Form(...),
    resume: UploadFile = File(...)
):
    # Create resumes directory if it doesn't exist
    resumes_dir = "resumes"
    if not os.path.exists(resumes_dir):
        os.makedirs(resumes_dir)
    
    # Save resume with proper path joining
    resume_path = os.path.join(resumes_dir, resume.filename)
    with open(resume_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)
    
    # Store in database
    db = get_db()
    cursor = db.cursor()
    query = "INSERT INTO applicants (name, email, job_id, resume_path) VALUES (%s, %s, %s, %s)"
    values = (name, email, job_id, resume_path)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    
    return {"message": "Application submitted successfully"}

@app.get("/applicants")
async def get_applicants():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM applicants")
    applicants = cursor.fetchall()
    cursor.close()
    db.close()
    return applicants