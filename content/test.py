import os
import time
from dotenv import load_dotenv
from stt import SpeechRecognizer # импорт твоего класса

load_dotenv("apikeys.env")
ear = SpeechRecognizer(api_key=os.getenv("GROQ_API_KEY"))

print("🎙️ Включаем микрофон...")
ear.start()

print("⏳ Говори 5 секунд...")
time.sleep(5) # Ждем ровно 5 секунд, пока идет фоновая запись

print("🛑 Останавливаем...")
text = ear.stop()

print(f"\n📝 Результат: {text}")