import pygame
import os
from elevenlabs.client import ElevenLabs
import tempfile
TEMP_DIR = tempfile.gettempdir()
VOICE_FILE_PATH = os.path.join(TEMP_DIR, "temp_voice.mp3")
class VoiceGenerator:
    def __init__(self, api_key):
        self.client = ElevenLabs(api_key=api_key)
        pygame.mixer.init()
        self.temp_file = VOICE_FILE_PATH

    def speak(self, text, voice_id="JBFqnCBsd6RMkjVDRZzb", language="kk"):
        print(f"Генерируем голос...")
        
        try:
            # Получаем аудио-поток от ElevenLabs
            audio_iter = self.client.text_to_speech.stream(
                text=text,
                voice_id=voice_id,
                model_id="eleven_v3"
            )
            
            # Сохраняем во временный файл
            with open(self.temp_file, "wb") as f:
                for chunk in audio_iter:
                    if isinstance(chunk, bytes):
                        f.write(chunk)
            
            # Играем файл
            pygame.mixer.music.load(self.temp_file)
            pygame.mixer.music.play()
            
            # Ждем пока файл доиграет
            while pygame.mixer.music.get_busy():
                pygame.time.wait(100)
            
            pygame.mixer.music.unload()
            
        except Exception as e:
            print(f"❌ Ошибка TTS: {e}")