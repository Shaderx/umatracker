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
    direction_map = {'右': 'right', '左': 'left', '直線': 'straight'}
    return direction_map.get(direction, direction)


def local_image_path(image_link: str):
    if not image_link:
        return None
    filename = image_link.rsplit('/', 1)[-1]
    return f"race_images/{filename}"


def generate_races_js(csv_path: str, out_path: str):
    races = []

    with open(csv_path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_jp = (row.get('Name') or '').strip()
            name_en = (row.get('En name') or '').strip()
            date_str = (row.get('Date') or '').strip()
            year_str = (row.get('Year') or '').strip()
            junior_col = (row.get('Junior') or '').strip()
            classic_col = (row.get('Classic (クラシック)') or '').strip()
            senior_col = (row.get('Senior (シニア)') or '').strip()
            grade = (row.get('Grade') or '').strip()
            location = (row.get('Location') or '').strip()
            ground = (row.get('Ground') or '').strip()
            distance = (row.get('Distance') or '').strip()
            direction_col = (row.get('Direction') or '').strip()
            image_link = (row.get('Image Link') or '').strip()

            name = name_en or name_jp
            month, half = parse_date(date_str)
            season = get_season(month)
            # Derive year flags exclusively from Year, falling back to explicit columns if Year is missing
            # Examples: '1年目' → junior, '2年目' → classics, '3年目' → senior
            j_flag = c_flag = s_flag = False
            m_year = re.search(r'(\d)年目', year_str)
            if m_year:
                y = int(m_year.group(1))
                if y == 1:
                    j_flag = True
                elif y == 2:
                    c_flag = True
                elif y == 3:
                    s_flag = True
            else:
                j_flag = (junior_col == 'ジュニア')
                c_flag = (classic_col == 'クラシック')
                s_flag = (senior_col == 'シニア')

            race = {
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


if __name__ == '__main__':
    generate_races_js(csv_path='RaceComplete.csv', out_path='races.js')


