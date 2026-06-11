import wave
import pyaudio
import threading
from groq import Groq
import tempfile
import os
TEMP_DIR = tempfile.gettempdir()
MIC_FILE_PATH = os.path.join(TEMP_DIR, "temp_mic.wav")
class SpeechRecognizer:
    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)
        self.p = pyaudio.PyAudio()
        self.is_recording = False
        self.frames = []
        self.stream = None
        self.thread = None

    def start(self):
        if self.is_recording: return
        self.is_recording = True
        self.frames = []
        self.stream = self.p.open(format=pyaudio.paInt16, channels=1, rate=16000, 
                                  input=True, frames_per_buffer=1024)
        self.thread = threading.Thread(target=self._record_loop)
        self.thread.start()

    def _record_loop(self):
        while self.is_recording:
            try: self.frames.append(self.stream.read(1024, exception_on_overflow=False))
            except: break

    def stop(self, temp_file=MIC_FILE_PATH):
        """Остановить запись и вернуть распознанный текст"""
        if not self.is_recording: return None
        
        self.is_recording = False
        self.thread.join()
        self.stream.stop_stream()
        self.stream.close()

        # Сохраняем звук
        with wave.open(temp_file, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(self.p.get_sample_size(pyaudio.paInt16))
            w.setframerate(16000)
            w.writeframes(b"".join(self.frames))

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