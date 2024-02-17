from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from langchain_community.document_loaders import PyPDFLoader
from fastapi.responses import JSONResponse
import pytesseract
from moviepy.editor import VideoFileClip
from PIL import Image
import openai
import time
import random
import io
import os
import whisper
from llama_index.embeddings.together import TogetherEmbedding

load_dotenv()
client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
embed_model = TogetherEmbedding(
    model_name="togethercomputer/m2-bert-80M-8k-retrieval",
    api_key=os.environ["TOEGETHER_API_KEY"],
)
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
    response = embed_model.get_text_embedding(text)
    return JSONResponse(content={"text": text, "embedding": response})


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

    return JSONResponse(content=generate_embeddings_for_segments(result))


def generate_embeddings_for_segments(data):
    embeddings = []
    for segment in data["segments"]:
        attempt = 0
        while True:
            try:
                segment["embedding"] = embed_model.get_text_embedding(segment["text"])
                embeddings.append(segment)
                break
            except Exception as e:
                attempt += 1
                # wait_time = min(2**attempt + random.random(), 60)
                wait_time = 1
                print(
                    f"Rate limit hit, waiting {wait_time:.2f} seconds before retrying..."
                )
                if attempt == 10:
                    break
                time.sleep(wait_time)
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
    text = " ".join(text)
    response = embed_model.get_text_embedding(text)
    os.remove(path)
    return JSONResponse(content={"text": text, "embedding": response})
