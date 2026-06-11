import serial
import serial.tools.list_ports
import time
import threading

def find_esp_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "CH340" in port.description or "CP210" in port.description or "UART" in port.description:
            return port.device
    if ports: return ports[0].device
    return None

# Функция для постоянного чтения ответов от платы
def listen_to_esp(esp_serial):
    while True:
        try:
            if esp_serial.in_waiting > 0:
                data = esp_serial.readline().decode('utf-8', errors='ignore').strip()
                if data:
                    print(f"\n[ESP32]: {data}")
                    print("Введи команду > ", end="", flush=True)
        except Exception as e:
            print(f"Ошибка чтения: {e}")
            break
port_name = find_esp_port()
if port_name:
    try:
        esp_serial = serial.Serial(port_name, 115200, timeout=1)
        time.sleep(2)
        print(f"Подключено к {port_name}!")
        listener = threading.Thread(target=listen_to_esp, args=(esp_serial,), daemon=True)
        listener.start()
        while True:
            cmd = input("Введи команду > ")
            if cmd.lower() == 'exit':
                break
            full_command = f"{cmd}\n"
            esp_serial.write(full_command.encode('utf-8'))
            
    except serial.SerialException:
        print(f"❌ Ошибка доступа к порту {port_name}.")
else:
    print("❌ ESP32 не найдена!")