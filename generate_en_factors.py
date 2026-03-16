"""
Generate hidden-factors-en.js from GameTora nickname data for Trackblazer scenario.

Usage: python generate_en_factors.py

Fetches nickname + race data from GameTora, extracts Trackblazer (scenario 4) entries,
resolves race ID references to English names, and outputs hidden-factors-en.js.
"""

import json, sys, urllib.request, ssl, re
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ssl._create_default_https_context = ssl._create_unverified_context

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
SCRIPT_DIR = Path(__file__).parent
TRACKBLAZER_SCENARIO = 4

TRACK_MAP = {
    10001: "Sapporo", 10002: "Hakodate", 10003: "Niigata",
    10004: "Fukushima", 10005: "Nakayama", 10006: "Tokyo",
    10007: "Chukyou", 10008: "Kyoto", 10009: "Hanshin",
    10010: "Kokura", 10101: "Ooi", 10103: "Kawasaki",
    10104: "Funabashi", 10105: "Morioka",
}


def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))


def build_race_lookup(races):
    """Build GT race ID -> {name_en, name_jp, ...} lookup from GameTora unique races."""
    lookup = {}
    for r in races:
        rid = r['id']
        lookup[rid] = {
            'name_en': r.get('name_en', ''),
            'name_jp': r.get('name_jp', ''),
            'grade': r.get('grade', 0),
            'terrain': r.get('terrain', 0),
            'track': r.get('track', 0),
        }
    return lookup


def resolve_race_refs(desc_list, race_lookup):
    """Extract [[race|ID]] or [[race|ID|year]] refs from desc_en list, return race names."""
    race_names = []
    pattern = re.compile(r'\[\[race\|(\d+)(?:\|(\d+))?\]\]')
    for desc in desc_list:
        for match in pattern.finditer(desc):
            gt_id = int(match.group(1))
            info = race_lookup.get(gt_id)
            if info:
                name = info['name_en']
                if name and name not in race_names:
                    race_names.append(name)
    return race_names


def resolve_nickname_refs(desc_list):
    """Extract [[nickname|ID]] refs."""
    pattern = re.compile(r'\[\[nickname\|(\d+)\]\]')
    refs = []
    for desc in desc_list:
        for match in pattern.finditer(desc):
            refs.append(int(match.group(1)))
    return refs


def classify_factor(entry, race_names):
    """Determine the check type and parameters for a factor."""
    desc_items = entry['desc_en'] if isinstance(entry['desc_en'], list) else [entry['desc_en']]
    gl_desc = entry.get('desc_en_gl', '')
    desc_full = ' '.join(desc_items).lower()

    if race_names:
        return {"type": "specific_races", "races": race_names, "trackable": True}

    dirt_g1_match = re.search(r'win (\d+) (?:g1 )?dirt (?:g1 )?races', desc_full)
    if not dirt_g1_match:
        dirt_g1_match = re.search(r'win (\d+) (?:g1 )?dirt (?:g1 )?races', gl_desc.lower())
    if dirt_g1_match:
        count = int(dirt_g1_match.group(1))
        is_g1 = 'g1' in desc_full or 'g1' in gl_desc.lower()
        return {"type": "dirt_wins", "count": count, "g1_only": is_g1, "trackable": True}

    dirt_match = re.search(r'win (\d+) dirt races', desc_full)
    if not dirt_match:
        dirt_match = re.search(r'win (\d+) dirt races', gl_desc.lower())
    if dirt_match:
        return {"type": "dirt_wins", "count": int(dirt_match.group(1)), "g1_only": False, "trackable": True}

    track_match = re.search(r'win (?:\d+ )?graded races?.+?held (?:at|in) (.+?)(?:\s*\(|$)', gl_desc, re.IGNORECASE)
    if track_match:
        track_str = track_match.group(1).strip()
        tracks = [t.strip().rstrip(',') for t in re.split(r',\s*or\s*|\s*or\s*|,\s*', track_str)]
        count_match = re.search(r'win (\d+)', gl_desc.lower())
        count = int(count_match.group(1)) if count_match else 3
        return {"type": "track_wins", "tracks": tracks, "count": count, "trackable": True}

    return {"type": "untrackable", "trackable": False}


def main():
    print("Fetching GameTora manifest...")
    manifest = fetch_json("https://gametora.com/data/manifests/umamusume.json")

    nick_hash = manifest['nicknames']
    races_hash = manifest['races']

    print(f"Fetching nicknames (hash: {nick_hash})...")
    nicknames = fetch_json(f"https://gametora.com/data/umamusume/nicknames.{nick_hash}.json")
    print(f"Total nicknames: {len(nicknames)}")

    print(f"Fetching races (hash: {races_hash})...")
    races = fetch_json(f"https://gametora.com/data/umamusume/races.{races_hash}.json")
    race_lookup = {}
    for r in races:
        race_lookup[r['id']] = r

    trackblazer = [n for n in nicknames if n.get('scenario') == TRACKBLAZER_SCENARIO]
    trackblazer.sort(key=lambda x: x['id'])
    print(f"Trackblazer factors: {len(trackblazer)}")

    nickname_lookup = {n['id']: n for n in nicknames}

    factors = []
    for entry in trackblazer:
        desc_items = entry['desc_en'] if isinstance(entry['desc_en'], list) else [entry['desc_en']]
        race_names = resolve_race_refs(desc_items, race_lookup)
        nick_refs = resolve_nickname_refs(desc_items)
        classification = classify_factor(entry, race_names)

        prereq_names = []
        for nid in nick_refs:
            ref_entry = nickname_lookup.get(nid)
            if ref_entry:
                prereq_names.append(ref_entry.get('name_en_gl') or ref_entry.get('name_en', ''))

        factor = {
            "id": entry['id'],
            "nameEN": entry.get('name_en_gl') or entry.get('name_en', ''),
            "nameJP": entry.get('name_jp', ''),
            "conditionEN": entry.get('desc_en_gl', ''),
            "conditionJP": entry.get('desc_jp', ''),
            "rank": entry['rank'],
            "checkType": classification['type'],
            "trackable": classification['trackable'],
        }

        if classification['type'] == 'specific_races':
            factor['raceNames'] = classification['races']
        elif classification['type'] == 'dirt_wins':
            factor['count'] = classification['count']
            factor['g1Only'] = classification.get('g1_only', False)
        elif classification['type'] == 'track_wins':
            factor['tracks'] = classification['tracks']
            factor['count'] = classification['count']

        if prereq_names:
            factor['prereqEpithets'] = prereq_names

        if entry.get('rewards'):
            factor['rewards'] = entry['rewards']

        factors.append(factor)

    now = datetime.now(timezone.utc).isoformat()
    meta = {
        "generatedAt": now,
        "source": "GameTora nicknames - Trackblazer scenario (gametora.com)",
        "count": len(factors),
    }

    out_path = SCRIPT_DIR / 'hidden-factors-en.js'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('window.HIDDEN_FACTORS_EN = ')
        json.dump(factors, f, indent=2, ensure_ascii=False)
        f.write(';\n')
        f.write('window.HIDDEN_FACTORS_EN_META = ')
        json.dump(meta, f, indent=2, ensure_ascii=False)
        f.write(';\n')

    print(f"\nWrote {out_path.name} with {len(factors)} factors")
    trackable = sum(1 for f in factors if f['trackable'])
    print(f"  Trackable: {trackable}, Non-trackable: {len(factors) - trackable}")
    for f in factors:
        tag = "✓" if f['trackable'] else "✗"
        print(f"  {tag} [{f['checkType']}] {f['nameEN']} ({f['nameJP']})")


if __name__ == '__main__':
    main()
