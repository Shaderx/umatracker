// js/data/hidden-factors-en.js
// Builds hidden factor objects for the EN (Global/Trackblazer) version
// from the data-driven window.HIDDEN_FACTORS_EN loaded by hidden-factors-en.js

import { state } from '../core/state.js';
import { getIdsForNames } from '../core/utils.js';
import { isGradeOne } from './race-data.js';

function countWonFromSet(raceIdSet) {
    let won = 0;
    for (const id of raceIdSet) {
        if (state.wonRaces.has(id)) won++;
    }
    return won;
}

function buildCheckForSpecificRaces(raceNames) {
    return () => {
        const ids = getIdsForNames(state.races, raceNames);
        const won = countWonFromSet(ids);
        return {
            completed: won >= raceNames.length,
            current: won,
            required: raceNames.length,
        };
    };
}

function buildGetRacesForSpecificRaces(raceNames) {
    return () => getIdsForNames(state.races, raceNames);
}

function buildCheckForDirtWins(count, g1Only) {
    return () => {
        let won = 0;
        for (const id of state.wonRaces) {
            const race = state.raceById.get(id);
            if (!race) continue;
            if (race.surface !== 'dirt') continue;
            if (g1Only && !isGradeOne(race)) continue;
            won++;
        }
        return { completed: won >= count, current: won, required: count };
    };
}

function buildGetRacesForDirt(g1Only) {
    return () => {
        const result = new Set();
        state.races.forEach(race => {
            if (race.surface !== 'dirt') return;
            if (g1Only && !isGradeOne(race)) return;
            result.add(String(race.id));
        });
        return result;
    };
}

function buildCheckForTrackWins(tracks, count) {
    return () => {
        let won = 0;
        const trackSet = new Set(tracks.map(t => t.toLowerCase()));
        for (const id of state.wonRaces) {
            const race = state.raceById.get(id);
            if (!race) continue;
            const isGraded = race.type && ['GI', 'GII', 'GIII', 'G1', 'G2', 'G3'].includes(race.type.toUpperCase());
            if (!isGraded) continue;
            if (trackSet.has((race.racetrack || '').toLowerCase())) won++;
        }
        return { completed: won >= count, current: won, required: count };
    };
}

function buildGetRacesForTracks(tracks) {
    return () => {
        const result = new Set();
        const trackSet = new Set(tracks.map(t => t.toLowerCase()));
        state.races.forEach(race => {
            const isGraded = race.type && ['GI', 'GII', 'GIII', 'G1', 'G2', 'G3'].includes(race.type.toUpperCase());
            if (!isGraded) return;
            if (trackSet.has((race.racetrack || '').toLowerCase())) {
                result.add(String(race.id));
            }
        });
        return result;
    };
}

/**
 * Load EN hidden factors from window.HIDDEN_FACTORS_EN data.
 * Returns factor objects with the same interface as JP loadHiddenFactors().
 */
export function loadHiddenFactorsEN() {
    const data = (typeof window !== 'undefined' && window.HIDDEN_FACTORS_EN) || [];
    if (!data.length) return [];

    return data.map(f => {
        const factor = {
            id: `en_${f.id}`,
            nameJP: f.nameJP || '',
            nameEN: f.nameEN || '',
            conditionJP: f.conditionJP || '',
            conditionEN: f.conditionEN || '',
            trackable: f.trackable,
        };

        switch (f.checkType) {
            case 'specific_races':
                factor.check = buildCheckForSpecificRaces(f.raceNames);
                factor.getRaces = buildGetRacesForSpecificRaces(f.raceNames);
                break;
            case 'dirt_wins':
                factor.check = buildCheckForDirtWins(f.count, f.g1Only);
                factor.getRaces = buildGetRacesForDirt(f.g1Only);
                break;
            case 'track_wins':
                factor.check = buildCheckForTrackWins(f.tracks, f.count);
                factor.getRaces = buildGetRacesForTracks(f.tracks);
                break;
            default:
                factor.check = () => ({ completed: false, current: 0, required: 1 });
                break;
        }

        return factor;
    });
}
