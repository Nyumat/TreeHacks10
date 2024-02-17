from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pytesseract
from moviepy.editor import VideoFileClip
from PIL import Image
from openai import OpenAI
import io
import os
import whisper

load_dotenv()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, query_param: str = None):
    return {"item_id": item_id, "query_param": query_param}


@app.post("/upload-image/")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    text = pytesseract.image_to_string(image)

    return JSONResponse(content={"text": text})


@app.post("/upload-video/")
async def create_upload_video(file: UploadFile = File(...)):
    video_path = f"temp_{file.filename}"
    with open(video_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    clip = VideoFileClip(video_path)
    audio_path = video_path + ".mp3"
    clip.audio.write_audiofile(audio_path)

    model = whisper.load_model("base")
    result = model.transcribe(audio_path)

    clip.close()
    os.remove(video_path)
    os.remove(audio_path)

    return JSONResponse(content=result)
