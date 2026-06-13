import sounddevice as sd
import numpy as np
from elevenlabs.client import ElevenLabs

class VoiceGenerator:
    def __init__(self, api_key):
        self.client = ElevenLabs(api_key=api_key)

    def speak(self, text, voice_id="JBFqnCBsd6RMkjVDRZzb", language="kk"):
        print(f"Генерируем голос...")
        
        try:
            # Запрашиваем raw PCM 16kHz 16-bit mono
            audio_iter = self.client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2",
                output_format="pcm_16000"
            )
            
            # Собираем байты
            audio_bytes = b"".join(list(audio_iter))
            
            # Конвертируем в numpy массив
            audio_data = np.frombuffer(audio_bytes, dtype=np.int16)
            
            # Играем файл блокирующим вызовом
            sd.play(audio_data, samplerate=16000, blocking=True)
            
        except Exception as e:
            print(f"❌ Ошибка TTS: {e}")