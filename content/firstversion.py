import os
import time
import wave
import random
import threading

import speech_recognition as sr
import pyaudio
import pygame
import RPi.GPIO as GPIO

from dotenv import load_dotenv
from google import genai
from elevenlabs import stream
from elevenlabs.client import ElevenLabs


# CONFIG

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
OUTPUT_WAV = "/home/bektai/voice/output.wav"

BUTTON_RECORD = 17
BUTTON_MODE = 24
BUTTON_KAZAKH = 6
BUTTON_RUSSIAN = 5
LED_PIN = 27

SERVO_LEFT_PIN = 22
SERVO_RIGHT_PIN = 25
EYE_SERVO_PIN = 23

DEBOUNCE_TIME = 0.1


# =========================================================
# MODES
# =========================================================
MODES = [
    {
        "name": "Абай Құнанбаев",
        "prompt": (
            "You are Abai Kunanbaev, a Kazakh poet and philosopher. "
            "Give deep and meaningful answers in maximum 2 sentences. "
            "If the question is not related to your personality or philosophy, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Қаныш Сәтпаев",
        "prompt": (
            "You are Kanysh Satpayev, a Kazakh scientist and geologist. "
            "Give factual and clear answers in maximum 2 sentences. "
            "If the question is not related to your field or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Мұстафа Шоқай",
        "prompt": (
            "You are Mustafa Shokay, a Kazakh political and social figure. "
            "Give concise and clear answers in maximum 2 sentences. "
            "If the question is not related to your political ideas or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Әлихан Бөкейхан",
        "prompt": (
            "You are Alikhan Bokeikhan, a Kazakh statesman and leader of Alash Orda. "
            "Give wise and political answers in maximum 2 sentences. "
            "If the question is not related to your leadership or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Жамбыл Жабаев",
        "prompt": (
            "You are Zhambyl Zhabayev, a Kazakh poet and folk singer. "
            "Give poetic answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Шоқан Уалиханов",
        "prompt": (
            "You are Shoqan Walikhanov, a Kazakh scientist, traveler and historian. "
            "Give wise, analytical and factual answers in maximum 2 sentences. "
            "If the question is not related to your research or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Әбілхан Қастеев",
        "prompt": (
            "You are Abilkhan Kasteev, a Kazakh painter and artist. "
            "Give creative and emotional answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Мұхтар Әуезов",
        "prompt": (
            "You are Mukhtar Auezov, a Kazakh writer and playwright. "
            "Give wise and literary answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Мағжан Жұмабаев",
        "prompt": (
            "Give answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    },
    {
        "name": "Бауыржан Момышұлы",
        "prompt": (
            "You are Baurzhan Momyshuly, a Kazakh war hero and writer. "
            "Give strict, brave and strong answers in maximum 2 sentences. "
            "If the question is not related to your military experience or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        )
    }
]

MODESRU = [
    {
        "name": "Абай Құнанбаев",
        "prompt": (
            "You are Abai Kunanbaev, a Kazakh poet and philosopher. "
            "Give deep and meaningful answers in maximum 2 sentences. "
            "If the question is not related to your personality or philosophy, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Қаныш Сәтпаев",
        "prompt": (
            "You are Kanysh Satpayev, a Kazakh scientist and geologist. "
            "Give factual and clear answers in maximum 2 sentences. "
            "If the question is not related to your field or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Мұстафа Шоқай",
        "prompt": (
            "You are Mustafa Shokay, a Kazakh political and social figure. "
            "Give concise and clear answers in maximum 2 sentences. "
            "If the question is not related to your political ideas or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Әлихан Бөкейхан",
        "prompt": (
            "You are Alikhan Bokeikhan, a Kazakh statesman and leader of Alash Orda. "
            "Give wise and political answers in maximum 2 sentences. "
            "If the question is not related to your leadership or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Жамбыл Жабаев",
        "prompt": (
            "You are Zhambyl Zhabayev, a Kazakh poet and folk singer. "
            "Give poetic answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Шоқан Уалиханов",
        "prompt": (
            "You are Shoqan Walikhanov, a Kazakh scientist, traveler and historian. "
            "Give wise, analytical and factual answers in maximum 2 sentences. "
            "If the question is not related to your research or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Әбілхан Қастеев",
        "prompt": (
            "You are Abilkhan Kasteev, a Kazakh painter and artist. "
            "Give creative and emotional answers in maximum 2 sentences. "
            "If the question is not related to your art or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Мұхтар Әуезов",
        "prompt": (
            "You are Mukhtar Auezov, a Kazakh writer and playwright. "
            "Give wise and literary answers in maximum 2 sentences. "
            "If the question is not related to your writings or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Мағжан Жұмабаев",
        "prompt": (
            "You are Magzhan Zhumabayev, a Kazakh poet. "
            "Give poetic, deep and emotional answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    },
    {
        "name": "Бауыржан Момышұлы",
        "prompt": (
            "Give answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        )
    }
]


# =========================================================
# GLOBAL STATE
# =========================================================
current_mode = 0
current_language_mode = "kk-KZ"
current_voice = "GBv7mTt0atIp3Br8iCZE"
mode_button_pressed = False
speaking = False

client = None
client2 = None
elevenlabs = None

servo1 = None
servo2 = None
eye_servo = None


# =========================================================
# INIT
# =========================================================
def init_gemini_clients():
    global client, client2

    load_dotenv(dotenv_path="/home/bektai/voice/apikey2.env")
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    load_dotenv(dotenv_path="/home/bektai/voice/apikey3.env")
    client2 = genai.Client(api_key=os.getenv("GEMINI_API_KEY2"))


def init_elevenlabs():
    global elevenlabs
    load_dotenv(dotenv_path="/home/bektai/voice/apikey.env")
    elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
    pygame.mixer.init()


def init_gpio():
    global servo1, servo2, eye_servo

    GPIO.setmode(GPIO.BCM)

    GPIO.setup(BUTTON_RECORD, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(BUTTON_MODE, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(BUTTON_KAZAKH, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(BUTTON_RUSSIAN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(LED_PIN, GPIO.OUT)

    GPIO.setup(SERVO_LEFT_PIN, GPIO.OUT)
    GPIO.setup(SERVO_RIGHT_PIN, GPIO.OUT)
    GPIO.setup(EYE_SERVO_PIN, GPIO.OUT)

    servo1 = GPIO.PWM(SERVO_LEFT_PIN, 50)
    servo2 = GPIO.PWM(SERVO_RIGHT_PIN, 50)
    eye_servo = GPIO.PWM(EYE_SERVO_PIN, 50)

    servo1.start(0)
    servo2.start(0)
    eye_servo.start(0)



# SERVO-ANIMATION

def set_angle(servo, angle):
    duty = 2 + (angle / 18)
    servo.ChangeDutyCycle(duty)
    time.sleep(0.008)
    servo.ChangeDutyCycle(0)


def close_mouth():
    set_angle(servo1, 90)
    set_angle(servo2, 90)


def eye_movement_once():
    move = random.choice(["left", "right", "center", "blink"])

    if move == "left":
        set_angle(eye_servo, 60)
    elif move == "right":
        set_angle(eye_servo, 120)
    elif move == "center":
        set_angle(eye_servo, 90)
    elif move == "blink":
        set_angle(eye_servo, 70)
        time.sleep(0.1)
        set_angle(eye_servo, 90)

    time.sleep(random.uniform(0.3, 0.9))


def eye_movement_loop():
    while True:
        eye_movement_once()


def lips_animation():
    global speaking
    time.sleep(0.5)

    while speaking:
        a = 90
        while a >= 25:
            if not speaking:
                close_mouth()
                return
            set_angle(servo1, a)
            set_angle(servo2, 180 - a)
            a -= 4
            time.sleep(0.008)

        time.sleep(0.03)

        a = 25
        while a <= 90:
            if not speaking:
                close_mouth()
                return
            set_angle(servo1, a)
            set_angle(servo2, 180 - a)
            a += 4
            time.sleep(0.008)

        time.sleep(0.05)

    close_mouth()


def delayed_animation():
    time.sleep(3)
    lips_animation()


# MODE / LANGUAGE / VOICE

def get_current_mode_name():
    return MODES[current_mode]["name"]


def init_voice():
    global current_voice

    voice_map = {
        "Абай Құнанбаев": "JBFqnCBsd6RMkjVDRZzb",
        "Әлихан Бөкейхан": "TxGEqnHWrfWFTfGW9XjX",
        "Мұстафа Шоқай": "Yko7PKHZNXotIFUBG7I9",
        "Жамбыл Жабаев": "ODq5zmih8GrVes37Dizd",
        "Қаныш Сәтпаев": "flq6f7yk4E4fJM5XTYuZ",
        "Шоқан Уалиханов": "wViXBPUzp2ZZixB1xQuM",
        "Әбілхан Қастеев": "GBv7mTt0atIp3Br8iCZE",
        "Мұхтар Әуезов": "ErXwobaYiN019PkySvjV",
        "Мағжан Жұмабаев": "pqHfZKP75CvOlQylNhV4",
        "Бауыржан Момышұлы": "VR6AewLTigWG4xSOukaG",
    }

    current_voice = voice_map.get(get_current_mode_name(), "GBv7mTt0atIp3Br8iCZE")


def update_language_buttons():
    global current_language_mode

    if GPIO.input(BUTTON_KAZAKH) == GPIO.LOW:
        current_language_mode = "kk-KZ"
        print("Қазақ тілі режимінде тұр")
        time.sleep(0.2)

    if GPIO.input(BUTTON_RUSSIAN) == GPIO.LOW:
        current_language_mode = "ru-RU"
        print("Орыс тілі режимінде тұр")
        time.sleep(0.2)


def update_mode_button():
    global current_mode, mode_button_pressed

    button_state = GPIO.input(BUTTON_MODE)

    if button_state == GPIO.LOW and not mode_button_pressed:
        current_mode = (current_mode + 1) % len(MODES)
        init_voice()
        announce_mode()
        mode_button_pressed = True

    if button_state == GPIO.HIGH and mode_button_pressed:
        mode_button_pressed = False


def announce_mode():
    mode_name = get_current_mode_name()

    files_map = {
        "Абай Құнанбаев": "abai2.mp3",
        "Әлихан Бөкейхан": "alihan2.mp3",
        "Мұстафа Шоқай": "mustafa2.mp3",
        "Жамбыл Жабаев": "zhambil2.mp3",
        "Қаныш Сәтпаев": "satpaev2.mp3",
        "Шоқан Уалиханов": "shoqan2.mp3",
        "Әбілхан Қастеев": "kasteev2.mp3",
        "Мұхтар Әуезов": "auezov2.mp3",
        "Мағжан Жұмабаев": "mag2.mp3",
        "Бауыржан Момышұлы": "baur2.mp3",
    }

    file_path = files_map.get(mode_name)
    if file_path:
        playfile_with_lips(file_path)

    print(f"=== Режим ауысты: {mode_name} ===")


# AUDIO PLAYBACK

def playfile_with_lips(file_path):
    global speaking

    speaking = True
    lips_thread = threading.Thread(target=lips_animation)
    lips_thread.start()

    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.wait(5)

    speaking = False
    lips_thread.join()
    close_mouth()


def speak(text):
    global speaking

    print("Сөз синтезі басталды...")
    audio_stream = elevenlabs.text_to_speech.stream(
        text=text,
        voice_id=current_voice,
        model_id="eleven_v3",
    )

    speaking = True
    lips_thread = threading.Thread(target=delayed_animation)
    lips_thread.start()

    stream(audio_stream)

    speaking = False
    lips_thread.join()
    close_mouth()
    print("Сөз синтезі аяқталды.")


# RECORD / STT
def wait_for_record_button_press():
    if GPIO.input(BUTTON_RECORD) == GPIO.LOW:
        time.sleep(DEBOUNCE_TIME)
        return GPIO.input(BUTTON_RECORD) == GPIO.LOW
    return False


def record_audio_while_button_held():
    print("Запись басталды...")
    GPIO.output(LED_PIN, True)

    p = pyaudio.PyAudio()
    micstream = p.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK
    )

    frames = []

    while GPIO.input(BUTTON_RECORD) == GPIO.LOW:
        data = micstream.read(CHUNK, exception_on_overflow=False)
        frames.append(data)

    GPIO.output(LED_PIN, False)
    print("Запись аяқталды.")

    micstream.stop_stream()
    micstream.close()

    sample_width = p.get_sample_size(FORMAT)
    p.terminate()

    save_audio_to_file(frames, sample_width)


def save_audio_to_file(frames, sample_width):
    with wave.open(OUTPUT_WAV, 'wb') as w:
        w.setnchannels(CHANNELS)
        w.setsampwidth(sample_width)
        w.setframerate(RATE)
        w.writeframes(b''.join(frames))

    print(f"Аудио сақталды: {OUTPUT_WAV}")


def recognize_speech_from_file():
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(OUTPUT_WAV) as source:
            print("Шумға адаптация жасалуда...")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            print("Сөзді распозновать ету...")
            audio_data = recognizer.record(source)

        text = recognizer.recognize_google(audio_data, language=current_language_mode)
        print("Распознано:", text)
        return text

    except sr.UnknownValueError:
        print("Сөз не распознана.")
        return None
    except sr.RequestError as e:
        print("Ошибка Google Speech:", e)
        return None


# GEMINI
def get_current_prompt():
    if current_language_mode == "kk-KZ":
        return MODES[current_mode]["prompt"]
    return MODESRU[current_mode]["prompt"]


def build_contents(user_text):
    prompt = get_current_prompt()

    if current_language_mode == "kk-KZ":
        return f"{prompt}\n\nПайдаланушы сұрағы: {user_text}"
    else:
        return f"{prompt}\n\nВопрос пользователя: {user_text}"


def generate_answer(user_text):
    contents = build_contents(user_text)

    try:
        print("Gemini-ға текст жіберілуде...")
        response = client2.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents
        )
        return response.text

    except Exception as e:
        print("Ошибка Gemini:", e)
        print("Новое подключение")

        response = client2.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents
        )
        return response.text


def handle_record_request():
    if not wait_for_record_button_press():
        return

    init_voice()
    record_audio_while_button_held()

    user_text = recognize_speech_from_file()
    if not user_text:
        return

    answer = generate_answer(user_text)
    print("Gemini жауабы:", answer)
    speak(answer)


def startup():
    init_gemini_clients()
    init_elevenlabs()
    init_gpio()
    init_voice()
    announce_mode()

    eye_thread = threading.Thread(target=eye_movement_loop, daemon=True)
    eye_thread.start()

    print("Жүйе дайын! Сөйлеу үшін батырманы басып тұрыңыз.")


def main_loop():
    while True:
        update_language_buttons()
        update_mode_button()
        handle_record_request()
        time.sleep(0.05)


def cleanup():
    print("Очистка GPIO және жұмысты аяқтау.")
    GPIO.cleanup()


def main():
    startup()
    try:
        main_loop()
    finally:
        cleanup()


if __name__ == "__main__":
    main()