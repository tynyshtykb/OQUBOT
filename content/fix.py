import re
with open('personalities.py', 'r', encoding='utf-8') as f:
    text = f.read()
text = re.sub(r'"voice_id":\s*"[^"]+"', '"voice_id": "JBFqnCBsd6RMkjVDRZzb"', text)
with open('personalities.py', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed personalities.py')
