/**
 * Race Helper Functions
 * Provides getter functions for race data used by hidden factor checks
 */

import { getIdsForNames } from '../core/utils.js';

/**
 * Get race IDs for Eastern G1 races
 * @param {Array} races - Array of race objects
 * @param {Array} easternTracks - Array of eastern track names
 * @returns {Set} Set of race IDs
 */
export function getRacesForEasternG1(races, easternTracks) {
    const result = new Set();
    races.forEach(race => {
        if (race.type === 'GI' && easternTracks.includes(race.racetrack)) {
            result.add(String(race.id));
        }
    });
    return result;
}

/**
 * Get race IDs for Western G1 races
 * @param {Array} races - Array of race objects
 * @param {Array} westernTracks - Array of western track names
 * @returns {Set} Set of race IDs
 */
export function getRacesForWesternG1(races, westernTracks) {
    const result = new Set();
    races.forEach(race => {
        if (race.type === 'GI' && westernTracks.includes(race.racetrack)) {
            result.add(String(race.id));
        }
    });
    return result;
}

/**
 * Get race IDs for newspaper cup races
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForNewspaperCups(races) {
    const names = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
    return getIdsForNames(races, names);
}

/**
 * Get race IDs for summer series races
 * @param {Object} summerSeries - Summer series configuration object
 * @param {string} seriesKey - Series key ('sprint', 'mile', 's2000')
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForSummerSeries(summerSeries, seriesKey, races) {
    const targetNames = (summerSeries && summerSeries[seriesKey]) ? summerSeries[seriesKey] : [];
    return getIdsForNames(races, targetNames);
}

/**
 * Get race IDs for New Year Gold races (Senior January 1st half)
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForNewYearGold(races) {
    const result = new Set();
    const targets = new Set(['Nakayama Kinen', 'Kyoto Kinen']);
    races.forEach(race => {
        if (targets.has(race.name) && race.senior && race.month === 'January' && race.half === '1st') {
            result.add(String(race.id));
        }
    });
    return result;
}

/**
 * Get race IDs for star-themed races
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForStarRaces(races) {
    const names = [
        'Procyon Stakes', 'Capella Stakes', 'Centaur Stakes', 'Aldebaran Stakes',
        'Rigel Stakes', 'Betelgeuse Stakes', 'Cassiopeia Stakes', 'Sirius Stakes'
    ];
    return getIdsForNames(races, names);
}

/**
 * Get race IDs for jewelry-themed races
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForJewelryRaces(races) {
    const names = ['Diamond Stakes', 'Turquoise Stakes', 'Opal Stakes'];
    return getIdsForNames(races, names);
}

/**
 * Get race IDs for dual surface races (turf or dirt)
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForDualSurface(races) {
    const result = new Set();
    races.forEach(race => {
        if (race.surface === 'turf' || race.surface === 'dirt') {
            result.add(String(race.id));
        }
    });
    return result;
}

/**
 * Get race IDs for Perfect Crown races (Triple Crown + trial races)
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForPerfectCrown(races) {
    const triple = ['Satsuki Sho', 'Japan Derby', 'Kikka Sho'];
    const groupA = ['Yayoi Sho', 'Spring Stakes', 'Wakaba Stakes'];
    const groupB = ['Aoba Sho', 'Principal Stakes'];
    const groupC = ['Kobe Shimbun Hai', 'Saint Lite Kinen'];
    const allNames = [...triple, ...groupA, ...groupB, ...groupC];
    return getIdsForNames(races, allNames);
}

/**
 * Get race IDs for Perfect Tiara races (Triple Tiara + trial races)
 * @param {Array} races - Array of race objects
 * @returns {Set} Set of race IDs
 */
export function getRacesForPerfectTiara(races) {
    const triple = ['Oka Sho', 'Oaks', 'Akika Sho'];
    const groupA = ['Fillies Review', 'Tulip Sho', 'Anemone Stakes'];
    const groupB = ['Flora Stakes', 'Sweet Pea Stakes'];
    const groupC = ['Rose Stakes', 'Shion Stakes'];
    const allNames = [...triple, ...groupA, ...groupB, ...groupC];
    return getIdsForNames(races, allNames);
}

/**
 * Get race IDs for directional awakening races
 * @param {Array} races - Array of race objects
 * @param {string} direction - Direction ('right' or 'left')
 * @returns {Set} Set of race IDs
 */
export function getRacesForDirectionalAwakening(races, direction) {
    const result = new Set();
    races.forEach(race => {
        if (race.direction === direction) {
            result.add(String(race.id));
        }
    });
    return result;
}

/**
 * Get race IDs for seasonal awakening races
 * @param {Array} races - Array of race objects
 * @param {string} season - Season ('spring', 'summer', 'autumn', 'winter')
 * @returns {Set} Set of race IDs
 */
export function getRacesForSeasonalAwakening(races, season) {
    const result = new Set();
    races.forEach(race => {
        if (race.season === season) {
            result.add(String(race.id));
        }
    });
    return result;
}
