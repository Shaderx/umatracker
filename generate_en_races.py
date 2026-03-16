"""
Generate races-en.js from GameTora race data for the Uma Musume Global version.

Usage: python generate_en_races.py

Fetches race data from GameTora's data API, filters to EN-available races,
downloads EN race banner images, and outputs races-en.js in the same format
as races.js (JP version).
"""

import json
import os
import sys
import time
import urllib.request
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ssl._create_default_https_context = ssl._create_unverified_context

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
SCRIPT_DIR = Path(__file__).parent
IMAGE_DIR = SCRIPT_DIR / 'race_images_en'
MAX_WORKERS = 8

# --- Mapping tables ---

TRACK_MAP = {
    "10001": "Sapporo", "10002": "Hakodate", "10003": "Niigata",
    "10004": "Fukushima", "10005": "Nakayama", "10006": "Tokyo",
    "10007": "Chukyou", "10008": "Kyoto", "10009": "Hanshin",
    "10010": "Kokura", "10101": "Ooi", "10103": "Kawasaki",
    "10104": "Funabashi", "10105": "Morioka",
}

GRADE_MAP = {100: "GI", 200: "GII", 300: "GIII", 400: "Open", 500: "Open", 600: "Pre-OP"}
MONTH_MAP = {i: m for i, m in enumerate(
    ["", "January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"]
) if i > 0}
HALF_MAP = {1: "1st", 2: "2nd"}
DIRECTION_MAP = {1: "right", 2: "left", 3: "straight"}
TERRAIN_MAP = {1: "turf", 2: "dirt"}
SEASON_MAP = {1: "spring", 2: "summer", 3: "autumn", 4: "winter"}
YEAR_MAP = {1: "junior", 2: "classics", 3: "senior"}


def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))


def download_image(url, dest_path):
    """Download a single image. Returns (dest_path, success, error_msg)."""
    if dest_path.exists() and dest_path.stat().st_size > 0:
        return (dest_path, True, 'cached')
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            dest_path.write_bytes(data)
        return (dest_path, True, None)
    except Exception as e:
        return (dest_path, False, str(e))


def download_all_images(image_tasks):
    """Download images in parallel. image_tasks is list of (url, dest_path)."""
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    total = len(image_tasks)
    done = 0
    failed = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(download_image, url, dest): (url, dest)
            for url, dest in image_tasks
        }
        for future in as_completed(futures):
            dest_path, success, err = future.result()
            done += 1
            if not success:
                failed.append((futures[future][0], err))
            if done % 50 == 0 or done == total:
                print(f"  Images: {done}/{total} downloaded", end='\r')

    print()
    return failed


def main():
    print("Fetching manifest from GameTora...")
    manifest = fetch_json("https://gametora.com/data/manifests/umamusume.json")

    ri_hash = manifest.get("race_instances")
    if not ri_hash:
        print("ERROR: Could not find race_instances hash in manifest")
        sys.exit(1)

    print(f"Fetching race_instances (hash: {ri_hash})...")
    instances = fetch_json(f"https://gametora.com/data/umamusume/race_instances.{ri_hash}.json")
    print(f"Total race instances: {len(instances)}")

    en_races = [
        r for r in instances
        if not r.get('special_race')
        and not r.get('details', {}).get('did_not_exist')
    ]
    en_races.sort(key=lambda r: (r['year'], r['month'], r['half']))
    print(f"EN-available races: {len(en_races)}")

    # Build race entries and collect image download tasks
    output_races = []
    image_tasks = []
    seen_banners = set()

    for idx, race in enumerate(en_races, start=1):
        d = race['details']
        track_id = str(d.get('track', ''))
        year_key = YEAR_MAP.get(race.get('year', 0), "unknown")
        banner_id = d.get('banner_id', 0)

        remote_url = f"https://gametora.com/images/umamusume/en/race_banners/thum_race_rt_000_{banner_id}_00.png"
        local_filename = f"i_race{idx}.png"
        local_path = f"race_images_en/{local_filename}"

        if banner_id not in seen_banners:
            seen_banners.add(banner_id)

        image_tasks.append((remote_url, IMAGE_DIR / local_filename))

        output_races.append({
            "id": idx,
            "name": d.get('name_en', ''),
            "nameJP": d.get('name_jp', ''),
            "type": GRADE_MAP.get(d.get('grade', 0), "Open"),
            "length": str(d.get('distance', '')),
            "surface": TERRAIN_MAP.get(d.get('terrain', 0), "unknown"),
            "racetrack": TRACK_MAP.get(track_id, f"Unknown_{track_id}"),
            "junior": year_key == "junior",
            "classics": year_key == "classics",
            "senior": year_key == "senior",
            "month": MONTH_MAP.get(race.get('month', 0), "Unknown"),
            "half": HALF_MAP.get(race.get('half', 0), "1st"),
            "direction": DIRECTION_MAP.get(d.get('direction', 0), "unknown"),
            "season": SEASON_MAP.get(d.get('season', 0), "unknown"),
            "image": local_path,
            "imageRemote": remote_url,
        })

    # Download images
    print(f"\nDownloading {len(image_tasks)} EN race banner images to {IMAGE_DIR}/...")
    t0 = time.time()
    failed = download_all_images(image_tasks)
    elapsed = time.time() - t0
    print(f"Download complete in {elapsed:.1f}s")

    if failed:
        print(f"\nWARNING: {len(failed)} images failed to download:")
        for url, err in failed[:10]:
            print(f"  {url.split('/')[-1]}: {err}")
        if len(failed) > 10:
            print(f"  ... and {len(failed) - 10} more")

    # Write races-en.js
    now = datetime.now(timezone.utc).isoformat()
    meta = {
        "generatedAt": now,
        "source": "GameTora race_instances (gametora.com)",
        "count": len(output_races),
    }

    out_path = SCRIPT_DIR / 'js' / 'data' / 'races-en.js'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('window.RACES_EN = ')
        json.dump(output_races, f, indent=2, ensure_ascii=False)
        f.write(';\n')
        f.write('window.RACES_EN_META = ')
        json.dump(meta, f, indent=2, ensure_ascii=False)
        f.write(';\n')

    print(f"\nWrote {out_path.name} with {len(output_races)} races")
    for y in [1, 2, 3]:
        name = YEAR_MAP.get(y, '?')
        count = sum(1 for r in output_races if r.get(name, False))
        print(f"  {name}: {count}")

    total_img_size = sum(f.stat().st_size for f in IMAGE_DIR.iterdir() if f.is_file())
    print(f"\nImages folder: {IMAGE_DIR} ({len(list(IMAGE_DIR.iterdir()))} files, {total_img_size / 1024:.0f} KB)")


if __name__ == '__main__':
    main()
