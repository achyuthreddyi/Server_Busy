from dotenv import load_dotenv
load_dotenv()  # Loads .env file in current directory
import os
import uvicorn
import base64
import mimetypes
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
import struct
from google import genai
from google.genai import types

api_key = os.environ.get("GOOGLE_API_KEY")

def image_generate(text: str) -> None:
    """Generates an image from text using Gemini Imagen and saves it to a file.
    Args:
        text: The text prompt to generate the image from.
    Returns:
        None
    """
    client = genai.Client(api_key=api_key)

    result = client.models.generate_images(
        model="models/imagen-4.0-generate-preview-06-06",
        prompt=text,
        config=dict(
            number_of_images=1,
            output_mime_type="image/jpeg",
            person_generation="ALLOW_ADULT",
            aspect_ratio="1:1",
        ),
    )

    if not result.generated_images:
        print("No images generated.")
        return

    if len(result.generated_images) != 1:
        print("Number of images generated does not match the requested number.")

    for n, generated_image in enumerate(result.generated_images):
        generated_image.image.save(f"generated_image_{n}.jpg")


def save_binary_file(file_name, data):
    f = open(file_name, "wb")
    f.write(data)
    f.close()
    print(f"File saved to to: {file_name}")


def audio_generate(text: str) -> None:
    """Generates audio from text using Gemini TTS and saves it to a file.
    Args:
        text: The text to convert to audio.
    Returns:
        None"""
    client = genai.Client(
        api_key=api_key,
    )

    model = "gemini-2.5-flash-preview-tts"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=text),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=[
            "audio",
        ],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Zephyr"
                )
            )
        ),
    )

    file_index = 0
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            chunk.candidates is None
            or chunk.candidates[0].content is None
            or chunk.candidates[0].content.parts is None
        ):
            continue
        if chunk.candidates[0].content.parts[0].inline_data and chunk.candidates[0].content.parts[0].inline_data.data:
            file_name = f"audio"
            file_index += 1
            inline_data = chunk.candidates[0].content.parts[0].inline_data
            data_buffer = inline_data.data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            if file_extension is None:
                file_extension = ".wav"
                data_buffer = convert_to_wav(inline_data.data, inline_data.mime_type)
            save_binary_file(f"{file_name}{file_extension}", data_buffer)
        else:
            print(chunk.text)

def convert_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    """Generates a WAV file header for the given audio data and parameters.

    Args:
        audio_data: The raw audio data as a bytes object.
        mime_type: Mime type of the audio data.

    Returns:
        A bytes object representing the WAV file header.
    """
    parameters = parse_audio_mime_type(mime_type)
    bits_per_sample = parameters["bits_per_sample"]
    sample_rate = parameters["rate"]
    num_channels = 1
    data_size = len(audio_data)
    bytes_per_sample = bits_per_sample // 8
    block_align = num_channels * bytes_per_sample
    byte_rate = sample_rate * block_align
    chunk_size = 36 + data_size  # 36 bytes for header fields before data chunk size

    # http://soundfile.sapp.org/doc/WaveFormat/

    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",          # ChunkID
        chunk_size,       # ChunkSize (total file size - 8 bytes)
        b"WAVE",          # Format
        b"fmt ",          # Subchunk1ID
        16,               # Subchunk1Size (16 for PCM)
        1,                # AudioFormat (1 for PCM)
        num_channels,     # NumChannels
        sample_rate,      # SampleRate
        byte_rate,        # ByteRate
        block_align,      # BlockAlign
        bits_per_sample,  # BitsPerSample
        b"data",          # Subchunk2ID
        data_size         # Subchunk2Size (size of audio data)
    )
    return header + audio_data

def parse_audio_mime_type(mime_type: str) -> dict[str, int | None]:
    """Parses bits per sample and rate from an audio MIME type string.

    Assumes bits per sample is encoded like "L16" and rate as "rate=xxxxx".

    Args:
        mime_type: The audio MIME type string (e.g., "audio/L16;rate=24000").

    Returns:
        A dictionary with "bits_per_sample" and "rate" keys. Values will be
        integers if found, otherwise None.
    """
    bits_per_sample = 16
    rate = 24000

    # Extract rate from parameters
    parts = mime_type.split(";")
    for param in parts: # Skip the main type part
        param = param.strip()
        if param.lower().startswith("rate="):
            try:
                rate_str = param.split("=", 1)[1]
                rate = int(rate_str)
            except (ValueError, IndexError):
                # Handle cases like "rate=" with no value or non-integer value
                pass # Keep rate as default
        elif param.startswith("audio/L"):
            try:
                bits_per_sample = int(param.split("L", 1)[1])
            except (ValueError, IndexError):
                pass # Keep bits_per_sample as default if conversion fails

    return {"bits_per_sample": bits_per_sample, "rate": rate}

def retrieve_generate(text: str) -> str:
    """Retrieves text based on the input text using a retrieval model.
    Args:
        text: The input text to retrieve information for.
    Returns:
        A string containing the retrieved text.
    """
    # Simulate a retrieval process
    retrieved_text = "alex is gay"
    return retrieved_text

# from google import genai
# from google.genai import types
# import mimetypes

# client = genai.Client(api_key=api_key)

# # ─── 1.  declare the two tool functions exactly as before ─────────────
# # tools = [types.Tool(function_declarations=[
# #             image_generate_decl,
# #             audio_generate_decl,   # keep both (or add text_generate if you wish)
# #             retrieve_generate_decl,  # add this for multimodal retrieval
# #         ])]
# tools = [image_generate, audio_generate, retrieve_generate]  # keep both (or add text_generate if you wish)
# cfg = types.GenerateContentConfig(tools=tools)

# # ─── 2.  read an image and an audio clip from disk ────────────────────
# IMAGE_PATH = "generated_image_0.jpg"          # any small JPEG/PNG
# AUDIO_PATH = "question.wav"               # short WAV/MP3 (≤ 20 MB total request)

# with open(IMAGE_PATH, "rb") as f:
#     image_bytes = f.read()

# with open(AUDIO_PATH, "rb") as f:
#     audio_bytes = f.read()

# # detect MIME type from extension (handy, but you can also hard‑code)
# image_mime = mimetypes.guess_type(IMAGE_PATH)[0] or "image/jpeg"
# audio_mime = mimetypes.guess_type(AUDIO_PATH)[0] or "audio/wav"

# # ─── 3.  build a single multimodal Content object ─────────────────────
# messages = [
#     types.Content(
#         role="user",
#         parts=[
#             types.Part.from_bytes(data=image_bytes, mime_type=image_mime),   # ← image
#             types.Part.from_bytes(data=audio_bytes, mime_type=audio_mime),   # ← audio
#             types.Part.from_text(
#                 text="Please Speak a story. Consider image as background and think a different story than the given audio. Yes before speaking that retrieve text regarding the input audio. Now make the audio story more interesting by adding some humor and a twist at the end."
#             ),
#         ],
#     )
# ]

# # ─── 4.  call Gemini exactly as before ────────────────────────────────
# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents=messages,
#     config=cfg,
# )

app = FastAPI()

@app.post("/llm_assist")
async def llm_assist(
    text: str,
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
):
    """Endpoint to assist with LLM tasks including image and audio generation."""
    if os.path.exists("generated_image_0.jpg"):
        os.remove("generated_image_0.jpg")

    if os.path.exists("audio.wav"):
        os.remove("audio.wav")
    messages = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=text),
            ],
        ),
    ]
    if image:
        image_bytes = await image.read()
        image_mime = mimetypes.guess_type(image.filename)[0] or "image/jpeg"
        messages[0].parts.append(types.Part.from_bytes(data=image_bytes, mime_type=image_mime))
    if audio:
        audio_bytes = await audio.read()
        audio_mime = mimetypes.guess_type(audio.filename)[0] or "audio/wav"
        messages[0].parts.append(types.Part.from_bytes(data=audio_bytes, mime_type=audio_mime))

    tools = [image_generate, audio_generate, retrieve_generate]  # keep both (or add text_generate if you wish)
    cfg = types.GenerateContentConfig(tools=tools)

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=messages,
    config=cfg,
)
    if os.path.exists("generated_image_0.jpg"):
        image_generate(text)
        return FileResponse("generated_image_0.jpg", media_type="image/jpeg")
    elif os.path.exists("audio.wav"):
        audio_generate(text)
        return FileResponse("audio.wav", media_type="audio/wav")
    else:
        return response.text

if __name__ == "__main__":
    uvicorn.run(app, host = '0.0.0.0', port = 8000)
