"""
OquBot Block Programming IDE v2 — Desktop Launcher
====================================================
Launches the visual block programming IDE as a desktop app via pywebview.
Connects to ESP32/Arduino via USB Serial.

Usage:
    python app.py
"""

import os
import sys
import json
import threading
import time

# Add parent dir to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)


def resource_path(relative_path):
    """Returns absolute path, works in dev and in .exe (PyInstaller)"""
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, relative_path)


# ──────────────────────────────────────────────────────────────
# API bridge for JS frontend (pywebview.api.*)
# ──────────────────────────────────────────────────────────────
class OquBotBlockAPI:
    def __init__(self):
        self._running = False
        self._connected = False
        self._serial = None
        self._serial_port = None
        self._groq_key = None
        self._elevenlabs_key = None
        
        # Voice modules
        self.stt = None
        self.llm = None
        self.tts = None
        
        print("[OquBot IDE] API initialized")

    # ── API Keys ──
    def set_api_keys(self, groq_key, elevenlabs_key):
        """Store API keys from the settings UI"""
        self._groq_key = groq_key if groq_key else None
        self._elevenlabs_key = elevenlabs_key if elevenlabs_key else None
        print("[OquBot IDE] API keys updated")
        return True

    def test_api_keys(self, groq_key, elevenlabs_key):
        """Test if API keys are valid"""
        results = {"success": True, "error": ""}
        errors = []

        if groq_key:
            try:
                from groq import Groq
                client = Groq(api_key=groq_key)
                client.chat.completions.create(
                    messages=[{"role": "user", "content": "test"}],
                    model="llama-3.3-70b-versatile",
                    max_tokens=5
                )
                print("[OquBot IDE] Groq key: OK")
            except Exception as e:
                errors.append("Groq: " + str(e)[:80])
                print("[OquBot IDE] Groq key: FAIL - " + str(e)[:80])

        if elevenlabs_key:
            try:
                from elevenlabs.client import ElevenLabs
                client = ElevenLabs(api_key=elevenlabs_key)
                client.voices.get_all()
                print("[OquBot IDE] ElevenLabs key: OK")
            except Exception as e:
                errors.append("ElevenLabs: " + str(e)[:80])
                print("[OquBot IDE] ElevenLabs key: FAIL - " + str(e)[:80])

        if errors:
            results["success"] = False
            results["error"] = "; ".join(errors)

        return results

    # ── Voice Chat ──
    def start_voice_recording(self):
        if not self._groq_key:
            print("[OquBot IDE] Groq Key missing")
            return {"error": "Groq API Key missing"}
        try:
            from stt import SpeechRecognizer
            if not self.stt:
                self.stt = SpeechRecognizer(api_key=self._groq_key)
            self.stt.start()
            print("[OquBot IDE] Voice recording started...")
            return {"success": True}
        except Exception as e:
            print(f"[OquBot IDE] Error starting STT: {e}")
            return {"error": str(e)}

    def stop_voice_recording(self, persona, mode):
        if not self.stt:
            return {"error": "Not recording"}
        try:
            print("[OquBot IDE] Voice recording stopped. Processing STT...")
            text = self.stt.stop()
            if not text:
                return {"error": "No voice detected"}
            
            print(f"[OquBot IDE] User said: {text}")
            
            # Form prompt
            prompt = f"Ты дружелюбный робот-аниматроник OquBot. Отвечай кратко, 1-2 предложения. Личность: {persona}, Режим: {mode}."
            
            from generate import TextGenerator
            if not self.llm:
                self.llm = TextGenerator(api_key=self._groq_key)
            
            print("[OquBot IDE] Generating answer...")
            answer = self.llm.generate(text, prompt)
            print(f"[OquBot IDE] Robot answer: {answer}")
            
            if self._elevenlabs_key and answer:
                try:
                    from tts import VoiceGenerator
                    if not self.tts:
                        self.tts = VoiceGenerator(api_key=self._elevenlabs_key)
                    
                    def play_audio():
                        self.tts.speak(answer)
                    threading.Thread(target=play_audio).start()
                except Exception as tts_e:
                    print(f"[OquBot IDE] TTS Error: {tts_e}")

            return {"text": answer or "Ошибка генерации"}
        except Exception as e:
            print(f"[OquBot IDE] Voice error: {e}")
            return {"error": str(e)}

    # ── Project Save/Open ──
    def save_project(self, json_data):
        """Save project JSON to file via dialog"""
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
        """Open project JSON from file via dialog"""
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
        """
        Execute generated Python code by sending Serial commands to ESP32.
        Currently a stub — will be implemented when ESP32 firmware is ready.

        Future flow:
        1. Parse code lines into commands
        2. For each command, send Serial text: "MOUTH:45\\n", "HEAD:90\\n", etc.
        3. Wait for "OK\\n" response from ESP32
        4. Handle timing (wait blocks) locally
        """
        if self._running:
            return "Already running"

        self._running = True
        print("\n" + "=" * 50)
        print("[OquBot IDE] Running program:")
        print("-" * 50)
        print(code)
        print("=" * 50)

        # TODO: Parse and send serial commands
        # Example future implementation:
        # for line in code.split('\n'):
        #     cmd = self._parse_to_serial(line)
        #     if cmd and self._serial:
        #         self._serial.write((cmd + '\n').encode('utf-8'))
        #         response = self._serial.readline().decode('utf-8').strip()
        #         if response.startswith('ERR'):
        #             return "Error: " + response

        self._running = False
        return "Program done (demo)"
    def stop_code(self):
        """Stop current program execution"""
        self._running = False
        print("[OquBot IDE] [STOP] Program stopped")
        return True

    # ── Robot Connection (USB Serial only) ──
    def connect_robot(self):
        """
        Find and connect to ESP32/Arduino via USB Serial.
        Uses the same detection logic as serial_esp.py:
        looks for CH340, CP210x, or UART in port description.
        """
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

            # Fallback: use first available port
            if not target_port and ports:
                target_port = ports[0].device

            if target_port:
                self._serial = serial.Serial(target_port, 115200, timeout=1)
                time.sleep(2)  # Wait for ESP32 reset
                self._connected = True
                self._serial_port = target_port
                print("[OquBot IDE] [OK] Connected to " + target_port)
                return {"success": True, "port": target_port}
            else:
                print("[OquBot IDE] [--] No serial ports found")
                return {"success": False, "port": None}

        except ImportError:
            print("[OquBot IDE] [--] pyserial not installed. Run: pip install pyserial")
            return {"success": False, "port": None, "error": "pyserial not installed"}
        except Exception as e:
            print("[OquBot IDE] [--] Serial error: " + str(e))
            return {"success": False, "port": None, "error": str(e)}

    def disconnect_robot(self):
        """Disconnect from robot"""
        if self._serial:
            self._serial.close()
            self._serial = None
        self._connected = False
        self._serial_port = None
        print("[OquBot IDE] [--] Disconnected")
        return True

    def get_status(self):
        """Return current connection status"""
        return {
            "connected": self._connected,
            "running": self._running,
            "port": self._serial_port,
        }


# ──────────────────────────────────────────────────────────────
# LAUNCH
# ──────────────────────────────────────────────────────────────
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
