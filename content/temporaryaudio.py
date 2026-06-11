
import os

class SoundEngine:
    def __init__(self, sound_file="loading.mp3"):
        self.sound_file = sound_file
        pygame.mixer.init()

    def start(self):
        """Запуск фоновой музыки в бесконечном цикле"""
        if os.path.exists(self.sound_file):
            pygame.mixer.music.load(self.sound_file)
            pygame.mixer.music.set_volume(0.4) # Громкость 40%
            pygame.mixer.music.play(-1) # -1 = бесконечный повтор
        else:
            print(f"Файл {self.sound_file} не найден!")

    def stop(self):
        """Остановка музыки"""
        pygame.mixer.music.stop()
        pygame.mixer.music.unload()