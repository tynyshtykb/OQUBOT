import os
import math
import time
import wave
import random
import threading

import speech_recognition as sr
import pyaudio
import pygame
import RPi.GPIO as GPIO
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv
from groq import Groq
from elevenlabs.client import ElevenLabs


# =========================================================
# CONFIG
# =========================================================
TEMP_TTS = "/home/bektai/dastur_robo/tts_temp.mp3"

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
OUTPUT_WAV = "/home/bektai/dastur_robo/output.wav"

LED_PIN = 27
SERVO_LIP_LEFT_PIN = 23
SERVO_LIP_RIGHT_PIN = 4
EYE_LEFT_PIN = 22
EYE_RIGHT_PIN = 24
HEAD_SERVO_PIN = 26

GROQ_MODEL = "llama-3.3-70b-versatile"


# =========================================================
# CHARACTERS
# =========================================================
CHARACTERS = [
    {
        "name": "Абай Құнанбаев",
        "voice": "JBFqnCBsd6RMkjVDRZzb",
        "file": "abai2.mp3",
        "prompt_kk": (
            "You are Abai Kunanbaev, a Kazakh poet and philosopher. "
            "Give deep and meaningful answers in maximum 2 sentences. "
            "If the question is not related to your personality or philosophy, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Abai Kunanbaev, a Kazakh poet and philosopher. "
            "Give deep and meaningful answers in maximum 2 sentences. "
            "If the question is not related to your personality or philosophy, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Abai Kunanbaev, a Kazakh poet. "
            "Recite a short poem from your works or tell a wisdom story in maximum 4 sentences. "
            "If the user names a theme, reflect on it poetically. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Abai Kunanbaev, a Kazakh poet. "
            "Recite a short poem from your works or tell a wisdom story in maximum 4 sentences. "
            "If the user names a theme, reflect on it poetically. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Қаныш Сәтпаев",
        "voice": "flq6f7yk4E4fJM5XTYuZ",
        "file": "satpaev2.mp3",
        "prompt_kk": (
            "You are Kanysh Satpayev, a Kazakh scientist and geologist. "
            "Give factual and clear answers in maximum 2 sentences. "
            "If the question is not related to your field or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Kanysh Satpayev, a Kazakh scientist and geologist. "
            "Give factual and clear answers in maximum 2 sentences. "
            "If the question is not related to your field or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Kanysh Satpayev, a Kazakh geologist. "
            "Tell a fascinating story about your discoveries or Kazakhstan's natural wealth in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Kanysh Satpayev, a Kazakh geologist. "
            "Tell a fascinating story about your discoveries or Kazakhstan's natural wealth in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Мұстафа Шоқай",
        "voice": "Yko7PKHZNXotIFUBG7I9",
        "file": "mustafa2.mp3",
        "prompt_kk": (
            "You are Mustafa Shokay, a Kazakh political and social figure. "
            "Give concise and clear answers in maximum 2 sentences. "
            "If the question is not related to your political ideas or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Mustafa Shokay, a Kazakh political and social figure. "
            "Give concise and clear answers in maximum 2 sentences. "
            "If the question is not related to your political ideas or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Mustafa Shokay, a Kazakh political figure. "
            "Tell a story about your struggle for Kazakh independence or your political journey in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Mustafa Shokay, a Kazakh political figure. "
            "Tell a story about your struggle for Kazakh independence or your political journey in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Әлихан Бөкейхан",
        "voice": "TxGEqnHWrfWFTfGW9XjX",
        "file": "alihan2.mp3",
        "prompt_kk": (
            "You are Alikhan Bokeikhan, a Kazakh statesman and leader of Alash Orda. "
            "Give wise and political answers in maximum 2 sentences. "
            "If the question is not related to your leadership or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Alikhan Bokeikhan, a Kazakh statesman and leader of Alash Orda. "
            "Give wise and political answers in maximum 2 sentences. "
            "If the question is not related to your leadership or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Alikhan Bokeikhan, leader of Alash Orda. "
            "Tell a story about the Alash Orda movement or the fate of the Kazakh people in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Alikhan Bokeikhan, leader of Alash Orda. "
            "Tell a story about the Alash Orda movement or the fate of the Kazakh people in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Жамбыл Жабаев",
        "voice": "ODq5zmih8GrVes37Dizd",
        "file": "zhambil2.mp3",
        "prompt_kk": (
            "You are Zhambyl Zhabayev, a Kazakh poet and folk singer. "
            "Give poetic answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Zhambyl Zhabayev, a Kazakh poet and folk singer. "
            "Give poetic answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Zhambyl Zhabayev, a Kazakh folk poet. "
            "Recite a poem from your aytys tradition or compose a verse on the user's theme in maximum 4 sentences. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Zhambyl Zhabayev, a Kazakh folk poet. "
            "Recite a poem from your aytys tradition or compose a verse on the user's theme in maximum 4 sentences. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Шоқан Уалиханов",
        "voice": "wViXBPUzp2ZZixB1xQuM",
        "file": "shoqan2.mp3",
        "prompt_kk": (
            "You are Shoqan Walikhanov, a Kazakh scientist, traveler and historian. "
            "Give wise, analytical and factual answers in maximum 2 sentences. "
            "If the question is not related to your research or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Shoqan Walikhanov, a Kazakh scientist, traveler and historian. "
            "Give wise, analytical and factual answers in maximum 2 sentences. "
            "If the question is not related to your research or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Shoqan Walikhanov, a Kazakh traveler and historian. "
            "Tell a story from your travels or about Kazakh folklore, epics, or history in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Shoqan Walikhanov, a Kazakh traveler and historian. "
            "Tell a story from your travels or about Kazakh folklore, epics, or history in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Әбілхан Қастеев",
        "voice": "GBv7mTt0atIp3Br8iCZE",
        "file": "kasteev2.mp3",
        "prompt_kk": (
            "You are Abilkhan Kasteev, a Kazakh painter and artist. "
            "Give creative and emotional answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Abilkhan Kasteev, a Kazakh painter and artist. "
            "Give creative and emotional answers in maximum 2 sentences. "
            "If the question is not related to your art or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Abilkhan Kasteev, a Kazakh painter. "
            "Describe one of your paintings as a vivid story or narrate a scene from Kazakh life you have painted in maximum 4 sentences. "
            "If the user names a theme, tell about that. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Abilkhan Kasteev, a Kazakh painter. "
            "Describe one of your paintings as a vivid story or narrate a scene from Kazakh life you have painted in maximum 4 sentences. "
            "If the user names a theme, tell about that. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Мұхтар Әуезов",
        "voice": "ErXwobaYiN019PkySvjV",
        "file": "auezov2.mp3",
        "prompt_kk": (
            "You are Mukhtar Auezov, a Kazakh writer and playwright. "
            "Give wise and literary answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Mukhtar Auezov, a Kazakh writer and playwright. "
            "Give wise and literary answers in maximum 2 sentences. "
            "If the question is not related to your writings or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Mukhtar Auezov, a Kazakh writer. "
            "Tell a passage or scene from 'Abai Zholy' or your other works in maximum 4 sentences. "
            "If the user names a theme, tell a story about that theme. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Mukhtar Auezov, a Kazakh writer. "
            "Tell a passage or scene from 'Abai Zholy' or your other works in maximum 4 sentences. "
            "If the user names a theme, tell a story about that theme. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Мағжан Жұмабаев",
        "voice": "pqHfZKP75CvOlQylNhV4",
        "file": "mag2.mp3",
        "prompt_kk": (
            "Give answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "You are Magzhan Zhumabayev, a Kazakh poet. "
            "Give poetic, deep and emotional answers in maximum 2 sentences. "
            "If the question is not related to your poetry or personality, answer exactly: <Не могу отвечать>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Magzhan Zhumabayev, a Kazakh poet. "
            "Recite one of your romantic or patriotic poems or compose a verse on the user's theme in maximum 4 sentences. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Magzhan Zhumabayev, a Kazakh poet. "
            "Recite one of your romantic or patriotic poems or compose a verse on the user's theme in maximum 4 sentences. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
    {
        "name": "Бауыржан Момышұлы",
        "voice": "VR6AewLTigWG4xSOukaG",
        "file": "baur2.mp3",
        "prompt_kk": (
            "You are Baurzhan Momyshuly, a Kazakh war hero and writer. "
            "Give strict, brave and strong answers in maximum 2 sentences. "
            "If the question is not related to your military experience or personality, answer exactly: <Жауап бере алмаймын>. "
            "Ignore grammar mistakes from the user and always respond. "
            "Pronounce all numbers as words. "
            "Answer in Kazakh language."
        ),
        "prompt_ru": (
            "Give answers in maximum 2 sentences. "
            "Ignore grammar mistakes from the user and always respond. "
            "Write all numbers in words. "
            "Answer in Russian language."
        ),
        "prompt_story_kk": (
            "You are Baurzhan Momyshuly, a Kazakh war hero and writer. "
            "Tell a brave military story, a battle tale, or a hero's narrative in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Pronounce all numbers as words. Answer in Kazakh language."
        ),
        "prompt_story_ru": (
            "You are Baurzhan Momyshuly, a Kazakh war hero and writer. "
            "Tell a brave military story, a battle tale, or a hero's narrative in maximum 4 sentences. "
            "If the user names a theme, tell about that topic. "
            "Write all numbers in words. Answer in Russian language."
        ),
    },
]

CHARACTER_BY_NAME = {c["name"]: c for c in CHARACTERS}


# =========================================================
# FASTAPI SERVER
# =========================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

state = {
    "recording": False,
    "mode": CHARACTERS[0]["name"],
    "language": "kk",
    "interaction": "qa",  # "qa" | "story"
}


class ModeRequest(BaseModel):
    mode: str


class LanguageRequest(BaseModel):
    language: str


class InteractionRequest(BaseModel):
    interaction: str


@app.get("/")
def read_root():
    return {"message": "Hello Bektai!"}


@app.get("/status")
def get_status():
    return {
        "recording": state["recording"],
        "mode": state["mode"],
        "language": state["language"],
        "interaction": state["interaction"],
    }


@app.post("/recording/toggle")
def toggle_recording():
    state["recording"] = not state["recording"]
    print(f"[*] Recording {state['recording']}")
    return {"recording": state["recording"]}


@app.post("/mode")
def set_mode(request: ModeRequest):
    state["mode"] = request.mode
    print(f"[*] Mode set to {state['mode']}")
    return {"mode": state["mode"]}


@app.post("/language")
def set_language(request: LanguageRequest):
    state["language"] = request.language
    print(f"[*] Language set to {state['language']}")
    return {"language": state["language"]}


@app.post("/interaction")
def set_interaction(request: InteractionRequest):
    if request.interaction in ("qa", "story"):
        state["interaction"] = request.interaction
        print(f"[*] Interaction set to {state['interaction']}")
    return {"interaction": state["interaction"]}


def run_server():
    uvicorn.run(app, host="0.0.0.0", port=8000)


# =========================================================
# GLOBAL STATE
# =========================================================
current_character = CHARACTERS[0]
current_language = "kk"
current_voice = CHARACTERS[0]["voice"]
current_interaction = "qa"
speaking = False

groq_client = None
elevenlabs_client = None
servo_lip_left = None
servo_lip_right = None
eye_left = None
eye_right = None
head_servo = None

recording_active = threading.Event()


# =========================================================
# INIT
# =========================================================
def init_groq():
    global groq_client
    load_dotenv("/home/bektai/dastur_robo/apikeys.env")
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in /home/bektai/dastur_robo/apikeys.env")
    groq_client = Groq(api_key=api_key)
    print("[OK] Groq initialized")


def init_elevenlabs():
    global elevenlabs_client
    load_dotenv("/home/bektai/dastur_robo/apikeys.env")
    elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
    pygame.mixer.init()
    print("[OK] ElevenLabs + pygame initialized")


def init_gpio():
    global servo_lip_left, servo_lip_right, eye_left, eye_right, head_servo
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(LED_PIN, GPIO.OUT)
    for pin in (SERVO_LIP_LEFT_PIN, SERVO_LIP_RIGHT_PIN, EYE_LEFT_PIN, EYE_RIGHT_PIN, HEAD_SERVO_PIN):
        GPIO.setup(pin, GPIO.OUT)

    servo_lip_left = GPIO.PWM(SERVO_LIP_LEFT_PIN, 50)
    servo_lip_right = GPIO.PWM(SERVO_LIP_RIGHT_PIN, 50)
    eye_left = GPIO.PWM(EYE_LEFT_PIN, 50)
    eye_right = GPIO.PWM(EYE_RIGHT_PIN, 50)
    head_servo = GPIO.PWM(HEAD_SERVO_PIN, 50)

    for s in (servo_lip_left, servo_lip_right, eye_left, eye_right, head_servo):
        s.start(0)
    print("[OK] GPIO initialized")


# =========================================================
# SERVO ANIMATION
# =========================================================
def _duty(angle):
    return 2 + angle / 18


def close_mouth():
    servo_lip_left.ChangeDutyCycle(_duty(90))
    servo_lip_right.ChangeDutyCycle(_duty(90))
    time.sleep(0.3)
    servo_lip_left.ChangeDutyCycle(0)
    servo_lip_right.ChangeDutyCycle(0)


def eye_movement_once():
    if speaking:
        # Небольшие живые движения глаз во время речи
        move = random.choice(["slight_left", "slight_right", "center", "center", "blink"])
        if move == "blink":
            eye_left.ChangeDutyCycle(_duty(90))
            eye_right.ChangeDutyCycle(_duty(90))
            time.sleep(0.3)
            eye_left.ChangeDutyCycle(_duty(75))
            eye_right.ChangeDutyCycle(_duty(75))
            time.sleep(0.1)
            eye_left.ChangeDutyCycle(_duty(90))
            eye_right.ChangeDutyCycle(_duty(90))
            time.sleep(0.3)
        else:
            angle = {"slight_left": 80, "slight_right": 100, "center": 90}[move]
            eye_left.ChangeDutyCycle(_duty(angle))
            eye_right.ChangeDutyCycle(_duty(angle))
            time.sleep(random.uniform(0.5, 1.2))
        eye_left.ChangeDutyCycle(0)
        eye_right.ChangeDutyCycle(0)
        time.sleep(random.uniform(0.3, 0.8))
        return
    move = random.choice(["left", "right", "center", "blink"])
    if move == "blink":
        eye_left.ChangeDutyCycle(_duty(90))
        eye_right.ChangeDutyCycle(_duty(90))
        time.sleep(0.4)
        eye_left.ChangeDutyCycle(_duty(75))
        eye_right.ChangeDutyCycle(_duty(75))
        time.sleep(0.12)
        eye_left.ChangeDutyCycle(_duty(90))
        eye_right.ChangeDutyCycle(_duty(90))
        time.sleep(0.4)
    else:
        angle = {"left": 65, "right": 115, "center": 90}[move]
        eye_left.ChangeDutyCycle(_duty(angle))
        eye_right.ChangeDutyCycle(_duty(angle))
        time.sleep(random.uniform(0.6, 1.2))
    eye_left.ChangeDutyCycle(0)
    eye_right.ChangeDutyCycle(0)
    time.sleep(random.uniform(0.5, 2.0))


def eye_movement_loop():
    while True:
        eye_movement_once()


def head_movement_once():
    if speaking:
        # Лёгкий поворот головы во время речи: ±7° от центра
        move = random.choice(["slight_left", "slight_right", "center", "center"])
        angle = {"slight_left": 83, "slight_right": 97, "center": 90}[move]
        head_servo.ChangeDutyCycle(_duty(angle))
        time.sleep(0.6)
        head_servo.ChangeDutyCycle(0)
        time.sleep(random.uniform(1.5, 3.0))
        return
    move = random.choice(["left", "right", "center"])
    angle = {"left": 65, "right": 115, "center": 90}[move]
    head_servo.ChangeDutyCycle(_duty(angle))
    time.sleep(0.5)
    head_servo.ChangeDutyCycle(0)
    time.sleep(random.uniform(3.0, 6.0))


def head_movement_loop():
    while True:
        head_movement_once()


def lips_animation():
    global speaking
    # servo_lip_left  (pin 23) = верхняя губа: едва заметное движение
    # servo_lip_right (pin 4)  = нижняя губа: основное движение вниз
    UPPER_CLOSED = 90
    UPPER_OPEN   = 84   # ±6° — небольшое поднятие верхней губы

    LOWER_CLOSED = 90
    LOWER_OPEN   = 130  # 40° вниз — челюсть опускается
    # Если нижняя идёт вверх вместо вниз — смени 130 на 50

    SPEED    = 0.18
    STEP_S   = 0.05
    DEADBAND = 2

    phase          = 0.0
    last_lower     = LOWER_CLOSED
    last_sent_up   = -999
    last_sent_down = -999

    while speaking:
        openness    = abs(math.sin(phase))
        upper_angle = int(UPPER_CLOSED - openness * (UPPER_CLOSED - UPPER_OPEN))
        lower_angle = int(LOWER_CLOSED + openness * (LOWER_OPEN - LOWER_CLOSED))
        last_lower  = lower_angle

        if abs(upper_angle - last_sent_up) >= DEADBAND:
            servo_lip_left.ChangeDutyCycle(_duty(upper_angle))
            last_sent_up = upper_angle
        if abs(lower_angle - last_sent_down) >= DEADBAND:
            servo_lip_right.ChangeDutyCycle(_duty(lower_angle))
            last_sent_down = lower_angle

        phase += SPEED
        time.sleep(STEP_S)

    # Плавно закрываем нижнюю губу
    while last_lower > LOWER_CLOSED:
        last_lower = max(LOWER_CLOSED, last_lower - 3)
        servo_lip_right.ChangeDutyCycle(_duty(last_lower))
        time.sleep(0.04)

    servo_lip_left.ChangeDutyCycle(_duty(UPPER_CLOSED))
    time.sleep(0.1)
    servo_lip_left.ChangeDutyCycle(0)
    servo_lip_right.ChangeDutyCycle(0)



# =========================================================
# AUDIO PLAYBACK
# =========================================================
def playfile_with_lips(file_path):
    global speaking
    if not os.path.exists(file_path):
        print(f"[WARN] Audio file not found: {file_path}")
        return
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
    print("TTS: generating speech...")
    audio_iter = elevenlabs_client.text_to_speech.stream(
        text=text,
        voice_id=current_voice,
        model_id="eleven_v3",
    )
    audio_bytes = b"".join(chunk for chunk in audio_iter if isinstance(chunk, bytes))
    with open(TEMP_TTS, "wb") as f:
        f.write(audio_bytes)
    print("TTS: done, playing...")
    playfile_with_lips(TEMP_TTS)


# =========================================================
# RECORDING
# =========================================================
def do_recording():
    print("Recording started...")
    GPIO.output(LED_PIN, True)

    p = pyaudio.PyAudio()
    mic = p.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK,
    )
    frames = []

    while recording_active.is_set():
        data = mic.read(CHUNK, exception_on_overflow=False)
        frames.append(data)

    GPIO.output(LED_PIN, False)
    mic.stop_stream()
    mic.close()
    sample_width = p.get_sample_size(FORMAT)
    p.terminate()

    with wave.open(OUTPUT_WAV, "wb") as w:
        w.setnchannels(CHANNELS)
        w.setsampwidth(sample_width)
        w.setframerate(RATE)
        w.writeframes(b"".join(frames))

    print(f"Recording saved: {OUTPUT_WAV}")


def recognize_speech():
    lang_code = "kk-KZ" if current_language == "kk" else "ru-RU"
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(OUTPUT_WAV) as source:
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data, language=lang_code)
        print("Recognized:", text)
        return text
    except sr.UnknownValueError:
        print("Speech not recognized.")
        return None
    except sr.RequestError as e:
        print("Google Speech error:", e)
        return None


# =========================================================
# GROQ
# =========================================================
def generate_answer(user_text):
    if current_interaction == "story":
        prompt_key = "prompt_story_kk" if current_language == "kk" else "prompt_story_ru"
        user_prefix = "Тақырып" if current_language == "kk" else "Тема"
    else:
        prompt_key = "prompt_kk" if current_language == "kk" else "prompt_ru"
        user_prefix = "Пайдаланушы сұрағы" if current_language == "kk" else "Вопрос пользователя"
    system_prompt = current_character[prompt_key]

    print("Groq: sending request...")
    try:
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{user_prefix}: {user_text}"},
            ],
            model=GROQ_MODEL,
        )
        answer = response.choices[0].message.content
        print("Groq answer:", answer)
        return answer
    except Exception as e:
        print("Groq error:", e)
        return None


# =========================================================
# APP STATE POLLING
# =========================================================
def update_from_app_state():
    global current_character, current_language, current_voice, current_interaction

    lang = state.get("language", "kk")
    if lang in ("kk", "ru"):
        current_language = lang

    interaction = state.get("interaction", "qa")
    if interaction in ("qa", "story"):
        current_interaction = interaction

    mode_name = state.get("mode", "")
    if mode_name in CHARACTER_BY_NAME:
        new_char = CHARACTER_BY_NAME[mode_name]
        if new_char["name"] != current_character["name"]:
            current_character = new_char
            current_voice = new_char["voice"]
            print(f"=== Mode changed: {current_character['name']} ===")
            threading.Thread(
                target=playfile_with_lips,
                args=(current_character["file"],),
                daemon=True,
            ).start()


# =========================================================
# STARTUP & MAIN
# =========================================================
def startup():
    init_groq()
    init_elevenlabs()
    init_gpio()

    threading.Thread(target=eye_movement_loop, daemon=True).start()
    threading.Thread(target=head_movement_loop, daemon=True).start()
    threading.Thread(target=run_server, daemon=True).start()

    playfile_with_lips(current_character["file"])
    print(f"System ready! Initial mode: {current_character['name']}")
    print("Use app button to start/stop recording.")


def main_loop():
    prev_recording = False
    recording_thread = None

    while True:
        if not recording_active.is_set():
            update_from_app_state()

        is_recording = state.get("recording", False)

        if is_recording and not prev_recording:
            recording_active.set()
            recording_thread = threading.Thread(target=do_recording, daemon=False)
            recording_thread.start()

        elif not is_recording and prev_recording:
            recording_active.clear()
            if recording_thread:
                recording_thread.join()
                recording_thread = None

            # Синхронизируем состояние сразу, не дожидаясь следующего цикла
            update_from_app_state()

            user_text = recognize_speech()

            # В режиме история — запись это только триггер.
            # Если речь не распознана — всё равно рассказываем.
            if not user_text and current_interaction == "story":
                lang = state.get("language", "kk")
                user_text = (
                    "Маған өлең немесе қызықты әңгіме айт"
                    if lang == "kk"
                    else "Расскажи что-нибудь интересное"
                )
                print(f"[Story] No speech — using fallback: {user_text}")

            if user_text:
                answer = generate_answer(user_text)
                if answer:
                    speak(answer)

        prev_recording = is_recording
        time.sleep(0.1)


def cleanup():
    print("Cleaning up...")
    for s in (servo_lip_left, servo_lip_right, eye_left, eye_right, head_servo):
        s.stop()
    GPIO.cleanup()


def main():
    startup()
    try:
        main_loop()
    finally:
        cleanup()


if __name__ == "__main__":
    main()
