import time
from groq import Groq

class TextGenerator:
    def __init__(self, api_key):
        """Инициализация клиента Groq с переданным ключом."""
        self.client = Groq(api_key=api_key)

    def generate(self, user_text, system_prompt, language="kk", history=None):
        """
        Универсальный генератор текста.
        - language="kk": использует тяжелую Llama 70B для казахского.
        - language="ru" (или любой другой): использует сверхбыструю Llama 8B.
        - history: список предыдущих сообщений [{"role": "user", "content": "..."}, ...]
        """
        if not user_text or not system_prompt:
            return None
            
        print(f"Обработка запроса... (Язык: {language})")
        start_time = time.time()

        # Роутинг моделей в зависимости от языка
        model_choice = "llama-3.3-70b-versatile" if language == "kk" else "llama-3.1-8b-instant"

        try:
            messages = [{"role": "system", "content": system_prompt}]
            if history:
                messages.extend(history)
            messages.append({"role": "user", "content": user_text})

            response = self.client.chat.completions.create(
                messages=messages,
                model=model_choice,
            )
            answer = response.choices[0].message.content
            
            print(f"LLM справилась за: {time.time() - start_time:.2f} сек.")
            return answer
            
        except Exception as e:
            print(f"Ошибка генерации текста: {e}")
            return None