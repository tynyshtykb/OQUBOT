import os
import sys
import threading
from dotenv import load_dotenv
import webview
import tempfile
# Импортируем твои модули
from stt import SpeechRecognizer
from generate import TextGenerator
from tts import VoiceGenerator
from temporaryaudio import SoundEngine

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)
class OquBotAPI:
    def __init__(self):
        print("Инициализация систем OquBot...")
        
        load_dotenv(resource_path("apikeys.env"))
        api_key = os.getenv("GROQ_API_KEY")
        elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")

        self.ear = SpeechRecognizer(api_key=api_key)
        self.brain = TextGenerator(api_key=api_key)
        self.voice = VoiceGenerator(api_key=elevenlabs_key)
        
        self.CURRENT_LANG = "ru"
        self.prompt = "Ты голосовой помощник для детей. Отвечай простым и понятным русским языком. Максимум 2 предложения."
        
        print("Робот готов!")

    # 1. Функция старта записи (вызывается из JS)
    def start_record(self):
        print("Микрофон включен. Идет запись...")
        self.ear.start()
        return "started"

    # 2. Функция остановки и обработки (вызывается из JS)
    def stop_and_process(self):
        print("Запись остановлена. Обработка...")
        text = self.ear.stop()
        
        if not text:
            print("Ничего не услышал.")
            return "Я ничего не услышал. Попробуй еще раз!"

        print(f"OquBot услышал: {text}")
        
        # Генерируем ответ через мозг (Groq)
        brain_response = self.brain.generate(
            user_text=text,
            system_prompt=self.prompt,
            language=self.CURRENT_LANG
        )
        
        if brain_response:
            print(f"OquBot ответил: {brain_response}")
            # Озвучиваем ответ (ElevenLabs)
            self.voice.speak(
                text=brain_response, 
                language=self.CURRENT_LANG
            )
            # Возвращаем текст обратно в окно интерфейса
            return brain_response
            
        return "Произошла ошибка при генерации ответа."

# --- ЗАПУСК ПРИЛОЖЕНИЯ ---
if __name__ == '__main__':
    # 1. Создаем наш API-мост
    api = OquBotAPI()

    # 2. Указываем путь к нашему интерфейсу (папка content, файл index.html)
    html_file_path = resource_path(os.path.join('block_programming', 'index.html'))

    # 3. Создаем и открываем окно приложения
    window = webview.create_window(
        title='OquBot - Среда программирования',
        url=html_file_path,
        js_api=api,
        width=1024,
        height=768,
        min_size=(800, 600)
    )

    # Запуск
    webview.start(debug=True) # debug=True можно убрать перед финальной компиляцией