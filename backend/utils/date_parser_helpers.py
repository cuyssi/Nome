# # utils/date_parser_helpers.py
# from typing import Optional, Tuple
# import re
# from constants.number_map import number_map
# from datetime import datetime, timedelta

# # --------------------- Helpers ---------------------
# MINUTE_KEYWORDS = {
#     "y cuarto": 15,
#     "y media": 30,
#     "menos cuarto": -15,
#     "y diez": 10,
#     "y veinte": 20
# }

# def clean_text(text: str) -> str:
#     """Normaliza texto y corrige errores comunes."""
#     text = text.lower().strip()
#     text = re.sub(r"\s+", " ", text)
#     text = re.sub(r"\bmanana\b", "mañana", text)
#     print(f"text en clean_text: {text}")
#     return text

# def add_a_before_las(text: str) -> str:
#     """Añade 'a ' antes de 'las' si falta."""
#     re.sub(r"(?<!\ba)\s+(?=las\s+\w+)", " a ", text)
#     print(f"text en add_a_before_las: {text}")
#     return text

# def word_to_minutes(word: str) -> int:
#     if not word:
#         return 0
#     word = word.lower()
#     if word == "cuarto":
#         return 15
#     if word == "media":
#         return 30
#     if word in number_map:
#         return number_map[word]
#     try:
#         return int(word)
#     except ValueError:
#         return 0

# def extract_hour_and_minutes(text: str) -> Tuple[Optional[int], int, str]:
#     """
#     Extrae hora y minutos de expresiones tipo 'a las cuatro y cuarto'.
#     Devuelve (hora, minutos, texto_limpio)
#     """
#     text = add_a_before_las(clean_text(text))
#     hour, minute = None, 0

#     match = re.search(
#         r"a las (\d+|" + "|".join(number_map.keys()) + r")"
#         r"(?:\s*(y|menos)\s*(\d+|cuarto|media|\w+))?", text
#     )
#     if match:
#         h, operator, m = match.group(1), match.group(2), match.group(3)
#         # Hora
#         hour = int(h) if h.isdigit() else number_map.get(h)
#         # Minutos
#         if m:
#             minute = word_to_minutes(m)
#             if operator == "menos" and hour is not None:
#                 minute = 60 - minute
#                 hour = (hour - 1) % 24
#         # Limpiar texto
#         text = text.replace(match.group(0), "").strip()

#     print(f"extract_hour_and_minutes: {hour}, {minute}, {text}")
#     return hour, minute, text

# def adjust_hour_by_context(hour: Optional[int], minute: int, text: str) -> Tuple[Optional[int], int, str]:
#     """Aplica contexto 'mañana/tarde/noche' si no hay hora explícita y limpia texto."""
#     context_map = {
#         "por la mañana": 9,
#         "de la mañana": 9,
#         "por la tarde": 16,
#         "de la tarde": 16,
#         "por la noche": 21,
#         "de la noche": 21
#     }
#     for k, v in context_map.items():
#         if k in text:
#             if hour is None:
#                 hour = v
#             text = text.replace(k, "")
#     print(f"adjust_hour_by_context: {hour}, {minute}, {text.strip()}")
#     return hour, minute, text.strip()

# def extract_simple_time(text: str) -> Tuple[Tuple[Optional[int], int], str]:
#     """Función principal que devuelve (hora, minuto) y texto limpio."""
#     hour, minute, text = extract_hour_and_minutes(text)
#     hour, minute, text = adjust_hour_by_context(hour, minute, text)
#     text = re.sub(r"\s+", " ", text).strip()
#     print(f"extract_simple_time: {hour}, {minute}, {text}")
#     return (hour, minute), text

# # --------------------- Fecha ---------------------
# def is_today(dt: datetime) -> bool:
#     return dt.date() == datetime.now().date()

# def combine_date_and_time(text: str) -> Tuple[Optional[datetime], str]:
#     """
#     Calcula fecha y hora completas a partir de texto.
#     - Usa extract_simple_time para sacar hora y texto limpio.
#     - Ajusta fecha: si la hora ya pasó hoy, pone mañana.
#     """
#     now = datetime.now()
#     (hour, minute), clean_text = extract_simple_time(text)
#     if hour is None:
#         hour, minute = 9, 0  # valor por defecto

#     combined = datetime.combine(now.date(), datetime.min.time()).replace(hour=hour, minute=minute)

#     # Si ya pasó hoy, poner mañana
#     if combined <= now:
#         combined += timedelta(days=1)

#     return combined, clean_text
