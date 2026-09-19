#!/usr/bin/env python3
"""Monthly SEO snapshot: GSC page positions (with the 8-15 band flagged) and,
optionally, GA4 sessions from AI assistants. Saves seo-snapshots/YYYY-MM-DD.json
and prints the change against the previous snapshot.

Usage: python3 scripts/seo-snapshot.py [--ga4-property 123456789]

Depends on the Google auth helper from the local SEO skill
(~/.claude/skills/seo/scripts/google_auth.py) and its stored OAuth token.
"""
import argparse
import datetime
import glob
import json
import os
import sys

sys.path.insert(0, os.path.expanduser("~/.claude/skills/seo/scripts"))
import google_auth as g  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402

SITE = "https://rts.fm/"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "seo-snapshots")
AI_SOURCES = r"chatgpt|openai|perplexity|gemini|claude|anthropic|copilot|grok|you\.com|meta\.ai|deepseek"


def gsc_pages(days):
    creds = g.get_oauth_credentials(["https://www.googleapis.com/auth/webmasters.readonly"])
    svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    end = datetime.date.today() - datetime.timedelta(days=2)
    start = end - datetime.timedelta(days=days)
    body = {"startDate": str(start), "endDate": str(end), "dimensions": ["page"], "rowLimit": 1000}
    rows = svc.searchanalytics().query(siteUrl=SITE, body=body).execute().get("rows", [])
    return {
        r["keys"][0].replace("https://rts.fm", "") or "/": {
            "impressions": r["impressions"],
            "clicks": r["clicks"],
            "position": round(r["position"], 1),
        }
        for r in rows
    }


def ga4_ai_sessions(property_id, days):
    creds = g.get_oauth_credentials(["https://www.googleapis.com/auth/analytics.readonly"])
    svc = build("analyticsdata", "v1beta", credentials=creds, cache_discovery=False)
    body = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "sessionSource"}, {"name": "landingPage"}],
        "metrics": [{"name": "sessions"}],
        "dimensionFilter": {
            "filter": {
                "fieldName": "sessionSource",
                "stringFilter": {"matchType": "PARTIAL_REGEXP", "value": AI_SOURCES, "caseSensitive": False},
            }
        },
        "limit": 200,
    }
    rows = svc.properties().runReport(property=f"properties/{property_id}", body=body).execute().get("rows", [])
    return [
        {"source": r["dimensionValues"][0]["value"], "landing_page": r["dimensionValues"][1]["value"], "sessions": int(r["metricValues"][0]["value"])}
        for r in rows
    ]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ga4-property", help="GA4 property ID for rts.fm (numeric)")
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    prev_files = sorted(glob.glob(os.path.join(OUT_DIR, "*.json")))
    prev = json.load(open(prev_files[-1])) if prev_files else None

    snap = {"date": str(datetime.date.today()), "gsc_90d": gsc_pages(90), "gsc_28d": gsc_pages(28)}
    if args.ga4_property:
        snap["ga4_ai_sessions_90d"] = ga4_ai_sessions(args.ga4_property, 90)
    else:
        print("GA4 skipped: pass --ga4-property to include AI-assistant sessions.")

    path = os.path.join(OUT_DIR, f"{snap['date']}.json")
    json.dump(snap, open(path, "w"), indent=1, sort_keys=True)

    band = {p: v for p, v in snap["gsc_90d"].items() if 8 <= v["position"] <= 15 and v["impressions"] >= 5}
    print(f"\nPages at positions 8-15 with 5+ impressions (90d): {len(band)}")
    for p, v in sorted(band.items(), key=lambda kv: -kv[1]["impressions"]):
        before = prev["gsc_90d"].get(p) if prev else None
        delta = f"  (was {before['position']})" if before else ""
        print(f"  {v['impressions']:4d} imp  pos {v['position']:5.1f}{delta}  {p}")
    if "ga4_ai_sessions_90d" in snap:
        total = sum(r["sessions"] for r in snap["ga4_ai_sessions_90d"])
        print(f"\nAI-assistant sessions (90d): {total}")
    print(f"\nSaved {os.path.relpath(path)}")


if __name__ == "__main__":
    main()
