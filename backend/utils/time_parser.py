import re
from constants.number_map import number_map

def extract_hour(text: str) -> str:
    # Normaliza números escritos
    for palabra, numero in number_map.items():
        text = re.sub(rf"\b{palabra}\b", str(numero), text, flags=re.IGNORECASE)

    # Patrón flexible para detectar hora incluso si está mal escrita
    match = re.search(r"a\s+la(?:s)?\s*(\d{1,2})?\s*(?:y\s*(\d{1,2}|cuarto|media)?)?", text, re.IGNORECASE)
    if match:
        h_raw = match.group(1)
        m_raw = match.group(2)

        h = int(h_raw) if h_raw and h_raw.isdigit() else 0
        if m_raw:
            m_raw = m_raw.lower()
            if m_raw == "cuarto":
                m = 15
            elif m_raw == "media":
                m = 30
            elif m_raw.isdigit():
                m = int(m_raw)
            else:
                m = 0
        else:
            m = 0

        if h == 0 and m == 0:
            return "0:00"
        return f"{h:02d}:{m:02d}"

    return "0:00"

