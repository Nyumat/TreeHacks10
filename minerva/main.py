from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException
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
import httpx
import fitz
from llama_index.embeddings.together import TogetherEmbedding
import together
import json
from pydantic import BaseModel

load_dotenv()
client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
embed_model = TogetherEmbedding(
    model_name="WhereIsAI/UAE-Large-V1",
    api_key=os.environ["TOGETHER_API_KEY"],
)
together.api_key = os.environ["TOGETHER_API_KEY"]

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, query_param: str = None):
    return {"item_id": item_id, "query_param": query_param}


class ImageURL(BaseModel):
    url: str

@app.post("/upload-image/")
async def create_upload_file(image_url: ImageURL):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(image_url.url)
            response.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=f"Error fetching image from {image_url.url}: {str(exc)}")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error fetching image from {image_url.url}: HTTP Status Code {exc.response.status_code}")

        image = Image.open(io.BytesIO(response.content))

        text = pytesseract.image_to_string(image)

        response = embed_model.get_text_embedding(text)

        return JSONResponse(content={"text": text, "embedding": response})

class VideoURL(BaseModel):
    url: str

@app.post("/upload-video/")
async def create_upload_video(video_url: VideoURL):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(video_url.url)
            response.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=f"Error fetching video from {video_url.url}: {str(exc)}")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error fetching video from {video_url.url}: HTTP Status Code {exc.response.status_code}")

        video_path = f"temp_video.mp4"
        with open(video_path, "wb") as f:
            f.write(response.content)

    try:
        clip = VideoFileClip(video_path)
        audio_path = video_path + ".mp3"
        clip.audio.write_audiofile(audio_path)

        model = whisper.load_model("base")
        result = model.transcribe(audio_path)

    finally:
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
    keys_to_remove = ['temperature', 'avg_logprob', 'compression_ratio', 'no_speech_prob', 'tokens']

    cleaned_data_array = [
        {key: value for key, value in element.items() if key not in keys_to_remove}
        for element in embeddings
    ]
    return cleaned_data_array


class PDFURL(BaseModel):
    url: str

@app.post("/upload-pdf/")
async def upload_pdf(pdf_url: PDFURL):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(pdf_url.url)
            response.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=f"Error fetching PDF from {pdf_url.url}: {str(exc)}")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error fetching PDF from {pdf_url.url}: HTTP Status Code {exc.response.status_code}")
        
        pdf_path = "temp_document.pdf"
        with open(pdf_path, "wb") as f:
            f.write(response.content)

        text = ""
        response = []
        with fitz.open(pdf_path) as doc:
            text = [page.get_text() for page in doc]
            for tex in text:
                attempt = 0
                while True:
                    try:

                        segment = embed_model.get_text_embedding(tex[:2000])
                        response.append(segment)
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
        os.remove(pdf_path)

        return JSONResponse(content={"text": ' '.join(text), "embedding": response})


class QuizRequest(BaseModel):
    text: str


@app.post("/generate-quiz/")
def generate_quiz(request: QuizRequest):
    prompt = f"{request.text}\n\n create a json schema about the above with the following: {{\nquestion:  ['Right Answer', 'Wrong', 'Wrong', 'Wrong']\n}}"
    output = together.Complete.create(
        prompt=prompt,
        model="Qwen/Qwen1.5-72B-Chat",
        max_tokens=2560,
        temperature=0.8,
        top_k=60,
        top_p=0.6,
        repetition_penalty=1.1,
        stop=["<human>", "\n\n"],
    )
    print(output)
    return JSONResponse(json.loads(output["output"]["choices"][0]["text"].strip()))
