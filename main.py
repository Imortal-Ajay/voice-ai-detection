from fastapi import FastAPI, Header
import base64
import librosa
import numpy as np
import joblib
import os

app = FastAPI()

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
@app.post("/classify")
def classify(audio_base64: str, x_api_key: str = Header(...)):

    if x_api_key != "SECRET123":
        return {"error": "Invalid API key"}

    filename = decode_audio(audio_base64)
    features = extract_features(filename).reshape(1, -1)

    prediction = model.predict(features)[0]
    confidence = model.predict_proba(features)[0].max()

    return {
        "result": "AI_GENERATED" if prediction == 1 else "HUMAN",
        "confidence": round(float(confidence), 3)
    }
