"""
OquBot Block Programming IDE — Desktop Launcher
=================================================
Запускает визуальную среду блочного программирования
как десктопное приложение через pywebview.

Использование:
    python app.py
"""

import os
import sys
import json
import threading

# Поддержка PyInstaller: получаем корректный путь к ресурсам
def resource_path(relative_path):
    """Возвращает абсолютный путь к ресурсу, работает и в dev, и в .exe"""
    try:
        base_path = sys._MEIPASS  # PyInstaller temp dir
    except AttributeError:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, relative_path)


# ──────────────────────────────────────────────────────────────
# API для взаимодействия с фронтендом (js_api для pywebview)
# ──────────────────────────────────────────────────────────────
class OquBotBlockAPI:
    """
    Мост между HTML/JS интерфейсом и Python бэкендом.
    Методы этого класса вызываются из JavaScript через pywebview.api.*
    """

    def __init__(self):
        self._running = False
        self._connected = False
        self._serial = None
        self._current_file = None
        print("[OquBot IDE] API initialized")

    # ── Сохранение проекта ──
    def save_project(self, json_data):
        """Сохраняет JSON проекта в файл через диалог"""
        import webview
        try:
            # Показываем диалог сохранения
            result = webview.windows[0].create_file_dialog(
                webview.SAVE_DIALOG,
                directory=os.path.expanduser('~'),
                save_filename='oqubot_project.json',
                file_types=('JSON файлы (*.json)',)
            )
            if result:
                filepath = result if isinstance(result, str) else result[0]
                if not filepath.endswith('.json'):
                    filepath += '.json'
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(json_data)
                self._current_file = filepath
                print(f"[OquBot IDE] Project saved: {filepath}")
                return filepath
        except Exception as e:
            print(f"[OquBot IDE] Save error: {e}")
        return None

    # ── Открытие проекта ──
    def open_project(self):
        """Открывает JSON проект из файла через диалог"""
        import webview
        try:
            result = webview.windows[0].create_file_dialog(
                webview.OPEN_DIALOG,
                directory=os.path.expanduser('~'),
                file_types=('JSON файлы (*.json)',)
            )
            if result:
                filepath = result[0] if isinstance(result, tuple) else result
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = f.read()
                self._current_file = filepath
                print(f"[OquBot IDE] Project loaded: {filepath}")
                return data
        except Exception as e:
            print(f"[OquBot IDE] Open error: {e}")
        return None

    # ── Запуск кода ──
    def run_code(self, code):
        """
        Выполняет сгенерированный из блоков Python-код.
        TODO: В будущем — отправка команд на ESP32 через serial.
        Сейчас — заглушка с логированием.
        """
        if self._running:
            return "Программа уже выполняется"

        self._running = True
        print("\n" + "=" * 50)
        print("[OquBot IDE] >> Zapusk programmy:")
        print("-" * 50)
        print(code)
        print("=" * 50)

        # TODO: Здесь будет реальное выполнение:
        # 1. Парсинг команд из кода
        # 2. Отправка команд на ESP32/Arduino через serial
        # 3. Обратная связь от робота

        self._running = False
        return "Program done (demo)"

    # ── Остановка кода ──
    def stop_code(self):
        """Останавливает выполнение текущей программы"""
        self._running = False
        print("[OquBot IDE] [STOP] Program stopped")
        return True

    # ── Подключение к роботу ──
    def connect_robot(self):
        """
        Ищет и подключается к ESP32/Arduino через serial.
        TODO: Реализовать реальное подключение через pyserial.
        """
        print("[OquBot IDE] [SERIAL] Searching for robot...")

        # TODO: Реальное подключение:
        # try:
        #     import serial
        #     import serial.tools.list_ports
        #     ports = serial.tools.list_ports.comports()
        #     for port in ports:
        #         if "CH340" in port.description or "CP210" in port.description:
        #             self._serial = serial.Serial(port.device, 115200, timeout=1)
        #             self._connected = True
        #             return {"success": True, "port": port.device}
        # except Exception as e:
        #     print(f"Connection error: {e}")

        # Заглушка
        self._connected = not self._connected
        if self._connected:
            print("[OquBot IDE] [OK] Robot connected (demo)")
            return {"success": True, "port": "COM3 (demo)"}
        else:
            print("[OquBot IDE] [--] Robot disconnected")
            return {"success": False, "port": None}

    # ── Статус подключения ──
    def get_status(self):
        """Возвращает текущий статус подключения"""
        return {
            "connected": self._connected,
            "running": self._running,
            "port": "COM3 (демо)" if self._connected else None,
        }


# ──────────────────────────────────────────────────────────────
# ЗАПУСК ПРИЛОЖЕНИЯ
# ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    import webview

    # Создаём API-мост
    api = OquBotBlockAPI()

    # Путь к index.html
    html_path = resource_path('index.html')
    print(f"[OquBot IDE] Loading UI from: {html_path}")

    # Создаём окно приложения
    window = webview.create_window(
        title='OquBot IDE — Среда блочного программирования',
        url=html_path,
        js_api=api,
        width=1280,
        height=800,
        min_size=(900, 600),
        background_color='#07080f',
        text_select=False,
    )

    print("[OquBot IDE] Starting application...")
    print("[OquBot IDE] Press Ctrl+C to exit")

    # Запуск (debug=True для DevTools во время разработки)
    webview.start(debug=True)
