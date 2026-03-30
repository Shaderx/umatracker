// js/data/epithets-en.js
// Epithet (Trailblazer mission) definitions for the Global/EN version
// Replaces JP hidden factors when EN database is active

import { state } from '../core/state.js';
import { distanceCategories } from './race-data.js';

// ── Helpers ──────────────────────────────────────────────────────────

function wonRaces() {
    return [...state.wonRaces]
        .map(id => state.raceById?.get(String(id)))
        .filter(Boolean);
}

function countWonBySurface(surface) {
    return wonRaces().filter(r => r.surface === surface).length;
}

function countWonBySurfaceAndGrade(surface, grades) {
    return wonRaces().filter(r => r.surface === surface && grades.includes(r.type)).length;
}

function countWonAtTracks(tracks, graded = false) {
    return wonRaces().filter(r => {
        const trackMatch = tracks.includes(r.racetrack);
        if (!graded) return trackMatch;
        return trackMatch && ['GI', 'GII', 'GIII'].includes(r.type);
    }).length;
}

function countWonByNamePattern(pattern) {
    const re = new RegExp(pattern, 'i');
    return wonRaces().filter(r => re.test(r.name)).length;
}

function isWon(nameSubstring) {
    return wonRaces().some(r => r.name.includes(nameSubstring));
}

function countWonFromSet(nameSubstrings) {
    return wonRaces().filter(r => nameSubstrings.some(n => r.name.includes(n))).length;
}

function countDistinctWonFromSet(nameSubstrings) {
    const won = wonRaces();
    return nameSubstrings.filter(n => won.some(r => r.name.includes(n))).length;
}

function isCoreDistance(race) {
    const len = parseInt(race.length);
    return len > 0 && len % 400 === 0;
}

function countWonCoreDistance() {
    return wonRaces().filter(r => isCoreDistance(r)).length;
}

function countWonNonCoreDistance() {
    return wonRaces().filter(r => !isCoreDistance(r)).length;
}

function countWonOpenOrHigher() {
    return wonRaces().filter(r => ['GI', 'GII', 'GIII', 'Open'].includes(r.type)).length;
}

function wonSurfaceDistanceCategories(surface, categories) {
    const won = wonRaces().filter(r => r.surface === surface);
    let count = 0;
    for (const cat of categories) {
        if (won.some(r => distanceCategories[cat]?.(r))) count++;
    }
    return count;
}

function getRacesByNamePattern(pattern) {
    const re = new RegExp(pattern, 'i');
    return new Set(state.races.filter(r => re.test(r.name)).map(r => String(r.id)));
}

function getRacesByNames(nameSubstrings) {
    return new Set(
        state.races
            .filter(r => nameSubstrings.some(n => r.name.includes(n)))
            .map(r => String(r.id))
    );
}

function getRacesBySurface(surface) {
    return new Set(state.races.filter(r => r.surface === surface).map(r => String(r.id)));
}

function getRacesBySurfaceAndGrade(surface, grades) {
    return new Set(
        state.races
            .filter(r => r.surface === surface && grades.includes(r.type))
            .map(r => String(r.id))
    );
}

function getRacesAtTracks(tracks, graded = false) {
    return new Set(
        state.races.filter(r => {
            const trackMatch = tracks.includes(r.racetrack);
            if (!graded) return trackMatch;
            return trackMatch && ['GI', 'GII', 'GIII'].includes(r.type);
        }).map(r => String(r.id))
    );
}

function getRacesCoreDistance() {
    return new Set(state.races.filter(r => isCoreDistance(r)).map(r => String(r.id)));
}

function getRacesNonCoreDistance() {
    return new Set(state.races.filter(r => !isCoreDistance(r)).map(r => String(r.id)));
}

function getRacesOpenOrHigher() {
    return new Set(
        state.races.filter(r => ['GI', 'GII', 'GIII', 'Open'].includes(r.type)).map(r => String(r.id))
    );
}

function getRacesBySurfaceCategories(surface, categories) {
    return new Set(
        state.races
            .filter(r => r.surface === surface && categories.some(cat => distanceCategories[cat]?.(r)))
            .map(r => String(r.id))
    );
}

const GLOBE_TROTTER_RACES = [
    'American JCC', 'Saudi Arabia Royal Cup', 'New Zealand Trophy', 'Japan Cup',
    'Japan Dirt Derby', 'Copa Republica Argentina', 'Brazil Cup'
];

function checkAllWonInSameYear(raceNames) {
    let bestCount = 0;
    let bestYear = null;
    for (const yearKey of ['classics', 'senior']) {
        const cells = state.plannerData[yearKey] || {};
        let count = 0;
        for (const name of raceNames) {
            const found = Object.values(cells).some(rId => {
                if (!rId) return false;
                const r = state.raceById?.get(String(rId));
                return r && r.name.includes(name) && state.wonRaces.has(String(rId));
            });
            if (found) count++;
        }
        if (count > bestCount) { bestCount = count; bestYear = yearKey; }
    }
    return { completed: bestCount >= raceNames.length, bestCount, bestYear };
}

// ── Simple result builder ────────────────────────────────────────────

function result(current, required, details) {
    return {
        completed: current >= required,
        current: Math.min(current, required),
        required,
        progress: Math.min(current, required) / required,
        details: details || null
    };
}

// ── Epithet check cache (for prereqs within same render cycle) ──────

let _checkCache = null;

function getEpithetResult(epithetId) {
    if (!_checkCache) _checkCache = {};
    if (!(epithetId in _checkCache)) {
        const ep = EPITHETS.find(e => e.id === epithetId);
        _checkCache[epithetId] = ep ? ep.check() : result(0, 1);
    }
    return _checkCache[epithetId];
}

export function clearEpithetCache() {
    _checkCache = null;
}

// ── Epithet definitions ──────────────────────────────────────────────

const EPITHETS = [
    // --- Basic progression ---
    {
        id: 'dirty_work',
        name: 'Dirty Work',
        condition: 'Win 5 dirt races',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonBySurface('dirt'), 5),
        getRaces: () => getRacesBySurface('dirt')
    },
    {
        id: 'playing_dirty',
        name: 'Playing Dirty',
        condition: 'Win 10 dirt races',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonBySurface('dirt'), 10),
        getRaces: () => getRacesBySurface('dirt')
    },
    {
        id: 'eat_my_dust',
        name: 'Eat My Dust',
        condition: 'Win 15 dirt races',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonBySurface('dirt'), 15),
        getRaces: () => getRacesBySurface('dirt')
    },
    {
        id: 'dirt_dancer',
        name: 'Dirt Dancer',
        condition: 'Win one dirt Short, Mile, and Medium distance race',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(wonSurfaceDistanceCategories('dirt', ['short', 'mile', 'medium']), 3),
        getRaces: () => getRacesBySurfaceCategories('dirt', ['short', 'mile', 'medium'])
    },
    {
        id: 'turf_tussler',
        name: 'Turf Tussler',
        condition: 'Win one turf Short, Mile, Medium, and Long distance race',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(wonSurfaceDistanceCategories('turf', ['short', 'mile', 'medium', 'long']), 4),
        getRaces: () => getRacesBySurfaceCategories('turf', ['short', 'mile', 'medium', 'long'])
    },

    // --- Dirt G1 tiers ---
    {
        id: 'dirt_g1_achiever',
        name: 'Dirt G1 Achiever',
        condition: 'Win 3 dirt G1 races',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonBySurfaceAndGrade('dirt', ['GI']), 3),
        getRaces: () => getRacesBySurfaceAndGrade('dirt', ['GI'])
    },
    {
        id: 'dirt_g1_star',
        name: 'Dirt G1 Star',
        condition: 'Win 4 dirt G1 races',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonBySurfaceAndGrade('dirt', ['GI']), 4),
        getRaces: () => getRacesBySurfaceAndGrade('dirt', ['GI'])
    },
    {
        id: 'dirt_g1_powerhouse',
        name: 'Dirt G1 Powerhouse',
        condition: 'Win 5 dirt G1 races',
        reward: '2 random stats +15',
        trackable: true,
        check: () => result(countWonBySurfaceAndGrade('dirt', ['GI']), 5),
        getRaces: () => getRacesBySurfaceAndGrade('dirt', ['GI'])
    },
    {
        id: 'dirt_g1_dominator',
        name: 'Dirt G1 Dominator',
        condition: 'Win 9 dirt G1 races',
        reward: 'Top Pick hint +1',
        trackable: true,
        check: () => result(countWonBySurfaceAndGrade('dirt', ['GI']), 9),
        getRaces: () => getRacesBySurfaceAndGrade('dirt', ['GI'])
    },

    // --- Core / Non-core distance ---
    {
        id: 'standard_leader',
        name: 'Standard Leader',
        condition: 'Win 10 core distance races (distance divisible by 400)',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonCoreDistance(), 10),
        getRaces: () => getRacesCoreDistance()
    },
    {
        id: 'non_standard_leader',
        name: 'Non-Standard Leader',
        condition: 'Win 10 non-core distance races (distance not divisible by 400)',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonNonCoreDistance(), 10),
        getRaces: () => getRacesNonCoreDistance()
    },

    // --- Name pattern matching ---
    {
        id: 'junior_jewel',
        name: 'Junior Jewel',
        condition: 'Win 3 races with "Junior Stakes" in the name',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonByNamePattern('Junior Stakes'), 3),
        getRaces: () => getRacesByNamePattern('Junior Stakes')
    },
    {
        id: 'globe_trotter',
        name: 'Globe-Trotter',
        condition: 'Win 3 of: American JCC, Saudi Arabia Royal Cup, New Zealand Trophy, Japan Cup, Japan Dirt Derby, Copa Republica Argentina, Brazil Cup',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonFromSet(GLOBE_TROTTER_RACES), 3),
        getRaces: () => getRacesByNames(GLOBE_TROTTER_RACES)
    },
    {
        id: 'umatastic',
        name: 'Umatastic',
        condition: 'Win 3 races with "Umamusume Stakes" in the name',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonByNamePattern('Umamusume Stakes'), 3),
        getRaces: () => getRacesByNamePattern('Umamusume Stakes')
    },
    {
        id: 'pro_racer',
        name: 'Pro Racer',
        condition: 'Win 10 races of grade Open or higher',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonOpenOrHigher(), 10),
        getRaces: () => getRacesOpenOrHigher()
    },

    // --- Regional ---
    {
        id: 'kokura_constable',
        name: 'Kokura Constable',
        condition: 'Win 2 graded races held in Kokura',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonAtTracks(['Kokura'], true), 2),
        getRaces: () => getRacesAtTracks(['Kokura'], true)
    },
    {
        id: 'west_japan_whiz',
        name: 'West Japan Whiz',
        condition: 'Win 3 graded races held in Chukyo, Hanshin, or Kyoto',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonAtTracks(['Chukyou', 'Hanshin', 'Kyoto'], true), 3),
        getRaces: () => getRacesAtTracks(['Chukyou', 'Hanshin', 'Kyoto'], true)
    },
    {
        id: 'kanto_conqueror',
        name: 'Kanto Conqueror',
        condition: 'Win 3 graded races held in Tokyo, Nakayama, or Ooi',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonAtTracks(['Tokyo', 'Nakayama', 'Ooi'], true), 3),
        getRaces: () => getRacesAtTracks(['Tokyo', 'Nakayama', 'Ooi'], true)
    },
    {
        id: 'tohoku_top_dog',
        name: 'Tohoku Top Dog',
        condition: 'Win 3 graded races held in Fukushima or Niigata',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonAtTracks(['Fukushima', 'Niigata'], true), 3),
        getRaces: () => getRacesAtTracks(['Fukushima', 'Niigata'], true)
    },
    {
        id: 'hokkaido_hotshot',
        name: 'Hokkaido Hotshot',
        condition: 'Win 3 graded races held in Sapporo or Hakodate',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonAtTracks(['Sapporo', 'Hakodate'], true), 3),
        getRaces: () => getRacesAtTracks(['Sapporo', 'Hakodate'], true)
    },

    // --- Specific race combos ---
    {
        id: 'kicking_up_dust',
        name: 'Kicking Up Dust',
        condition: 'Win Unicorn Stakes, Leopard Stakes, and Japan Dirt Derby',
        reward: '2 random stats +5',
        trackable: true,
        check: () => result(countWonFromSet(['Unicorn Stakes', 'Leopard Stakes', 'Japan Dirt Derby']), 3),
        getRaces: () => getRacesByNames(['Unicorn Stakes', 'Leopard Stakes', 'Japan Dirt Derby'])
    },
    {
        id: 'dirt_sprinter',
        name: 'Dirt Sprinter',
        condition: 'Win the JBC Sprint twice (in 2 different years)',
        reward: '2 random stats +10',
        trackable: true,
        check: () => {
            let yearCount = 0;
            for (const yearKey of ['junior', 'classics', 'senior']) {
                const cells = state.plannerData[yearKey] || {};
                for (const key of Object.keys(cells)) {
                    const rId = cells[key];
                    if (!rId) continue;
                    const r = state.raceById?.get(String(rId));
                    if (r && r.name.includes('JBC Sprint') && state.wonRaces.has(String(rId))) yearCount++;
                }
            }
            return result(yearCount, 2);
        },
        getRaces: () => getRacesByNames(['JBC Sprint'])
    },
    {
        id: 'sprint_go_getter',
        name: 'Sprint Go-Getter',
        condition: 'Win Takamatsunomiya Kinen and Sprinters Stakes',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countDistinctWonFromSet(['Takamatsunomiya Kinen', 'Sprinters Stakes']), 2),
        getRaces: () => getRacesByNames(['Takamatsunomiya Kinen', 'Sprinters Stakes'])
    },
    {
        id: 'shield_bearer',
        name: 'Shield Bearer',
        condition: 'Win both Tenno Sho (Spring) and Tenno Sho (Autumn)',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonFromSet(['Tenno Sho (Spring)', 'Tenno Sho (Autumn)']), 2),
        getRaces: () => getRacesByNames(['Tenno Sho (Spring)', 'Tenno Sho (Autumn)'])
    },
    {
        id: 'spring_champion',
        name: 'Spring Champion',
        condition: 'Win Osaka Hai, Tenno Sho (Spring), and Takarazuka Kinen (can be across different years). Note: For Legendary, run all 3 in Senior year.',
        reward: '2 random stats +10',
        trackable: true,
        check: () => {
            const names = ['Osaka Hai', 'Tenno Sho (Spring)', 'Takarazuka Kinen'];
            return result(countWonFromSet(names), 3);
        },
        getRaces: () => getRacesByNames(['Osaka Hai', 'Tenno Sho (Spring)', 'Takarazuka Kinen'])
    },
    {
        id: 'fall_champion',
        name: 'Fall Champion',
        condition: 'Win Tenno Sho (Autumn), Japan Cup, and Arima Kinen. Must complete all in the same year (Classic or Senior).',
        reward: '2 random stats +10',
        trackable: true,
        check: () => {
            const names = ['Tenno Sho (Autumn)', 'Japan Cup', 'Arima Kinen'];
            const r = checkAllWonInSameYear(names);
            return result(r.bestCount, 3, `Best year: ${r.bestYear || '—'} (${r.bestCount}/3)`);
        },
        getRaces: () => getRacesByNames(['Tenno Sho (Autumn)', 'Japan Cup', 'Arima Kinen'])
    },
    {
        id: 'breakneck_miler',
        name: 'Breakneck Miler',
        condition: 'Win NHK Mile Cup, Yasuda Kinen, and Mile Championship',
        reward: '2 random stats +15',
        trackable: true,
        check: () => result(countWonFromSet(['NHK Mile Cup', 'Yasuda Kinen', 'Mile Championship']), 3),
        getRaces: () => getRacesByNames(['NHK Mile Cup', 'Yasuda Kinen', 'Mile Championship'])
    },
    {
        id: 'sprint_speedster',
        name: 'Sprint Speedster',
        condition: 'Win Takamatsunomiya Kinen, Sprinters Stakes, Yasuda Kinen, and Mile Championship',
        reward: '2 random stats +15',
        trackable: true,
        check: () => result(countWonFromSet(['Takamatsunomiya Kinen', 'Sprinters Stakes', 'Yasuda Kinen', 'Mile Championship']), 4),
        getRaces: () => getRacesByNames(['Takamatsunomiya Kinen', 'Sprinters Stakes', 'Yasuda Kinen', 'Mile Championship'])
    },

    // --- Triple Crown / Tiara (base epithets for prereqs) ---
    {
        id: 'stunning',
        name: 'Stunning',
        condition: 'Win the Classic Triple Crown: Satsuki Sho, Tokyo Yushun, and Kikuka Sho',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonFromSet(['Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho']), 3),
        getRaces: () => getRacesByNames(['Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho'])
    },
    {
        id: 'lady',
        name: 'Lady',
        condition: 'Win the Triple Tiara: Oka Sho, Japanese Oaks, and Shuka Sho',
        reward: '2 random stats +10',
        trackable: true,
        check: () => result(countWonFromSet(['Oka Sho', 'Japanese Oaks', 'Shuka Sho']), 3),
        getRaces: () => getRacesByNames(['Oka Sho', 'Japanese Oaks', 'Shuka Sho'])
    },

    // --- Epithets with prerequisites ---
    {
        id: 'heroine',
        name: 'Heroine',
        condition: 'Get the Lady epithet; Win the Queen Elizabeth II Cup',
        reward: '2 random stats +10',
        prereqs: ['lady'],
        trackable: true,
        check: () => {
            const ladyDone = getEpithetResult('lady').completed;
            const qeii = isWon('Queen Elizabeth II Cup');
            const current = (ladyDone ? 1 : 0) + (qeii ? 1 : 0);
            return result(current, 2, `Lady: ${ladyDone ? '✓' : '✗'} | QEII Cup: ${qeii ? '✓' : '✗'}`);
        },
        getRaces: () => {
            const set = getRacesByNames(['Oka Sho', 'Japanese Oaks', 'Shuka Sho', 'Queen Elizabeth II Cup']);
            return set;
        }
    },
    {
        id: 'goddess',
        name: 'Goddess',
        condition: 'Get the Lady epithet; Win Hanshin Juvenile Fillies, Victoria Mile, and QEII Cup in both Classic and Senior year',
        reward: '2 random stats +15',
        prereqs: ['lady'],
        trackable: true,
        check: () => {
            const ladyDone = getEpithetResult('lady').completed;
            const raceWins = countWonFromSet(['Victoria Mile', 'Hanshin Juvenile Fillies', 'Queen Elizabeth II Cup']);
            const current = (ladyDone ? 1 : 0) + raceWins;
            return result(current, 5, `Lady: ${ladyDone ? '✓' : '✗'} | Races: ${raceWins}/4`);
        },
        getRaces: () => getRacesByNames(['Oka Sho', 'Japanese Oaks', 'Shuka Sho', 'Victoria Mile', 'Hanshin Juvenile Fillies', 'Queen Elizabeth II Cup'])
    },
    {
        id: 'incredible',
        name: 'Incredible',
        condition: 'Get the Stunning epithet; Win Japan Cup or Arima Kinen (Classic year)',
        reward: '2 random stats +15',
        prereqs: ['stunning'],
        trackable: true,
        check: () => {
            const stunDone = getEpithetResult('stunning').completed;
            const raceWon = isWon('Japan Cup') || isWon('Arima Kinen');
            const current = (stunDone ? 1 : 0) + (raceWon ? 1 : 0);
            return result(current, 2, `Stunning: ${stunDone ? '✓' : '✗'} | Japan Cup/Arima: ${raceWon ? '✓' : '✗'}`);
        },
        getRaces: () => getRacesByNames(['Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho', 'Japan Cup', 'Arima Kinen'])
    },
    {
        id: 'phenomenal',
        name: 'Phenomenal',
        condition: 'Get Stunning epithet; Win any 2: Tenno Sho (S/A), Takarazuka Kinen, Japan Cup, Osaka Hai, Arima Kinen',
        reward: '2 random stats +15',
        prereqs: ['stunning'],
        trackable: true,
        check: () => {
            const stunDone = getEpithetResult('stunning').completed;
            const raceWins = countWonFromSet([
                'Tenno Sho (Spring)', 'Tenno Sho (Autumn)',
                'Takarazuka Kinen', 'Japan Cup', 'Osaka Hai', 'Arima Kinen'
            ]);
            const racePart = Math.min(raceWins, 2);
            const current = (stunDone ? 1 : 0) + racePart;
            return result(current, 3, `Stunning: ${stunDone ? '✓' : '✗'} | Races: ${racePart}/2`);
        },
        getRaces: () => getRacesByNames([
            'Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho',
            'Tenno Sho (Spring)', 'Tenno Sho (Autumn)',
            'Takarazuka Kinen', 'Japan Cup', 'Osaka Hai', 'Arima Kinen'
        ])
    },
    {
        id: 'mile_a_minute',
        name: 'Mile a Minute',
        condition: 'Win NHK Mile Cup, Oka Sho, Yasuda Kinen, Victoria Mile, Mile Championship, and (Hanshin JF or Asahi Hai)',
        reward: 'Mile Straightaways ○ hint +1',
        trackable: true,
        check: () => {
            const fixed = countWonFromSet(['NHK Mile Cup', 'Oka Sho', 'Yasuda Kinen', 'Victoria Mile', 'Mile Championship']);
            const either = (isWon('Hanshin Juvenile Fillies') || isWon('Asahi Hai Futurity Stakes')) ? 1 : 0;
            return result(fixed + either, 6, `Fixed 5: ${fixed}/5 | HJF/Asahi: ${either ? '✓' : '✗'}`);
        },
        getRaces: () => getRacesByNames(['NHK Mile Cup', 'Oka Sho', 'Yasuda Kinen', 'Victoria Mile', 'Mile Championship', 'Hanshin Juvenile Fillies', 'Asahi Hai Futurity Stakes'])
    },
    {
        id: 'legendary',
        name: 'Legendary',
        condition: 'Get Stunning or Lady epithet; Get Spring Champion and Fall Champion epithets. Note: Spring Champion races (Osaka Hai, Tenno Sho Spring, Takarazuka Kinen) should all be in Senior year.',
        reward: 'Homestretch Haste hint +1',
        prereqs: ['stunning', 'lady', 'spring_champion', 'fall_champion'],
        trackable: true,
        check: () => {
            const stunOrLady = getEpithetResult('stunning').completed || getEpithetResult('lady').completed;
            const spring = getEpithetResult('spring_champion').completed;
            const fall = getEpithetResult('fall_champion').completed;
            const current = (stunOrLady ? 1 : 0) + (spring ? 1 : 0) + (fall ? 1 : 0);
            return result(current, 3,
                `Stunning/Lady: ${stunOrLady ? '✓' : '✗'} | Spring: ${spring ? '✓' : '✗'} | Fall: ${fall ? '✓' : '✗'}`
            );
        },
        getRaces: () => {
            const springFall = ['Osaka Hai', 'Tenno Sho (Spring)', 'Takarazuka Kinen',
                                'Tenno Sho (Autumn)', 'Japan Cup', 'Arima Kinen'];
            const stunningRaces = ['Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho'];
            const ladyRaces = ['Oka Sho', 'Japanese Oaks', 'Shuka Sho'];

            const stunDone = getEpithetResult('stunning').completed;
            const ladyDone = getEpithetResult('lady').completed;

            if (stunDone && !ladyDone) return getRacesByNames([...springFall, ...stunningRaces]);
            if (ladyDone && !stunDone) return getRacesByNames([...springFall, ...ladyRaces]);

            const stunProgress = countWonFromSet(stunningRaces);
            const ladyProgress = countWonFromSet(ladyRaces);

            if (stunProgress > ladyProgress) return getRacesByNames([...springFall, ...stunningRaces]);
            if (ladyProgress > stunProgress) return getRacesByNames([...springFall, ...ladyRaces]);

            return getRacesByNames([...springFall, ...stunningRaces, ...ladyRaces]);
        }
    }
];

// ── Public API ────────────────────────────────────────────────────────

export function loadEpithets() {
    return EPITHETS;
}

export function getEpithetById(id) {
    return EPITHETS.find(e => e.id === id) || null;
}

export function getTrackableEpithets() {
    return EPITHETS.filter(e => e.trackable);
}
