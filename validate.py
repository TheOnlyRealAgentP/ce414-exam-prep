"""Checks the exam prep content in data/*.js (same checks as validate.mjs, for machines without Node).
Usage: python validate.py
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def load(path):
    src = open(path, encoding="utf8").read().strip()
    m = re.match(r"^EX\.(week|exam)\((.*)\);$", src, re.S)
    if not m:
        raise ValueError(f"{os.path.basename(path)}: expected EX.week({{...}}); or EX.exam({{...}});")
    body = m.group(2)
    # Quote bare object keys (word or number followed by a colon) outside of strings
    out, i, n = [], 0, len(body)
    while i < n:
        c = body[i]
        if c == '"':
            j = i + 1
            while body[j] != '"':
                j += 2 if body[j] == "\\" else 1
            out.append(body[i : j + 1])
            i = j + 1
            continue
        k = re.match(r"([A-Za-z_]\w*|\d+)(\s*):", body[i:])
        if k and (not out or re.search(r"[{,\s]$", out[-1])):
            out.append(f'"{k.group(1)}"{k.group(2)}:')
            i += k.end()
            continue
        out.append(c)
        i += 1
    return m.group(1), json.loads("".join(out))


def main():
    weeks, exams, errors = [], [], []
    err = errors.append
    data = os.path.join(HERE, "data")
    for f in sorted(os.listdir(data)):
        if f.endswith(".js"):
            kind, obj = load(os.path.join(data, f))
            (weeks if kind == "week" else exams).append(obj)

    ids = set()
    is_str = lambda s: isinstance(s, str) and s.strip()
    for w in weeks:
        at = "w%02d" % w["num"]
        if w["id"] != at:
            err(f'{at}: id should be "{at}"')
        if w.get("exam") not in (1, 2):
            err(f"{at}: exam must be 1 or 2")
        for k in ("title", "blurb"):
            if not is_str(w.get(k)):
                err(f"{at}: missing {k}")
        if not w.get("notes"):
            err(f"{at}: no notes")
        for q in w["questions"]:
            where = f'{at} {q["id"]}'
            if q["id"] in ids:
                err(f"{where}: duplicate id")
            ids.add(q["id"])
            if not q["id"].startswith(at + "-q"):
                err(f"{where}: id should start with {at}-q")
            if q.get("from") not in ("self-check", "reading", "hand-calc"):
                err(f"{where}: from must be self-check, reading or hand-calc")
            for k in ("prompt", "explain", "source"):
                if not is_str(q.get(k)):
                    err(f"{where}: missing {k}")
            if q["type"] == "mc":
                ch = q.get("choices") or []
                if len(ch) < 2:
                    err(f"{where}: needs at least two choices")
                elif len(set(ch)) != len(ch):
                    err(f"{where}: repeated choice")
                if not isinstance(q.get("answer"), int) or isinstance(q.get("answer"), bool) or not 0 <= q["answer"] < len(ch):
                    err(f"{where}: answer out of range")
            elif q["type"] == "tf":
                if not isinstance(q.get("answer"), bool):
                    err(f"{where}: true/false answer must be true or false")
            else:
                err(f"{where}: type must be mc or tf")

    for e in exams:
        have = sum(len(w["questions"]) for w in weeks if w["num"] in e["weeks"])
        target = sum(e["target"].values())
        if target != e["format"]["questions"]:
            err(f'exam{e["id"]}: week targets add to {target}, not {e["format"]["questions"]}')
        if have < e["format"]["questions"]:
            err(f'exam{e["id"]}: only {have} questions for a {e["format"]["questions"]}-question exam')

    if errors:
        print("\n".join(errors), file=sys.stderr)
        sys.exit(1)
    n = sum(len(w["questions"]) for w in weeks)
    print(f"OK: {len(weeks)} weeks, {n} questions, {len(exams)} exams")


if __name__ == "__main__":
    main()
