// js/data/hidden-factors.js
// Defines all hidden factors with their conditions, check functions, and race helpers

import { 
    checkConsecutiveRuns, 
    checkConsecutiveWins, 
    checkImprovesWithRacing, 
    checkNeverGiveUp, 
    checkRebelliousSpirit 
} from '../checks/check-special.js';

import { 
    checkDirectionalAwakening, 
    checkSeasonalAwakening 
} from '../checks/check-awakening.js';

import { 
    checkEasternG1Wins, 
    checkWesternG1Wins, 
    checkDifferentRacecourses, 
    checkAllDistanceG1, 
    checkNewspaperCups, 
    checkSummerSeries, 
    checkNewYearGold, 
    checkStarRaces, 
    checkJewelryRaces, 
    checkDualSurface, 
    checkPerfectCrown, 
    checkPerfectTiara 
} from '../checks/check-race-based.js';

import { 
    getRacesForEasternG1, 
    getRacesForWesternG1, 
    getRacesForNewspaperCups, 
    getRacesForSummerSeries, 
    getRacesForNewYearGold, 
    getRacesForStarRaces, 
    getRacesForJewelryRaces, 
    getRacesForDualSurface, 
    getRacesForPerfectCrown, 
    getRacesForPerfectTiara, 
    getRacesForDirectionalAwakening, 
    getRacesForSeasonalAwakening 
} from '../data/race-helpers.js';
import { state } from '../core/state.js';

/**
 * Loads and returns all hidden factors
 * @returns {Array} Array of hidden factor objects
 */
export function loadHiddenFactors() {
    return [
        {
            id: 'consecutive_run',
            nameJP: '連戦連勝',
            nameEN: 'Consecutive Runs',
            conditionJP: '2戦連続で出走する。',
            conditionEN: 'Race 2 races in a row.',
            trackable: false,
            check: () => checkConsecutiveRuns()
        },
        {
            id: 'champion_east',
            nameJP: '東の雄',
            nameEN: 'Champion of the East',
            conditionJP: '東日本（東京、中山など）のG1レースで7勝以上する。',
            conditionEN: 'Win 7 or more G1 races held at tracks in eastern Japan (e.g., Tokyo, Nakayama).',
            trackable: true,
            check: () => checkEasternG1Wins(),
            getRaces: () => getRacesForEasternG1(state.races, state.easternTracks)
        },
        {
            id: 'champion_west',
            nameJP: '西の雄',
            nameEN: 'Champion of the West',
            conditionJP: '西日本（京都、阪神など）のG1レースで7勝以上する。',
            conditionEN: 'Win 7 or more G1 races held at tracks in western Japan (e.g., Kyoto, Hanshin).',
            trackable: true,
            check: () => checkWesternG1Wins(),
            getRaces: () => getRacesForWesternG1(state.races, state.westernTracks)
        },
        {
            id: 'traveler',
            nameJP: '旅人',
            nameEN: 'Traveler',
            conditionJP: '7種類以上のレース場に出走する（勝利は不問）。',
            conditionEN: 'Compete at 7 or more different racecourses. Winning is not a requirement.',
            trackable: false,
            check: () => checkDifferentRacecourses()
        },
        {
            id: 'all_ranks_conquered',
            nameJP: '全階級制覇',
            nameEN: 'All Ranks Conquered',
            conditionJP: '短距離、マイル、中距離、長距離の各距離で1回以上勝利する。',
            conditionEN: 'Win at least one race in each distance category: Short, Mile, Medium, and Long.',
            trackable: false,
            check: () => checkAllDistanceG1()
        },
        {
            id: 'newspaper_boy',
            nameJP: '新聞屋さん',
            nameEN: 'Newspaper Boy/Girl',
            conditionJP: '指定された4つの「新聞杯」レース（京都新聞杯、神戸新聞杯、中日新聞杯、東京新聞杯）に勝利する。',
            conditionEN: 'Win the four "Shimbun Hai" races: Kyoto, Kobe, Chunichi, and Tokyo Shimbun Hai.',
            trackable: true,
            check: () => checkNewspaperCups(),
            getRaces: () => getRacesForNewspaperCups(state.races)
        },
        {
            id: 'summer_sprint_series',
            nameJP: 'SSS',
            nameEN: 'Summer Sprint Series',
            conditionJP: 'サマースプリントシリーズ対象レースから3勝する。',
            conditionEN: 'Win 3 races from the Summer Sprint Series.',
            trackable: true,
            check: () => checkSummerSeries('sprint'),
            getRaces: () => getRacesForSummerSeries(state.summerSeries, 'sprint', state.races)
        },
        {
            id: 'summer_mile_series',
            nameJP: 'SMS',
            nameEN: 'Summer Mile Series',
            conditionJP: 'サマーマイルシリーズ対象レースから3勝する。',
            conditionEN: 'Win 3 races from the Summer Mile Series.',
            trackable: true,
            check: () => checkSummerSeries('mile'),
            getRaces: () => getRacesForSummerSeries(state.summerSeries, 'mile', state.races)
        },
        {
            id: 'summer_2000_series',
            nameJP: 'S2000',
            nameEN: 'Summer 2000 Series',
            conditionJP: 'サマー2000シリーズ対象レースから3勝する。',
            conditionEN: 'Win 3 races from the Summer 2000 Series.',
            trackable: true,
            check: () => checkSummerSeries('s2000'),
            getRaces: () => getRacesForSummerSeries(state.summerSeries, 's2000', state.races)
        },
        {
            id: 'years_plan',
            nameJP: '一年の計は',
            nameEN: "The Year's Plan",
            conditionJP: 'シニア級1月前半の中山金杯か京都金杯で勝利する。',
            conditionEN: 'During the Senior year, win either the Nakayama Kinen or the Kyoto Kinen in January.',
            trackable: true,
            check: () => checkNewYearGold(),
            getRaces: () => getRacesForNewYearGold(state.races)
        },
        {
            id: 'wish_upon_star',
            nameJP: '星に願いを',
            nameEN: 'Wish Upon a Star',
            conditionJP: '指定された星・星座関連の名前を持つレースの中から3勝以上する。',
            conditionEN: 'Win 3 or more races from the designated list of star or constellation-themed races.',
            trackable: true,
            check: () => checkStarRaces(),
            getRaces: () => getRacesForStarRaces(state.races)
        },
        {
            id: 'jewelry',
            nameJP: 'ジュエリー',
            nameEN: 'Jewelry',
            conditionJP: '指定された宝石の名前を持つレースの中から3勝以上する（同名レースの重複は不可）。',
            conditionEN: 'Win 3 or more races from the designated list of jewelry-themed races.',
            trackable: true,
            check: () => checkJewelryRaces(),
            getRaces: () => getRacesForJewelryRaces(state.races)
        },
        {
            id: 'dual_wielder',
            nameJP: '二刀流',
            nameEN: 'Two-Sword Style / Dual Wielder',
            conditionJP: '芝とダートの両方のバ場適性をAにする。',
            conditionEN: "Achieve an 'A' rank aptitude for both Turf and Dirt surfaces.",
            trackable: true,
            check: () => checkDualSurface(),
            getRaces: () => getRacesForDualSurface(state.races)
        },
        {
            id: 'perfect_crown',
            nameJP: 'パーフェクトクラウン',
            nameEN: 'Perfect Crown',
            conditionJP: '牡馬三冠レース（皐月賞、日本ダービー、菊花賞）と、各レースに対応するトライアルレース3つに勝利する。',
            conditionEN: 'Win the three Triple Crown races (Satsuki Sho, Japan Derby, Kikka Sho) AND win one trial race for each.',
            trackable: true,
            check: () => checkPerfectCrown(),
            getRaces: () => getRacesForPerfectCrown(state.races)
        },
        {
            id: 'perfect_tiara',
            nameJP: 'パーフェクトティアラ',
            nameEN: 'Perfect Tiara',
            conditionJP: '牝馬三冠レース（桜花賞、オークス、秋華賞）と、各レースに対応するトライアルレース3つに勝利する。',
            conditionEN: 'Win the three Triple Tiara races (Oka Sho, Oaks, Akika Sho) AND win one trial race for each.',
            trackable: true,
            check: () => checkPerfectTiara(),
            getRaces: () => getRacesForPerfectTiara(state.races)
        },
        {
            id: 'improves_with_racing',
            nameJP: '叩き良化型',
            nameEN: 'Improves with Racing',
            conditionJP: "3戦以上の連続出走。'悦楽取材'の記者イベント出現が必要（簡略化済み）",
            conditionEN: "Run 3 consecutive races; requires reporter event 'Pleasure Interview' (simplified)",
            trackable: false,
            check: () => checkImprovesWithRacing()
        },
        {
            id: 'never_give_up',
            nameJP: '諦めない心',
            nameEN: 'Never-Give-Up Spirit',
            conditionJP: '一度負けてから勝利する（順序判定は簡略化）。',
            conditionEN: 'Lose a race, then win a race (order simplified).',
            trackable: false,
            check: () => checkNeverGiveUp()
        },
        {
            id: 'right_awakening',
            nameJP: '右の目覚め',
            nameEN: 'Right Awakening',
            conditionJP: '右回りのレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races on right-handed tracks.',
            trackable: true,
            check: () => checkDirectionalAwakening('right'),
            getRaces: () => getRacesForDirectionalAwakening(state.races, 'right')
        },
        {
            id: 'left_awakening',
            nameJP: '左の目覚め',
            nameEN: 'Left Awakening',
            conditionJP: '左回りのレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races on left-handed tracks.',
            trackable: true,
            check: () => checkDirectionalAwakening('left'),
            getRaces: () => getRacesForDirectionalAwakening(state.races, 'left')
        },
        {
            id: 'spring_awakening',
            nameJP: '春の目覚め',
            nameEN: 'Spring Awakening',
            conditionJP: '春の季節のレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races during spring.',
            trackable: true,
            check: () => checkSeasonalAwakening('spring'),
            getRaces: () => getRacesForSeasonalAwakening(state.races, 'spring')
        },
        {
            id: 'summer_awakening',
            nameJP: '夏の目覚め',
            nameEN: 'Summer Awakening',
            conditionJP: '夏の季節のレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races during summer.',
            trackable: true,
            check: () => checkSeasonalAwakening('summer'),
            getRaces: () => getRacesForSeasonalAwakening(state.races, 'summer')
        },
        {
            id: 'autumn_awakening',
            nameJP: '秋の目覚め',
            nameEN: 'Autumn Awakening',
            conditionJP: '秋の季節のレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races during autumn.',
            trackable: true,
            check: () => checkSeasonalAwakening('autumn'),
            getRaces: () => getRacesForSeasonalAwakening(state.races, 'autumn')
        },
        {
            id: 'winter_awakening',
            nameJP: '冬の目覚め',
            nameEN: 'Winter Awakening',
            conditionJP: '冬の季節のレースで6回以上勝利する。',
            conditionEN: 'Win 6 or more races during winter.',
            trackable: true,
            check: () => checkSeasonalAwakening('winter'),
            getRaces: () => getRacesForSeasonalAwakening(state.races, 'winter')
        },
        {
            id: 'rebellious_spirit',
            nameJP: '反骨精神',
            nameEN: 'Rebellious Spirit',
            conditionJP: '適性が低いレースで勝利する（簡略化：任意の勝利でカウント）。',
            conditionEN: 'Win a race with low aptitude (simplified: any win counts).',
            trackable: false,
            check: () => checkRebelliousSpirit()
        }
    ];
}

/**
 * Get a hidden factor by ID
 * @param {string} factorId - Hidden factor ID
 * @param {Array} hiddenFactors - Array of hidden factors (optional, will load if not provided)
 * @returns {Object|null} Hidden factor object or null if not found
 */
export function getHiddenFactorById(factorId, hiddenFactors = null) {
    const factors = hiddenFactors || loadHiddenFactors();
    return factors.find(f => f.id === factorId) || null;
}

/**
 * Get all trackable hidden factors
 * @param {Array} hiddenFactors - Array of hidden factors (optional, will load if not provided)
 * @returns {Array} Array of trackable hidden factors
 */
export function getTrackableFactors(hiddenFactors = null) {
    const factors = hiddenFactors || loadHiddenFactors();
    return factors.filter(f => f.trackable);
}

/**
 * Get all non-trackable hidden factors
 * @param {Array} hiddenFactors - Array of hidden factors (optional, will load if not provided)
 * @returns {Array} Array of non-trackable hidden factors
 */
export function getNonTrackableFactors(hiddenFactors = null) {
    const factors = hiddenFactors || loadHiddenFactors();
    return factors.filter(f => !f.trackable);
}
