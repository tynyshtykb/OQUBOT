import os
from dotenv import load_dotenv
from stt import SpeechRecognizer
from generate import TextGenerator
from tts import VoiceGenerator
from temporaryaudio import SoundEngine
# Загружаем ключи
load_dotenv("apikeys.env")
api_key = os.getenv("GROQ_API_KEY")
elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
# Создаем "Уши" и "Мозг" робота
ear = SpeechRecognizer(api_key=api_key)
brain = TextGenerator(api_key=api_key)
voice = VoiceGenerator(api_key=elevenlabs_key)
loading_sound = SoundEngine("loading.mp3")
CURRENT_LANG = "kk"  # Попробуй "kk"
prompt = "Сен OquBot-сың, балаларға арналған мейірімді көмекшісің. Қарапайым және түсінікті қазақ тілінде жауап бер. Максимум 2 сөйлем."
# prompt = "Ты OquBot, дружелюбный помощник для детей. Отвечай простым и понятным русским языком. Максимум 2 предложения."
# --- Симуляция работы интерфейса ---
while True:
    print("\n" + "="*40)
    print("🤖 Робот готов.")
    input("🔴 Нажми ENTER для записи...")
    ear.start() 

    input("🟢 Идет запись... Нажми ENTER для остановки...")
    text = ear.stop()  
    if text:
        print(f"\n🗣️ OquBot услышал: {text}")

        brain_response = brain.generate(
            user_text=text,
            system_prompt=prompt,
            language=CURRENT_LANG
        )
   
        if brain_response:
            print(f"🤖 OquBot ответил: {brain_response}")
            voice.speak(
                text=brain_response, 
                language=CURRENT_LANG
            )
    else:
        print("\n⚠️ Робот ничего не услышал. Попробуй еще раз.")
