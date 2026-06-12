import sounddevice as sd
import soundfile as sf
import threading
from groq import Groq
import tempfile
import os
import numpy as np

TEMP_DIR = tempfile.gettempdir()
MIC_FILE_PATH = os.path.join(TEMP_DIR, "temp_mic.wav")

class SpeechRecognizer:
    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)
        self.is_recording = False
        self.frames = []
        self.stream = None
        self.thread = None

    def start(self):
        if self.is_recording: return
        self.is_recording = True
        self.frames = []
        
        def callback(indata, frames, time, status):
            if status:
                print(status)
            if self.is_recording:
                self.frames.append(indata.copy())

        self.stream = sd.InputStream(samplerate=16000, channels=1, dtype='int16', callback=callback)
        self.stream.start()

    def stop(self, temp_file=MIC_FILE_PATH):
        """Остановить запись и вернуть распознанный текст"""
        if not self.is_recording: return None
        
        self.is_recording = False
        if self.stream:
            self.stream.stop()
            self.stream.close()

        if not self.frames:
            return None

        # Сохраняем звук
        audio_data = np.concatenate(self.frames, axis=0)
        sf.write(temp_file, audio_data, 16000)

        # Отправляем в Groq Whisper
        try:
            with open(temp_file, "rb") as f:
                res = self.client.audio.transcriptions.create(
                    file=(temp_file, f.read()),
                    model="whisper-large-v3",
                    prompt="Бұл қазақ және орыс тіліндегі аралас мәтін. Это смешанный текст."
                )
            return res.text
        except Exception as e:
            print(f"Ошибка STT: {e}")
            return None