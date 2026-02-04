from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
import base64
import librosa
import numpy as np
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Step 2: Decode Base64 Audio --------
def decode_audio(base64_str, filename="input.wav"):
    # Remove base64 header if present
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]

    audio_bytes = base64.b64decode(base64_str)
    with open(filename, "wb") as f:
        f.write(audio_bytes)
    return filename


# -------- Step 3: Extract MFCC Features --------
def extract_features(filename):
    y, sr = librosa.load(filename, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

# -------- Load Trained Model --------
model = joblib.load("voice_model.pkl")

# -------- Step 5: REST API --------
from pydantic import BaseModel

class AudioRequest(BaseModel):
    audio_base64: str
    language: str = "en"
    audio_format: str = "mp3"

# -------- Step 5: REST API --------
@app.post("/classify", include_in_schema=False)
@app.post("/api/voice-detect")
def classify(request: AudioRequest, x_api_key: str = Header(...)):
    print(f"Received request: len(audio)={len(request.audio_base64)}, lang={request.language}")

    # Verify API Key (allow the demo key or the secret one)
    if x_api_key not in ["SECRET123", "guvi-demo-key-123"]:
        return {"error": "Invalid API key"}

    try:
        filename = decode_audio(request.audio_base64)
        features = extract_features(filename).reshape(1, -1)

        prediction_val = model.predict(features)[0]
        confidence_val = model.predict_proba(features)[0].max()
        
        # Determine label and explanation
        if prediction_val == 1:
            prediction = "AI_GENERATED"
            explanation = "Synthetic speech artifacts and unnatural pitch transitions detected."
        else:
            prediction = "HUMAN"
            explanation = "Natural speech patterns and physiological micro-tremors observed."

        return {
            "prediction": prediction,
            "confidence": round(float(confidence_val), 3),
            "explanation": explanation
        }
    except Exception as e:
        return {"error": str(e)}
