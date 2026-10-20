#!/usr/bin/env python3
"""RTS.FM primary-source radar.

Looks for nightlife and live-music stories in public records instead of in
other publications' feeds: UK planning applications (PlanIt), The Gazette
(insolvency and other legal notices), Parliament written questions and GOV.UK
publications. It only reports leads, with a link to the primary document; a
lead is not a fact until someone has read the document.

Run:  python3 scripts/radar.py [--days 14] [--all]
Output: .radar/digest-YYYY-MM-DD.md (gitignored). Items already reported are
remembered in .radar/seen.json, so each run lists only what is new (--all
ignores that memory). Standard library only.
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / ".radar"
UA = "rts-fm-radar/1.0 (+https://rts.fm)"

CLUB_TERMS = ["nightclub", "night club", "music venue", "live music venue", "late night venue"]
POLICY_TERMS = ['"night-time economy"', '"music venues"', "nightclubs", '"licensing act"', '"live music"']
# Words in a planning description that make a club-related application a story.
PLANNING_SIGNALS = ["demolition", "change of use", "redevelopment", "residential", "flats", "student", "hotel", "extension"]
GOVUK_SKIP_FORMATS = {"travel_advice", "transparency", "manual_section", "hmrc_manual_section", "hmrc_contact", "policy_group", "service_standard_report"}
GOVUK_KEEP_FORMATS = {"consultation", "open_consultation", "closed_consultation", "consultation_outcome", "press_release", "news_story", "written_statement", "national_statistics", "official_statistics", "statistics", "guidance", "document_collection"}


def get_json(url, retries=2):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for attempt in range(retries + 1):
        time.sleep(1)  # be polite to public APIs
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            # Public APIs rate-limit bursts or hiccup; wait and retry instead of dropping a term.
            if e.code in (429, 500, 502, 503) and attempt < retries:
                time.sleep(15 * (attempt + 1))
                continue
            raise
        except (ConnectionError, urllib.error.URLError):
            if attempt < retries:
                time.sleep(10)
                continue
            raise


def safe(label, fn, *args):
    """Run one source call; a failing source must not kill the whole run."""
    try:
        return fn(*args)
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as e:
        print(f"[radar] {label} failed: {e}", file=sys.stderr)
        return None


def planit(since, until):
    items = []
    for term in CLUB_TERMS:
        time.sleep(3)
        url = "https://www.planit.org.uk/api/applics/json?" + urllib.parse.urlencode(
            {"search": term, "start_date": since, "end_date": until, "pg_sz": 100, "sort": "-start_date"}
        )
        data = safe(f"planit {term}", get_json, url)
        for r in (data.get("records", []) if data else []):
            desc = r.get("description", "")
            low = desc.lower()
            if not any(t in low for t in ("nightclub", "night club", "music venue", "live music", "club")):
                continue
            signals = [s for s in PLANNING_SIGNALS if s in low]
            items.append(
                {
                    "key": f"planit:{r.get('name')}",
                    "source": "Planning application",
                    "score": 3 + len(signals) * 2,
                    "date": r.get("start_date", ""),
                    "title": f"{r.get('area_name')}: {r.get('address', '')}",
                    "text": desc[:300],
                    "link": r.get("link") or r.get("url"),
                    "note": ("signals: " + ", ".join(signals) + "; ") if signals else "",
                    "extra": f"status: {r.get('other_fields', {}).get('status', r.get('app_state', ''))}; consultation ends: {r.get('consulted_date') or 'n/a'}",
                }
            )
    return items


def gazette(since, until):
    items = []
    for term in ["nightclub", "night club", "music venue", "live music venue"]:
        url = "https://www.thegazette.co.uk/all-notices/notice/data.json?" + urllib.parse.urlencode(
            {"text": term, "start-publish-date": since, "end-publish-date": until, "results-page-size": 50}
        )
        data = safe(f"gazette {term}", get_json, url)
        entries = (data.get("entry") if data else None) or []
        if isinstance(entries, dict):
            entries = [entries]
        for e in entries:
            link = e.get("id", "")
            # Gazette "Supplement" pages are honours and licence lists, not
            # notices about businesses; only /id/notice/ records are useful.
            if "/id/notice/" not in link:
                continue
            items.append(
                {
                    "key": f"gazette:{link}",
                    "source": "Gazette notice",
                    "score": 6,
                    "date": (e.get("published") or e.get("updated") or "")[:10],
                    "title": e.get("title", ""),
                    "text": f"matched '{term}', notice code {e.get('f:notice-code', 'n/a')}",
                    "link": link.replace("/id/notice/", "/notice/"),
                    "note": "",
                    "extra": "",
                }
            )
    return items


def hansard(since, until):
    items = []
    terms = ["nightclubs", "night-time economy", "music venues", "live music", "licensing act"]
    for term in terms:
        url = "https://questions-statements-api.parliament.uk/api/writtenquestions/questions?" + urllib.parse.urlencode(
            {"searchTerm": term, "take": 60}
        )
        data = safe(f"hansard {term}", get_json, url)
        for r in (data.get("results", []) if data else []):
            v = r["value"]
            # The API ignores searchTerm when date filters are present, so
            # search by term only and apply the date window here.
            if v.get("dateTabled", "")[:10] < since:
                continue
            if not re.search(r"night ?club|night-time|music venue|live music|licensing act|late.night", v.get("questionText", ""), re.I):
                continue
            items.append(
                {
                    "key": f"wq:{v['id']}",
                    "source": "Written question",
                    "score": 4,
                    "date": v.get("dateTabled", "")[:10],
                    "title": f"Written question {v.get('uin')} ({v.get('house')})",
                    "text": v.get("questionText", "")[:300],
                    "link": f"https://questions-statements.parliament.uk/written-questions/detail/{v.get('dateTabled', '')[:10]}/{v.get('uin')}",
                    "note": "",
                    "extra": "answered" if v.get("dateAnswered") else "unanswered",
                }
            )
    return items


def govuk(since, until):
    items = []
    for term in POLICY_TERMS:
        url = "https://www.gov.uk/api/search.json?" + urllib.parse.urlencode(
            [("q", term), ("filter_public_timestamp", f"from:{since}"), ("order", "-public_timestamp"), ("count", 30),
             ("fields", "title"), ("fields", "public_timestamp"), ("fields", "link"), ("fields", "format"), ("fields", "description")]
        )
        data = safe(f"govuk {term}", get_json, url)
        for r in (data.get("results", []) if data else []):
            fmt = r.get("format", "")
            if fmt in GOVUK_SKIP_FORMATS or fmt not in GOVUK_KEEP_FORMATS:
                continue
            blob = (r.get("title", "") + " " + (r.get("description") or "")).lower()
            if not re.search(r"night|licens|music|venue|late-night|alcohol", blob):
                continue
            items.append(
                {
                    "key": f"govuk:{r['link']}",
                    "source": "GOV.UK",
                    "score": 5 if "consultation" in fmt else 2,
                    "date": r.get("public_timestamp", "")[:10],
                    "title": r.get("title", ""),
                    "text": (r.get("description") or "")[:300],
                    "link": "https://www.gov.uk" + r["link"],
                    "note": "",
                    "extra": fmt,
                }
            )
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--all", action="store_true", help="ignore the seen-items memory")
    args = ap.parse_args()
    today = dt.date.today()
    since = (today - dt.timedelta(days=args.days)).isoformat()
    until = today.isoformat()

    OUT.mkdir(exist_ok=True)
    seen_path = OUT / "seen.json"
    seen = set(json.loads(seen_path.read_text())) if seen_path.exists() and not args.all else set()

    found = {}
    for label, fn in [("planit", planit), ("gazette", gazette), ("hansard", hansard), ("govuk", govuk)]:
        for it in fn(since, until):
            if it["key"] not in seen:
                found.setdefault(it["key"], it)

    items = sorted(found.values(), key=lambda i: (-i["score"], i["date"]), reverse=False)
    items.sort(key=lambda i: (-i["score"], -int(i["date"].replace("-", "") or 0)))

    lines = [f"# RTS.FM primary-source radar, {today.isoformat()}", "",
             f"Window: {since} to {until}. {len(items)} new leads. Every item links to the primary record; read it before writing anything.", ""]
    by = {}
    for i in items:
        by.setdefault(i["source"], []).append(i)
    for source, group in by.items():
        lines += [f"## {source} ({len(group)})", ""]
        for i in group:
            lines.append(f"- **{i['title']}** ({i['date']}) score {i['score']}")
            if i["text"]:
                lines.append(f"  - {i['text']}")
            meta = " ".join(x for x in [i["note"], i["extra"]] if x)
            if meta:
                lines.append(f"  - {meta}")
            lines.append(f"  - {i['link']}")
        lines.append("")
    path = OUT / f"digest-{today.isoformat()}.md"
    path.write_text("\n".join(lines))
    seen_path.write_text(json.dumps(sorted(seen | set(found))))
    print(path)
    print(f"{len(items)} new leads: " + ", ".join(f"{k} {len(v)}" for k, v in by.items()))


if __name__ == "__main__":
    main()
