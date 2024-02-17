from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from langchain_community.document_loaders import PyPDFLoader
from fastapi.responses import JSONResponse
import pytesseract
from moviepy.editor import VideoFileClip
from PIL import Image
import openai
import time
import io
import os
import whisper

load_dotenv()
client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])

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

    return JSONResponse(content=generate_embeddings_for_segments(result, client))


import time
import random


def generate_embeddings_for_segments(data, client):
    embeddings = []
    for segment in data["segments"]:
        attempt = 0
        while True:
            try:
                response = client.embeddings.create(
                    input=segment["text"], model="text-embedding-ada-002"
                )
                segment["embedding"] = response.data[0].embedding
                embeddings.append(segment)
                break
            except openai.RateLimitError:
                attempt += 1
                wait_time = min(2**attempt + random.random(), 60)
                print(
                    f"Rate limit hit, waiting {wait_time:.2f} seconds before retrying..."
                )
                if attempt == 10:
                    break
                time.sleep(wait_time)
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                break
    return embeddings


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    loader = PyPDFLoader(path)

    text_from_pages = loader.load_and_split()
    text = [page.page_content for page in text_from_pages]
    os.remove(path)
    return JSONResponse(content={"text": " ".join(text)})
