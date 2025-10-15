/**
 * Race-Based Check Modules
 * Checks for hidden factors based on race wins and participation
 */

import { state } from '../core/state.js';
import { isGradeOne } from '../data/race-data.js';

/**
 * Check Eastern G1 wins (東の雄)
 * Requires 7+ G1 wins at eastern Japan tracks
 * @returns {Object} Check result with completion status
 */
export function checkEasternG1Wins() {
    const eastern = Array.from(state.wonRaces)
        .map(id => state.raceById.get(String(id)))
        .filter(race => race && isGradeOne(race) && state.easternTracks.includes(race.racetrack))
        .map(r => r.name);
    
    return {
        completed: eastern.length >= 7,
        current: eastern.length,
        required: 7,
        progress: (eastern.length / 7) * 100,
        details: `Eastern G1 wins: ${eastern.join(', ')}`
    };
}

/**
 * Check Western G1 wins (西の雄)
 * Requires 7+ G1 wins at western Japan tracks
 * @returns {Object} Check result with completion status
 */
export function checkWesternG1Wins() {
    const western = Array.from(state.wonRaces)
        .map(id => state.raceById.get(String(id)))
        .filter(race => race && isGradeOne(race) && state.westernTracks.includes(race.racetrack))
        .map(r => r.name);
    
    return {
        completed: western.length >= 7,
        current: western.length,
        required: 7,
        progress: (western.length / 7) * 100,
        details: `Western G1 wins: ${western.join(', ')}`
    };
}

/**
 * Check different racecourses (旅人)
 * Requires participation at 7+ different racecourses
 * @returns {Object} Check result with completion status
 */
export function checkDifferentRacecourses() {
    const racecourses = new Set();
    state.selectedRaces.forEach(id => {
        const race = state.raceById.get(String(id));
        if (race) racecourses.add(race.racetrack);
    });
    
    return {
        completed: racecourses.size >= 7,
        current: racecourses.size,
        required: 7,
        progress: (racecourses.size / 7) * 100,
        details: `Racecourses: ${Array.from(racecourses).join(', ')}`
    };
}

/**
 * Check all distance categories (全階級制覇)
 * Requires wins in all 4 distance categories
 * @returns {Object} Check result with completion status
 */
export function checkAllDistanceG1() {
    const distanceWins = { short: false, mile: false, medium: false, long: false };
    
    Array.from(state.wonRaces).forEach(id => {
        const race = state.raceById.get(String(id));
        if (!race) return;
        
        Object.keys(distanceWins).forEach(category => {
            if (state.distanceCategories[category](race)) {
                distanceWins[category] = true;
            }
        });
    });
    
    const completed = Object.values(distanceWins).every(won => won);
    const current = Object.values(distanceWins).filter(won => won).length;
    
    return {
        completed,
        current,
        required: 4,
        progress: (current / 4) * 100,
        details: `Categories won: ${Object.entries(distanceWins).filter(([k,v]) => v).map(([k,v]) => k).join(', ')}`
    };
}

/**
 * Check newspaper cups (新聞屋さん)
 * Requires wins in 4 newspaper cup races
 * @returns {Object} Check result with completion status
 */
export function checkNewspaperCups() {
    const names = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
    const wonNames = names.filter(n => {
        const ids = state.raceIdsByName.get(n);
        if (!ids) return false;
        for (const id of ids) if (state.wonRaces.has(String(id))) return true;
        return false;
    });
    
    return {
        completed: wonNames.length >= 4,
        current: wonNames.length,
        required: 4,
        progress: (wonNames.length / 4) * 100,
        details: `Won: ${wonNames.join(', ')}`
    };
}

/**
 * Check summer series (SSS, SMS, S2000)
 * Requires 3+ wins in specified summer series
 * @param {string} seriesKey - 'sprint', 'mile', or 's2000'
 * @returns {Object} Check result with completion status
 */
export function checkSummerSeries(seriesKey) {
    const targetNames = (state.summerSeries && state.summerSeries[seriesKey]) ? state.summerSeries[seriesKey] : [];
    const wonNames = targetNames.filter(n => {
        const ids = state.raceIdsByName.get(n);
        if (!ids) return false;
        for (const id of ids) if (state.wonRaces.has(String(id))) return true;
        return false;
    });
    
    return {
        completed: wonNames.length >= 3,
        current: wonNames.length,
        required: 3,
        progress: Math.min(100, (wonNames.length / 3) * 100),
        details: `Won: ${wonNames.join(', ')}`
    };
}

/**
 * Check New Year gold races (一年の計は)
 * Requires win in Nakayama Kinen or Kyoto Kinen (Senior, January 1st half)
 * @returns {Object} Check result with completion status
 */
export function checkNewYearGold() {
    const targets = new Set(['Nakayama Kinen', 'Kyoto Kinen']);
    const qualified = [];
    
    state.wonRaces.forEach(id => {
        const race = state.raceById.get(String(id));
        if (!race) return;
        if (!targets.has(race.name)) return;
        if (race.senior && race.month === 'January' && race.half === '1st') {
            qualified.push(race.name);
        }
    });
    
    const unique = Array.from(new Set(qualified));
    
    return {
        completed: unique.length >= 1,
        current: unique.length,
        required: 1,
        progress: unique.length >= 1 ? 100 : 0,
        details: `Qualified wins: ${unique.join(', ')}`
    };
}

/**
 * Check star-themed races (星に願いを)
 * Requires 3+ wins in star-named races
 * @returns {Object} Check result with completion status
 */
export function checkStarRaces() {
    const names = [
        'Procyon Stakes', 'Capella Stakes', 'Centaur Stakes', 'Aldebaran Stakes',
        'Rigel Stakes', 'Betelgeuse Stakes', 'Cassiopeia Stakes', 'Sirius Stakes'
    ];
    const wonNames = names.filter(n => {
        const ids = state.raceIdsByName.get(n);
        if (!ids) return false;
        for (const id of ids) if (state.wonRaces.has(String(id))) return true;
        return false;
    });
    
    return {
        completed: wonNames.length >= 3,
        current: wonNames.length,
        required: 3,
        progress: (wonNames.length / 3) * 100,
        details: `Won: ${wonNames.join(', ')}`
    };
}

/**
 * Check jewelry-themed races (ジュエリー)
 * Requires 3+ wins in jewelry-named races
 * @returns {Object} Check result with completion status
 */
export function checkJewelryRaces() {
    const names = ['Diamond Stakes', 'Turquoise Stakes', 'Opal Stakes'];
    const wonNames = names.filter(n => {
        const ids = state.raceIdsByName.get(n);
        if (!ids) return false;
        for (const id of ids) if (state.wonRaces.has(String(id))) return true;
        return false;
    });
    
    return {
        completed: wonNames.length >= 3,
        current: wonNames.length,
        required: 3,
        progress: Math.min(100, (wonNames.length / 3) * 100),
        details: `Won: ${wonNames.join(', ')}`
    };
}

/**
 * Check dual surface (二刀流)
 * Requires wins on both turf and dirt
 * @returns {Object} Check result with completion status
 */
export function checkDualSurface() {
    let turfWins = false;
    let dirtWins = false;
    
    state.wonRaces.forEach(id => {
        const race = state.raceById.get(String(id));
        if (!race) return;
        if (race.surface === 'turf') turfWins = true;
        if (race.surface === 'dirt') dirtWins = true;
    });
    
    const current = (turfWins ? 1 : 0) + (dirtWins ? 1 : 0);
    
    return {
        completed: turfWins && dirtWins,
        current,
        required: 2,
        progress: (current / 2) * 100,
        details: `Surfaces: ${turfWins ? 'Turf' : ''} ${dirtWins ? 'Dirt' : ''}`.trim()
    };
}

/**
 * Check Perfect Crown (パーフェクトクラウン)
 * Requires Triple Crown + one race from each trial group
 * @returns {Object} Check result with completion status
 */
export function checkPerfectCrown() {
    const triple = ['Satsuki Sho', 'Japan Derby', 'Kikka Sho'];
    const groupA = ['Yayoi Sho', 'Spring Stakes', 'Wakaba Stakes'];
    const groupB = ['Aoba Sho', 'Principal Stakes'];
    const groupC = ['Kobe Shimbun Hai', 'Saint Lite Kinen'];
    
    const wonNamesSet = new Set(
        Array.from(state.wonRaces)
            .map(id => state.raceById.get(String(id)))
            .filter(Boolean)
            .map(r => r.name)
    );
    
    const wonCrown = triple.filter(n => wonNamesSet.has(n));
    const groupAHit = groupA.some(n => wonNamesSet.has(n));
    const groupBHit = groupB.some(n => wonNamesSet.has(n));
    const groupCHit = groupC.some(n => wonNamesSet.has(n));
    
    const crownComplete = wonCrown.length === 3;
    const trialsComplete = groupAHit && groupBHit && groupCHit;
    const completed = crownComplete && trialsComplete;
    
    const wonTrialsList = [
        ...groupA.filter(n => wonNamesSet.has(n)),
        ...groupB.filter(n => wonNamesSet.has(n)),
        ...groupC.filter(n => wonNamesSet.has(n))
    ];
    
    return {
        completed,
        current: wonCrown.length + wonTrialsList.length,
        required: 6,
        progress: completed ? 100 : ((wonCrown.length + wonTrialsList.length) / 6) * 100,
        details: `Crown: ${wonCrown.join(', ')} | Trials A:${groupA.filter(n => wonNamesSet.has(n)).join('/')} B:${groupB.filter(n => wonNamesSet.has(n)).join('/')} C:${groupC.filter(n => wonNamesSet.has(n)).join('/')}`
    };
}

/**
 * Check Perfect Tiara (パーフェクトティアラ)
 * Requires Triple Tiara + one race from each trial group
 * @returns {Object} Check result with completion status
 */
export function checkPerfectTiara() {
    const triple = ['Oka Sho', 'Oaks', 'Akika Sho'];
    const groupA = ['Fillies Review', 'Tulip Sho', 'Anemone Stakes'];
    const groupB = ['Flora Stakes', 'Sweet Pea Stakes'];
    const groupC = ['Rose Stakes', 'Shion Stakes'];
    
    const wonNamesSet = new Set(
        Array.from(state.wonRaces)
            .map(id => state.raceById.get(String(id)))
            .filter(Boolean)
            .map(r => r.name)
    );
    
    const wonTiara = triple.filter(n => wonNamesSet.has(n));
    const groupAHit = groupA.some(n => wonNamesSet.has(n));
    const groupBHit = groupB.some(n => wonNamesSet.has(n));
    const groupCHit = groupC.some(n => wonNamesSet.has(n));
    
    const tiaraComplete = wonTiara.length === 3;
    const trialsComplete = groupAHit && groupBHit && groupCHit;
    const completed = tiaraComplete && trialsComplete;
    
    const wonTrialsList = [
        ...groupA.filter(n => wonNamesSet.has(n)),
        ...groupB.filter(n => wonNamesSet.has(n)),
        ...groupC.filter(n => wonNamesSet.has(n))
    ];
    
    return {
        completed,
        current: wonTiara.length + wonTrialsList.length,
        required: 6,
        progress: completed ? 100 : ((wonTiara.length + wonTrialsList.length) / 6) * 100,
        details: `Tiara: ${wonTiara.join(', ')} | Trials A:${groupA.filter(n => wonNamesSet.has(n)).join('/')} B:${groupB.filter(n => wonNamesSet.has(n)).join('/')} C:${groupC.filter(n => wonNamesSet.has(n)).join('/')}`
    };
}
