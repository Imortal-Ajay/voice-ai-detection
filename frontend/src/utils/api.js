import axios from 'axios';

export const convertAudioToBase64 = async (audioUrl) => {
    try {
        const response = await axios.get(audioUrl, { responseType: 'blob' });
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // split to remove data:audio/mpeg;base64, prefix if present, 
                // but reader.result includes it. Code likely expects it or might strip it.
                // The python backend strips it if comma is present.
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
        });
    } catch (error) {
        throw new Error(`Failed to fetch audio: ${error.message}`);
    }
};

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // reader.result includes "data:audio/xyz;base64," prefix.
            // This is compatible with our python backend which strips header if comma present.
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const testApi = async (endpoint, apiKey, audioSource, language = 'en') => {
    try {
        let base64Audio;
        if (audioSource instanceof File) {
            base64Audio = await convertFileToBase64(audioSource);
        } else {
            base64Audio = await convertAudioToBase64(audioSource);
        }

        // The python code expects a JSON with "audio_base64" key.
        // It also expects x_api_key header.

        const startTime = performance.now();
        const response = await axios.post(endpoint, {
            audio_base64: base64Audio,
            language: language,
            audio_format: "mp3"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
        const endTime = performance.now();

        return {
            success: true,
            status: response.status,
            data: response.data,
            latency: Math.round(endTime - startTime)
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            data: error.response?.data || error.message,
            latency: 0
        };
    }
};
