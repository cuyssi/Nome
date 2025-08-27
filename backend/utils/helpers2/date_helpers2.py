from datetime import datetime

def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()
    print(f"[is_today] dt={dt} -> {result}")
    return result