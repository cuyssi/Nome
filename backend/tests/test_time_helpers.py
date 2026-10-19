from datetime import datetime

from utils.helpers.time_helpers import (
    adjust_ambiguous_hour,
    extract_time_fragment,
)

from utils.helpers.datetime_helpers import (
    adjust_datetime,
    combine_fragments_to_datetime,
    parse_with_dateparser,
)


def test_seven_fifteen_uses_morning_when_it_is_the_next_occurrence():
    now = datetime(2026, 10, 16, 6, 29)
    dt = datetime(2026, 10, 16, 7, 15)

    result = adjust_ambiguous_hour(dt, now, "a las siete y cuarto")

    assert result == datetime(2026, 10, 16, 7, 15)


def test_seven_uses_evening_when_morning_has_already_passed():
    now = datetime(2026, 10, 16, 10, 0)
    dt = datetime(2026, 10, 16, 7, 0)

    result = adjust_ambiguous_hour(dt, now, "a las siete")

    assert result == datetime(2026, 10, 16, 19, 0)


def test_two_moves_to_next_day_when_it_has_already_passed():
    now = datetime(2026, 10, 16, 21, 0)
    dt = datetime(2026, 10, 16, 2, 0)

    result = adjust_ambiguous_hour(dt, now, "a las dos")

    assert result == datetime(2026, 10, 17, 2, 0)


def test_explicit_morning_context_keeps_morning_time():
    now = datetime(2026, 10, 16, 6, 29)
    dt = datetime(2026, 10, 16, 7, 0)

    result = adjust_ambiguous_hour(
        dt, now, "a las siete de la mañana"
    )

    assert result == datetime(2026, 10, 16, 7, 0)


def test_explicit_afternoon_context_uses_afternoon_time():
    now = datetime(2026, 10, 16, 6, 29)
    dt = datetime(2026, 10, 16, 7, 0)

    result = adjust_ambiguous_hour(dt, now, "a las siete de la tarde")

    assert result == datetime(2026, 10, 16, 19, 0)


def test_explicit_night_context_uses_night_time():
    now = datetime(2026, 10, 16, 6, 29)
    dt = datetime(2026, 10, 16, 9, 0)

    result = adjust_ambiguous_hour(dt, now, "a las nueve de la noche")

    assert result == datetime(2026, 10, 16, 21, 0)


def test_explicit_early_morning_context_moves_to_next_day():
    now = datetime(2026, 10, 16, 6, 29)
    dt = datetime(2026, 10, 16, 2, 0)

    result = adjust_ambiguous_hour(dt, now, "a las dos de la madrugada")

    assert result == datetime(2026, 10, 17, 2, 0)


def test_explicit_night_time_moves_to_next_day_if_already_passed():
    now = datetime(2026, 10, 16, 22, 0)
    dt = datetime(2026, 10, 16, 9, 0)

    result = adjust_ambiguous_hour(dt, now, "a las nueve de la noche")

    assert result == datetime(2026, 10, 17, 21, 0)


def test_explicit_early_morning_moves_to_next_day_at_night():
    now = datetime(2026, 10, 16, 23, 0)
    dt = datetime(2026, 10, 16, 2, 0)

    result = adjust_ambiguous_hour(dt, now, "a las dos de la madrugada")

    assert result == datetime(2026, 10, 17, 2, 0)


def test_repeated_menos_is_not_corrected():
    from utils.helpers.time_helpers import correct_minus_expressions

    text = "7 menos menos cuarto"

    assert correct_minus_expressions(text) == text


def test_normalize_time_preserves_prepositions():
    from utils.normalize_text import normalize_time

    assert normalize_time("de las 2") == "de las 2:00"
    assert normalize_time("en las 2") == "en las 2:00"


def test_explicit_morning_that_has_passed_moves_to_next_day():
    now = datetime(2026, 10, 16, 16, 0)
    dt = datetime(2026, 10, 16, 9, 0)

    result = adjust_ambiguous_hour(
        dt, now, "hoy a las nueve de la mañana"
    )

    assert result == datetime(2026, 10, 17, 9, 0)


def test_extract_simple_numeric_hour():
    from utils.helpers.time_helpers import extract_time_fragment

    assert extract_time_fragment("a las 9") is not None


def test_extract_hour_written_in_words():
    from utils.helpers.time_helpers import extract_time_fragment

    assert extract_time_fragment("a las nueve") is not None


def test_extract_hour_with_minutes_written_in_words():
    from utils.helpers.time_helpers import extract_time_fragment

    assert extract_time_fragment("a las nueve y media") is not None


def test_combine_tomorrow_with_explicit_hour():
    from utils.helpers.datetime_helpers import combine_fragments_to_datetime

    now = datetime(2026, 10, 16, 16, 0)

    _, result, _ = combine_fragments_to_datetime("mañana a las nueve", now)

    assert result == datetime(2026, 10, 17, 9, 0)


def test_combine_ambiguous_hour():
    from utils.helpers.datetime_helpers import combine_fragments_to_datetime

    now = datetime(2026, 10, 16, 16, 0)

    _, result, _ = combine_fragments_to_datetime("a las nueve", now)

    assert result == datetime(2026, 10, 16, 21, 0)


def test_extract_hour_with_half():
    result = extract_time_fragment(
        "mañana a las nueve y media"
    )
    assert result == "a las 9 y media"


def test_extract_hour_with_quarter():
    result = extract_time_fragment(
        "mañana a las nueve y cuarto"
    )
    assert result == "a las 9 y cuarto"


def test_extract_hour_minus_quarter():
    result = extract_time_fragment(
        "mañana a las nueve menos cuarto"
    )
    assert result == "a las 9 menos cuarto"


def test_combine_tomorrow_with_hour_minus_quarter():
    base = datetime(2026, 10, 16, 8, 0)

    _, result, fragments = combine_fragments_to_datetime(
        "mañana a las nueve menos cuarto",
        base,
    )

    assert result == datetime(2026, 10, 17, 8, 45)
    assert fragments["time_fragment"] == "a las 9 menos cuarto"


def test_combine_tomorrow_with_hour_minus_ten():
    base = datetime(2026, 10, 16, 8, 0)

    _, result, _ = combine_fragments_to_datetime(
        "mañana a las nueve menos diez",
        base,
    )

    assert result == datetime(2026, 10, 17, 8, 50)


def test_combine_tomorrow_with_hour_minus_five():
    base = datetime(2026, 10, 16, 8, 0)

    _, result, _ = combine_fragments_to_datetime(
        "mañana a las nueve menos cinco",
        base,
    )

    assert result == datetime(2026, 10, 17, 8, 55)


def test_combine_tomorrow_with_numeric_hour_minus_quarter():
    base = datetime(2026, 10, 16, 8, 0)

    _, result, _ = combine_fragments_to_datetime(
        "mañana a las 9 menos cuarto",
        base,
    )

    assert result == datetime(2026, 10, 17, 8, 45)


def test_combine_tomorrow_with_hour_minus_quarter_in_the_afternoon():
    base = datetime(2026, 10, 16, 8, 0)

    _, result, fragments = combine_fragments_to_datetime(
        "mañana a las nueve menos cuarto de la tarde",
        base,
    )

    assert result == datetime(2026, 10, 17, 20, 45)


def test_ambiguous_hour_moves_to_tomorrow_when_both_occurrences_have_passed():
    now = datetime(2026, 10, 16, 20, 0)
    dt = datetime(2026, 10, 16, 7, 0)

    result = adjust_ambiguous_hour(dt, now, "a las siete")

    assert result == datetime(2026, 10, 17, 7, 0)


def test_ambiguous_hour_uses_next_occurrence_across_midnight():
    now = datetime(2026, 10, 16, 23, 0)
    dt = datetime(2026, 10, 16, 1, 30)

    result = adjust_ambiguous_hour(dt, now, "a la una y media")

    assert result == datetime(2026, 10, 17, 1, 30)


def test_combine_ambiguous_hour_uses_next_occurrence():
    now = datetime(2026, 10, 16, 6, 0)

    _, result, _ = combine_fragments_to_datetime(
        "a las nueve",
        now,
    )

    assert result == datetime(2026, 10, 16, 9, 0)


def test_parse_with_dateparser_returns_match():
    base = datetime(2026, 10, 16, 8, 0)

    result, fragment = parse_with_dateparser("mañana", base)

    assert result is not None
    assert fragment is not None


def test_parse_with_dateparser_returns_none_when_no_match(monkeypatch):
    def fake_search_dates(*args, **kwargs):
        return []

    monkeypatch.setattr(
        "utils.helpers.datetime_helpers.search_dates",
        fake_search_dates,
    )

    result, fragment = parse_with_dateparser("texto sin fecha", datetime.now())

    assert result is None
    assert fragment is None


def test_parse_with_dateparser_returns_none_when_exception(monkeypatch):
    def fake_search_dates(*args, **kwargs):
        raise ValueError("Error de prueba")

    monkeypatch.setattr(
        "utils.helpers.datetime_helpers.search_dates",
        fake_search_dates,
    )

    result, fragment = parse_with_dateparser(
        "mañana",
        datetime(2026, 10, 16, 8, 0),
    )

    assert result is None
    assert fragment is None


def test_adjust_datetime_moves_past_morning_to_afternoon():
    now = datetime(2026, 10, 16, 10, 0)
    dt = datetime(2026, 10, 16, 9, 0)

    result = adjust_datetime(dt, now)

    assert result == datetime(2026, 10, 16, 21, 0)


def test_adjust_datetime_moves_past_time_to_next_day():
    now = datetime(2026, 10, 16, 20, 0)
    dt = datetime(2026, 10, 16, 15, 0)

    result = adjust_datetime(dt, now)

    assert result == datetime(2026, 10, 17, 15, 0)
