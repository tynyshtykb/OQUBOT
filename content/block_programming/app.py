import os
import sys
import threading
import json
import time
from dotenv import load_dotenv, set_key

def resource_path(relative_path):
    """Returns absolute path, works in dev and in .exe (PyInstaller)"""
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, relative_path)

# Ensure content dir is in path
content_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if content_dir not in sys.path:
    sys.path.append(content_dir)

ENV_PATH = os.path.join(content_dir, '.env')
load_dotenv(dotenv_path=ENV_PATH)

from personalities import PERSONALITIES

class StopExecution(Exception):
    pass

# ──────────────────────────────────────────────────────────────
# Virtual Robot Class for Hardware Simulation and Execution
# ──────────────────────────────────────────────────────────────
class VirtualRobot:
    def __init__(self, api_ref):
        self.api = api_ref
        self.history = []
        self.personality_key = "default"
        self.mode = "Диалог"
        
    def _check_stop(self):
        if getattr(self.api, '_stop_requested', False):
            raise StopExecution()
        
    def _send(self, cmd):
        print(f"\033[96m[OquBot Serial]\033[0m -> SEND: {cmd}")
        if self.api._serial:
            try:
                self.api._serial.write((cmd + '\n').encode('utf-8'))
            except Exception as e:
                print(f"[OquBot Serial Error]: {e}")

    # ── Motors & IO ──
    def open_mouth(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Открываю рот на {angle} градусов")
        self._send(f"MOUTH_ANGLE:{angle}")

    def close_mouth(self):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Закрываю рот")
        self._send("MOUTH_ANGLE:0")

    def move_head(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Поворачиваю голову на {angle} градусов")
        self._send(f"HEAD_ANGLE:{angle}")

    # ── Eye system (6 servos, PCA9685 channels 0-5) ──
    def eye_vertical(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Глаза вверх/вниз: {angle}°")
        self._send(f"EYE_UD:{angle}")

    def eye_horizontal(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Глаза влево/вправо: {angle}°")
        self._send(f"EYE_LR:{angle}")

    def eyelid_top_left(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Верхнее веко (левое): {angle}°")
        self._send(f"EYELID_UL:{angle}")

    def eyelid_top_right(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Верхнее веко (правое): {angle}°")
        self._send(f"EYELID_UR:{angle}")

    def eyelid_bottom_left(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Нижнее веко (левое): {angle}°")
        self._send(f"EYELID_LL:{angle}")

    def eyelid_bottom_right(self, angle):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Нижнее веко (правое): {angle}°")
        self._send(f"EYELID_LR:{angle}")

    def led(self, state):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m LED {'ВКЛ' if state else 'ВЫКЛ'}")
        self._send(f"LED:{1 if state else 0}")

    def play_sound(self, sound_name):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Проигрываю звук: {sound_name}")
        self._send(f"PLAY_SOUND:{sound_name}")

    def set_volume(self, vol):
        self._check_stop()
        print(f"\033[93m[OquBot Simulation]\033[0m Громкость: {vol}")
        self._send(f"VOLUME:{vol}")

    # ── Voice & LLM ──
    def set_personality(self, key):
        self.personality_key = key
        print(f"\033[94m[OquBot Memory]\033[0m Личность установлена: {key}")

    def set_mode(self, mode):
        self.mode = mode
        print(f"\033[94m[OquBot Memory]\033[0m Режим установлен: {mode}")

    def clear_memory(self):
        self.history = []
        print(f"\033[94m[OquBot Memory]\033[0m Память диалога очищена")

    def listen(self):
        if not hasattr(self.api, "voice_turn_completed"):
            self.api.voice_turn_completed = threading.Event()
            self.api.voice_turn_result = ""

        self.api.evaluate_js("document.getElementById('voice-status-text').textContent = 'Готов (Жду кнопку)';")
        print(f"\033[95m[OquBot STT]\033[0m Блок ожидает нажатия кнопки в интерфейсе...")
        
        self.api.voice_turn_completed.clear()
        
        while not self.api.voice_turn_completed.is_set():
            if getattr(self.api, '_stop_requested', False) or not getattr(self.api, '_running', True):
                return ""
            time.sleep(0.1)

        return self.api.voice_turn_result

    def ask(self, text):
        self.say(text)
        return self.listen()

    def generate_response(self, text):
        if not text:
            return ""
        
        # Override with live settings from API if they exist!
        if getattr(self.api, 'live_persona', None):
            self.personality_key = self.api.live_persona
        if getattr(self.api, 'live_mode', None):
            self.mode = self.api.live_mode
        
        persona = PERSONALITIES.get(self.personality_key, PERSONALITIES["default"])
        prompt = persona["prompts"].get("ru", "Ты робот OquBot.") + f" Режим общения: {self.mode}."
        
        print(f"\033[94m[OquBot LLM]\033[0m Генерирую ответ на: '{text}' (Личность: {persona['name']}, Режим: {self.mode})")
        answer = ""
        if self.api._groq_key:
            try:
                from generate import TextGenerator
                if not getattr(self.api, 'llm', None):
                    self.api.llm = TextGenerator(api_key=self.api._groq_key)
                
                answer = self.api.llm.generate(text, prompt, history=self.history)
                if answer:
                    self.history.append({"role": "user", "content": text})
                    self.history.append({"role": "assistant", "content": answer})
                    if len(self.history) > 10:
                        self.history = self.history[-10:]
            except Exception as e:
                print(f"[OquBot LLM Error]: {e}")
                answer = "Извините, произошла ошибка."
        else:
            answer = f"Это тестовый ответ от {persona['name']}."

        print(f"\033[94m[OquBot LLM]\033[0m Ответ: {answer}")
        safe_ans = answer.replace('"', '\\"').replace('\n', '<br>')
        self.api.evaluate_js(f"OquIDE.addVoiceMessage('Робот', '{safe_ans}', 'bot');")
        self.api.evaluate_js("document.getElementById('voice-status-text').textContent = 'Готов';")
        return answer

    def say(self, text):
        self._check_stop()
        if not text:
            return
            
        # Override with live settings from API if they exist!
        if getattr(self.api, 'live_persona', None):
            self.personality_key = self.api.live_persona
            
        persona = PERSONALITIES.get(self.personality_key, PERSONALITIES["default"])
        voice_id = persona.get("voice_id", "JBFqnCBsd6RMkjVDRZzb")
        
        print(f"\033[92m[OquBot TTS]\033[0m Говорю (голос {voice_id}): {text}")
        if self.api._elevenlabs_key:
            try:
                from tts import VoiceGenerator
                if not self.api.tts:
                    self.api.tts = VoiceGenerator(api_key=self.api._elevenlabs_key)
                self.api.tts.speak(text, voice_id=voice_id)
            except Exception as e:
                print(f"[OquBot TTS Error]: {e}")
        else:
            print("[OquBot Simulation] (No ElevenLabs Key to speak aloud)")

    def listen_and_reply(self):
        user_text = self.listen()
        if user_text:
            answer = self.generate_response(user_text)
            self.say(answer)

    def wait(self, seconds):
        print(f"\033[93m[OquBot Simulation]\033[0m Жду {seconds} секунд...")
        end_time = time.time() + float(seconds)
        while time.time() < end_time:
            self._check_stop()
            time.sleep(0.1)


# ──────────────────────────────────────────────────────────────
# API bridge for JS frontend (pywebview.api.*)
# ──────────────────────────────────────────────────────────────
class OquBotBlockAPI:
    def __init__(self):
        self._running = False
        self._stop_requested = False
        self._connected = False
        self._serial = None
        self._serial_port = None
        self.voice_turn_completed = threading.Event()
        self.voice_turn_result = ""
        
        self.live_persona = None
        self.live_mode = None
        
        # Загружаем ключи из .env
        self._groq_key = os.getenv("GROQ_API_KEY")
        self._elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
        
        # Voice modules
        self.stt = None
        self.llm = None
        self.tts = None
        
        print("[OquBot IDE] API initialized")

    # ── API Keys ──
    def get_api_keys(self):
        """Return keys to frontend to populate settings"""
        return {
            "groq": self._groq_key or "",
            "elevenlabs": self._elevenlabs_key or ""
        }

    def set_api_keys(self, groq_key, elevenlabs_key):
        """Store API keys into .env file"""
        self._groq_key = groq_key if groq_key else None
        self._elevenlabs_key = elevenlabs_key if elevenlabs_key else None
        
        if groq_key:
            set_key(ENV_PATH, "GROQ_API_KEY", groq_key)
        if elevenlabs_key:
            set_key(ENV_PATH, "ELEVENLABS_API_KEY", elevenlabs_key)
            
        print("[OquBot IDE] API keys saved to .env")
        return True

    def test_api_keys(self, groq_key, elevenlabs_key):
        """Test if API keys are valid"""
        results = {"success": True, "error": ""}
        errors = []

        if groq_key:
            try:
                from stt import SpeechRecognizer
                SpeechRecognizer(api_key=groq_key)
            except Exception as e:
                errors.append(f"Groq error: {e}")
                
        if elevenlabs_key:
            try:
                from tts import VoiceGenerator
                VoiceGenerator(api_key=elevenlabs_key)
            except Exception as e:
                errors.append(f"ElevenLabs error: {e}")

        if errors:
            results["success"] = False
            results["error"] = " | ".join(errors)
            
        return results

    def get_personalities(self):
        """Return dict of available personalities"""
        return {k: v["name"] for k, v in PERSONALITIES.items()}

    def live_update_voice_settings(self, persona, mode):
        self.live_persona = persona
        self.live_mode = mode
        print(f"[OquBot IDE] Live settings updated: Persona={persona}, Mode={mode}")

    # ── Voice UI Push To Talk ──
    def start_voice_recording(self):
        print(f"\033[95m[OquBot STT]\033[0m Микрофон включен. Идет запись...")
        if self._groq_key:
            try:
                from stt import SpeechRecognizer
                if not self.stt:
                    self.stt = SpeechRecognizer(api_key=self._groq_key)
                self.stt.start()
            except Exception as e:
                print(f"Ошибка старта STT: {e}")
        return True

    def stop_voice_recording(self):
        print(f"\033[95m[OquBot STT]\033[0m Запись остановлена. Обработка...")
        res_text = ""
        if self._groq_key and self.stt:
            try:
                res_text = self.stt.stop() or ""
            except Exception as e:
                print(f"Ошибка стопа STT: {e}")
                res_text = ""
        else:
            res_text = "Тестовый текст (нет API ключа)"
            
        print(f"\033[95m[OquBot STT]\033[0m Распознано: {res_text}")
        
        # Send text back to UI log
        safe_text = res_text.replace('"', '\\"').replace('\n', ' ')
        self.evaluate_js(f"OquIDE.addVoiceMessage('Вы', '{safe_text}', 'user');")
        self.evaluate_js("document.getElementById('voice-status-text').textContent = 'Обработка...';")

        # Unlock the VirtualRobot block
        self.voice_turn_result = res_text
        self.voice_turn_completed.set()
        
        return res_text

    def evaluate_js(self, js_code):
        import webview
        try:
            if len(webview.windows) > 0:
                webview.windows[0].evaluate_js(js_code)
        except Exception as e:
            pass

    # ── Project Save/Open ──
    def save_project(self, json_data):
        import webview
        try:
            result = webview.windows[0].create_file_dialog(
                webview.SAVE_DIALOG,
                directory=os.path.expanduser('~'),
                save_filename='oqubot_project.json',
                file_types=('JSON files (*.json)',)
            )
            if result:
                filepath = result if isinstance(result, str) else result[0]
                if not filepath.endswith('.json'):
                    filepath += '.json'
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(json_data)
                print("[OquBot IDE] Saved: " + filepath)
                return filepath
        except Exception as e:
            print("[OquBot IDE] Save error: " + str(e))
        return None

    def open_project(self):
        import webview
        try:
            result = webview.windows[0].create_file_dialog(
                webview.OPEN_DIALOG,
                directory=os.path.expanduser('~'),
                file_types=('JSON files (*.json)',)
            )
            if result:
                filepath = result[0] if isinstance(result, tuple) else result
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = f.read()
                print("[OquBot IDE] Loaded: " + filepath)
                return data
        except Exception as e:
            print("[OquBot IDE] Open error: " + str(e))
        return None

    # ── Run Code (Serial to ESP32) ──
    def run_code(self, code):
        """Execute generated Python code in a safe thread, simulating hardware."""
        if self._running:
            return "Already running"

        self._stop_requested = False
        self._running = True
        print("\n" + "=" * 50)
        print("[OquBot IDE] Запуск программы из блоков...")
        print("-" * 50)
        print(code)
        print("=" * 50)

        def daemon_thread():
            import random
            ns = {'robot': VirtualRobot(self), 'time': time, 'random': random, '__name__': '__oqubot__'}
            try:
                exec(code, ns)
            except StopExecution:
                pass
            except Exception as e:
                print(f"[OquBot IDE] Ошибка выполнения: {e}")
                safe_err = str(e).replace("'", "\\'").replace('"', '\\"').replace("\n", " ")
                self.evaluate_js(f"if (typeof M !== 'undefined') {{ M.toast({{html: 'Ошибка выполнения кода: {safe_err}', classes: 'red'}}); }}")
            finally:
                self._running = False
                self.evaluate_js("OquIDE.stopProgram()")

        t = threading.Thread(target=daemon_thread, daemon=True)
        t.start()

        return "Programm started"

    def stop_code(self):
        """Stop current program execution"""
        self._stop_requested = True
        self._running = False
        print("[OquBot IDE] [STOP] Program stopped")
        return True
    # ── Robot Connection (USB Serial only) ──
    def connect_robot(self):
        print("[OquBot IDE] [SERIAL] Searching for robot...")
        try:
            import serial
            import serial.tools.list_ports

            ports = serial.tools.list_ports.comports()
            target_port = None
            for port in ports:
                desc = port.description.upper()
                if "CH340" in desc or "CP210" in desc or "UART" in desc:
                    target_port = port.device
                    break
            if not target_port and ports:
                target_port = ports[0].device

            if target_port:
                self._serial = serial.Serial(target_port, 115200, timeout=1)
                time.sleep(2)
                self._connected = True
                self._serial_port = target_port
                print("[OquBot IDE] [OK] Connected to " + target_port)
                return {"success": True, "port": target_port}
            else:
                print("[OquBot IDE] [--] No serial ports found")
                return {"success": False, "port": None}
        except Exception as e:
            print("[OquBot IDE] [--] Serial error: " + str(e))
            return {"success": False, "port": None, "error": str(e)}

    def disconnect_robot(self):
        if self._serial:
            self._serial.close()
            self._serial = None
        self._connected = False
        self._serial_port = None
        print("[OquBot IDE] [--] Disconnected")
        return True

    def get_status(self):
        return {
            "connected": self._connected,
            "running": self._running,
            "port": self._serial_port,
        }
if __name__ == '__main__':
    import webview

    api = OquBotBlockAPI()
    html_path = resource_path('index.html')
    print("[OquBot IDE] Loading: " + html_path)

    window = webview.create_window(
        title='OquBot IDE',
        url=html_path,
        js_api=api,
        width=1280,
        height=800,
        min_size=(900, 600),
        background_color='#F0F0F0',
        text_select=False,
    )

    print("[OquBot IDE] Starting...")
    webview.start(debug=False)

    print("[OquBot IDE] Starting application...")
    print("[OquBot IDE] Press Ctrl+C to exit")
    webview.start(debug=False)

