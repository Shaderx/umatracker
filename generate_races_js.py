import csv
import json
import os
from datetime import datetime, timezone


def parse_date(date_str: str):
    month_map = {
        '1月': 'January', '2月': 'February', '3月': 'March', '4月': 'April',
        '5月': 'May', '6月': 'June', '7月': 'July', '8月': 'August',
        '9月': 'September', '10月': 'October', '11月': 'November', '12月': 'December'
    }
    half_map = {'前半': '1st', '後半': '2nd'}

    month_key = None
    half_key = None
    # find first occurrence for month/half markers
    for key in month_map.keys():
        if key in date_str:
            month_key = key
            break
    for key in half_map.keys():
        if key in date_str:
            half_key = key
            break

    month = month_map.get(month_key, 'January')
    half = half_map.get(half_key, '1st')
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
            race = {
                'name': name,
                'nameJP': name_jp,
                'type': convert_grade(grade),
                'length': distance,
                'surface': convert_surface(ground),
                'racetrack': convert_track_name(location),
                'junior': junior_col == 'ジュニア',
                'classics': classic_col == 'クラシック',
                'senior': senior_col == 'シニア',
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


