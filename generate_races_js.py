import csv
import json
import os
import re
from datetime import datetime, timezone


def parse_date(date_str: str):
    """Parse JP date like '11月前半' → ('November', '1st').

    Uses regex to capture the numeric month to avoid substring traps
    like matching '1月' inside '11月'.
    """
    month_names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    m = re.search(r'(\d{1,2})月', date_str)
    if m:
        try:
            month_num = max(1, min(12, int(m.group(1))))
        except ValueError:
            month_num = 1
    else:
        month_num = 1

    month = month_names[month_num - 1]
    half = '1st' if '前半' in date_str else ('2nd' if '後半' in date_str else '1st')
    return month, half


def month_from_number(month_num_str: str):
    """Convert Month_Num (1-12) to English month name."""
    month_names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    try:
        n = int(month_num_str)
    except (TypeError, ValueError):
        n = 1
    n = max(1, min(12, n))
    return month_names[n - 1]


def half_from_label(half_label: str):
    """Convert Month_Half ('前半'/'後半') to '1st'/'2nd'."""
    label = (half_label or '').strip()
    return '2nd' if label == '後半' else '1st'


def normalize_key(key: str):
    """Normalize CSV header keys: strip, collapse spaces, remove zero-width/nbsp."""
    if key is None:
        return ''
    k = key.replace('\ufeff', '')  # BOM if present in keys beyond first
    k = k.replace('\u200b', '')    # zero-width space
    k = k.replace('\xa0', ' ')     # non-breaking space
    k = k.strip()
    # collapse any repeated whitespace to single spaces
    k = re.sub(r'\s+', ' ', k)
    return k


def normalize_cell(value: str):
    """Normalize a CSV cell value by stripping and removing odd spaces."""
    if value is None:
        return ''
    v = str(value)
    v = v.replace('\ufeff', '').replace('\u200b', '').replace('\xa0', ' ')
    return v.strip()


def find_header_and_rows(csv_path: str):
    """Robustly read CSV and find the correct header row.

    Some sheets export an extra language label row like ["Japanese", "", ..., ""],
    followed by the real header row ["Name", "En name", ..., "Image Link"].

    Returns: (headers_normalized: list[str], data_rows: list[list[str]])
    """
    with open(csv_path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.reader(f)
        rows = [[normalize_cell(c) for c in row] for row in reader]

    # Heuristic: choose the first row that contains expected header tokens
    expected_keys = {'Name', 'En name', 'Month_Num', 'Month_Half', 'Year', 'Grade', 'Location', 'Ground', 'Distance', 'Direction', 'Inner or outer', 'Image Link'}
    header_idx = None
    for i, row in enumerate(rows[:10]):
        if not row:
            continue
        row_set = set(row)
        # If at least 3 expected keys appear in this row, treat as header
        if len(expected_keys.intersection(row_set)) >= 3:
            header_idx = i
            break

    # Fallback: if we didn't find it, assume the first row is header
    if header_idx is None:
        header_idx = 0

    header_raw = rows[header_idx]
    # Normalize header keys
    headers = [normalize_key(h) for h in header_raw]

    data_rows = rows[header_idx + 1:]
    return headers, data_rows

def get_season(month: str):
    season_map = {
        'December': 'winter', 'January': 'winter', 'February': 'winter',
        'March': 'spring', 'April': 'spring', 'May': 'spring',
        'June': 'summer', 'July': 'summer', 'August': 'summer',
        'September': 'autumn', 'October': 'autumn', 'November': 'autumn'
    }
    return season_map.get(month, 'spring')


def convert_grade(grade: str):
    grade_map = {'G1': 'GI', 'G2': 'GII', 'G3': 'GIII', 'OP': 'Open', 'Pre-OP': 'Pre-OP'}
    return grade_map.get(grade, grade)


def convert_surface(ground: str):
    surface_map = {'芝': 'turf', 'ダート': 'dirt'}
    return surface_map.get(ground, ground)


def convert_track_name(location: str):
    track_map = {
        '東京': 'Tokyo',
        '中山': 'Nakayama (Chiba)',
        '京都': 'Kyoto',
        '阪神': 'Hanshin (Takarazuka)',
        '中京': 'Chukyou (Nagoya)',
        '小倉': 'Kokura (Kitakyushu)',
        '札幌': 'Sapporo',
        '函館': 'Hakodate',
        '新潟': 'Niigata',
        '福島': 'Fukushima',
        '川崎': 'Kawasaki',
        '大井': 'Ooi',
        '船橋': 'Funabashi',
        '盛岡': 'Morioka'
    }
    return track_map.get(location, location)


def convert_direction(direction: str):
    direction_map = {'右': 'right', '左': 'left', '直線': 'straight', '直': 'straight'}
    return direction_map.get(direction, direction)


def local_image_path(image_link: str):
    if not image_link:
        return None
    filename = image_link.rsplit('/', 1)[-1]
    return f"race_images/{filename}"


def generate_races_js(csv_path: str, out_path: str):
    races = []
    debug = {'fieldnames': None, 'samples': []}

    headers, data_rows = find_header_and_rows(csv_path)
    debug['fieldnames'] = headers
    race_id = 1
    for row in data_rows:
        # Build normalized row mapping by header
        # Pad or trim row to header length
        padded = (row + [''] * len(headers))[:len(headers)]
        row_n = {headers[i]: normalize_cell(padded[i]) for i in range(len(headers))}

        name_jp = row_n.get('Name', '')
        # Some exports drop the 'En name' header, leaving it blank. Fallback to '' header.
        name_en = row_n.get('En name', '') or row_n.get('', '')
        year_label = row_n.get('Year', '')
        year_num_str = row_n.get('Year_Num', '')
        month_num_str = row_n.get('Month_Num', '')
        month_half_label = row_n.get('Month_Half', '')
        grade = row_n.get('Grade', '')
        location = row_n.get('Location', '')
        ground = row_n.get('Ground', '')
        distance = row_n.get('Distance', '')
        direction_base = row_n.get('Direction', '')
        inner_outer = row_n.get('Inner or outer', '')
        # Normalize straight course represented as Direction='直' and Inner or outer='線'
        if direction_base == '直' or (direction_base == '' and inner_outer == '線'):
            direction_col = '直線'
        else:
            direction_col = direction_base
        image_link = row_n.get('Image Link', '')

        # Collect debug for first few rows
        if len(debug['samples']) < 3:
            debug['samples'].append({
                'raw_row': row,
                'norm_row': row_n,
                'picked': {
                    'Name': name_jp,
                    'En name': name_en,
                    'Year': year_label,
                    'Year_Num': year_num_str,
                    'Month_Num': month_num_str,
                    'Month_Half': month_half_label,
                    'Grade': grade,
                    'Location': location,
                    'Ground': ground,
                    'Distance': distance,
                    'Direction': direction_base,
                    'Inner or outer': inner_outer,
                    'Image Link': image_link,
                }
            })

        name = name_en or name_jp
        month = month_from_number(month_num_str)
        half = half_from_label(month_half_label)
        season = get_season(month)
        # Derive year flags from 'Year' label, with fallback to numeric 'Year_Num'
        j_flag = (year_label == 'ジュニア')
        c_flag = (year_label == 'クラシック')
        s_flag = (year_label == 'シニア')
        if not (j_flag or c_flag or s_flag):
            try:
                y = int(year_num_str)
            except (TypeError, ValueError):
                y = 0
            j_flag = (y == 1)
            c_flag = (y == 2)
            s_flag = (y == 3)

        race = {
            'id': race_id,
            'name': name,
            'nameJP': name_jp,
            'type': convert_grade(grade),
            'length': distance,
            'surface': convert_surface(ground),
            'racetrack': convert_track_name(location),
            'junior': j_flag,
            'classics': c_flag,
            'senior': s_flag,
            'month': month,
            'half': half,
            'direction': convert_direction(direction_col),
            'season': season,
        }

        local_img = local_image_path(image_link)
        if local_img:
            race['image'] = local_img
            race['imageRemote'] = image_link

        races.append(race)
        race_id += 1

    # Write as a JS assignment for file:// compatibility
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write('window.RACES = ')
        json.dump(races, out, ensure_ascii=False, indent=2)
        out.write(';\n')
        meta = {
            'generatedAt': datetime.now(timezone.utc).isoformat(),
            'source': os.path.basename(csv_path),
            'count': len(races),
        }
        out.write('window.RACES_META = ')
        json.dump(meta, out, ensure_ascii=False, indent=2)
        out.write(';\n')

    # Write a separate debug file to help inspect CSV parsing
    try:
        with open('races_debug.json', 'w', encoding='utf-8') as dbg:
            json.dump(debug, dbg, ensure_ascii=False, indent=2)
    except Exception:
        pass


if __name__ == '__main__':
    generate_races_js(csv_path='RaceComplete.csv', out_path='races.js')


