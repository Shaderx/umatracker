// Discord contact function
function contactOnDiscord() {
    navigator.clipboard.writeText('crazyfellow').then(() => {
        // Show feedback
        const btn = document.querySelector('.discord-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg class="discord-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg><span class="discord-text">✓ You have copied the name, add him on Discord<br><span style="font-size: 0.8em; opacity: 0.8;">✓ 名前をコピーしました！Discordで追加してください</span></span>`;

        // Reset after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Show error feedback
        const btn = document.querySelector('.discord-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg class="discord-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg><span class="discord-text">✗ Failed to copy username<br><span style="font-size: 0.8em; opacity: 0.8;">✗ ユーザー名のコピーに失敗しました</span></span>`;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 3000);
    });
}

// Race data and hidden factors
class UmaMusumeTracker {
    constructor() {
        this.races = [];
        this.hiddenFactors = [];
        this.selectedRaces = new Set();
        this.wonRaces = new Set();
        this.lostRaces = new Set();
        this.currentFilters = new Set(); // Multiple filters now
		// Planner state (game-like UI)
		this.plannerYear = 'junior'; // 'junior' | 'classics' | 'senior'
		this.monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		this.halfOrder = ['1st','2nd'];
		this.plannerData = this.createEmptyPlannerData();
        // Modal toggle state
        this.closeOnSelection = true;
        // Hidden factor tracking state
        this.trackedFactorId = null;
        
        // Storage system state
        this.currentSaveSlot = null;
        this.currentDeleteSlot = null;
        
        this.initializeData();
        this.setupEventListeners();
        this.renderRaces();
		this.renderPlannerGrid();
        this.updateProgress();
        // Sync progress panel height with planner after initial render
        setTimeout(() => this.syncProgressHeightToPlanner(), 0);
    }

    initializeData() {
        // Distance categories (in meters)
        this.distanceCategories = {
            short: race => parseInt(race.length.replace(/[^\d]/g, '')) <= 1400,
            mile: race => {
                const length = parseInt(race.length.replace(/[^\d]/g, ''));
                return length >= 1401 && length <= 1800;
            },
            medium: race => {
                const length = parseInt(race.length.replace(/[^\d]/g, ''));
                return length >= 1801 && length <= 2400;
            },
            long: race => parseInt(race.length.replace(/[^\d]/g, '')) >= 2401
        };

        // Eastern Japan tracks
        this.easternTracks = ['Tokyo', 'Nakayama (Chiba)', 'Niigata', 'Fukushima', 'Kawasaki', 'Ooi', 'Funabashi', 'Morioka'];
        
        // Western Japan tracks  
        this.westernTracks = ['Kyoto', 'Hanshin (Takarazuka)', 'Chukyou (Nagoya)', 'Kokura (Kitakyushu)', 'Sapporo', 'Hakodate'];

        // JRA Summer Series groupings (dataset-aligned names)
        this.summerSeries = {
            sprint: [
                'Hakodate Sprint Stakes',
                'CBC Sho',
                'Ibis Summer Dash',
                'Keeneland Cup',
                'Kitakyushu Kinen',
                'Centaur Stakes'
            ],
            mile: [
                // Official series includes Epsom Cup (1800m) alongside mile-targeted handicaps
                'Epsom Cup',
                'Chukyo Kinen',
                'Sekiya Kinen'
            ],
            s2000: [
                'Hakodate Kinen',
                'Tanabata Sho',
                'Kokura Kinen',
                'Sapporo Kinen',
                'Niigata Kinen'
            ]
        };

        // Translation maps
        this.translations = {
            tracks: {
                'Tokyo': '東京',
                'Nakayama (Chiba)': '中山',
                'Kyoto': '京都',
                'Hanshin (Takarazuka)': '阪神',
                'Chukyou (Nagoya)': '中京',
                'Kokura (Kitakyushu)': '小倉',
                'Sapporo': '札幌',
                'Hakodate': '函館',
                'Niigata': '新潟',
                'Fukushima': '福島',
                'Kawasaki': '川崎',
                'Ooi': '大井',
                'Funabashi': '船橋',
                'Morioka': '盛岡'
            },
            surfaces: {
                'turf': '芝',
                'dirt': 'ダート'
            },
            months: {
                'January': '1月',
                'February': '2月',
                'March': '3月',
                'April': '4月',
                'May': '5月',
                'June': '6月',
                'July': '7月',
                'August': '8月',
                'September': '9月',
                'October': '10月',
                'November': '11月',
                'December': '12月'
            },
            halves: {
                '1st': '前半',
                '2nd': '後半'
            },
            directions: {
                'right': '右回り',
                'left': '左回り'
            },
            seasons: {
                'spring': '春',
                'summer': '夏',
                'autumn': '秋',
                'winter': '冬'
            },
            types: {
                'Classic': 'クラシック級',
                'Senior': 'シニア級', 
                'Junior': 'ジュニア級'
            }
        };

        // Load race data
        this.loadRaceData();
        
        // Load hidden factors
        this.loadHiddenFactors();
    }

    loadRaceData() {
        // Prefer prebuilt dataset if available (generated by generate_races_js.py)
        if (typeof window !== 'undefined' && window.RACES && Array.isArray(window.RACES)) {
            this.races = window.RACES;
            // Update data source indicator
            const ind = document.getElementById('data-source-indicator');
            if (ind) {
                const meta = (typeof window !== 'undefined' && window.RACES_META) ? window.RACES_META : null;
                const dateText = meta && meta.generatedAt ? new Date(meta.generatedAt).toLocaleString() : 'unknown time';
                const countText = meta && meta.count != null ? ` (${meta.count} races)` : '';
                ind.textContent = `Data source: races.js — generated ${dateText}${countText}`;
            }
            this.buildRaceMaps();
            return;
        }
        // No races.js found - initialize empty
        this.races = [];
        this.buildRaceMaps();
        const ind = document.getElementById('data-source-indicator');
        if (ind) {
            ind.textContent = 'No race data loaded. Please ensure races.js is available.';
        }
    }

    buildRaceMaps() {
        this.raceById = new Map(this.races.map(r => [String(r.id), r]));
        // Build a mapping from English race name -> Set of IDs (handles duplicates across years)
        this.raceIdsByName = new Map();
        this.races.forEach(race => {
            const id = String(race.id);
            const name = race.name || '';
            if (!name) return;
            if (!this.raceIdsByName.has(name)) this.raceIdsByName.set(name, new Set());
            this.raceIdsByName.get(name).add(id);
        });
    }

    // Normalize grade-one detection across possible encodings (GI, G1)
    isGradeOne(race) {
        if (!race || !race.type) return false;
        const t = String(race.type).toUpperCase().replace(/\s+/g, '');
        return t === 'GI' || t === 'G1';
    }

    loadHiddenFactors() {
        this.hiddenFactors = [
            {
                id: 'consecutive_run',
                nameJP: '連戦連勝',
                nameEN: 'Consecutive Runs',
                conditionJP: '2戦連続で出走する。',
                conditionEN: 'Race 2 races in a row.',
                trackable: false,
                check: () => this.checkConsecutiveRuns()
            },
            {
                id: 'champion_east',
                nameJP: '東の雄',
                nameEN: 'Champion of the East',
                conditionJP: '東日本（東京、中山など）のG1レースで7勝以上する。',
                conditionEN: 'Win 7 or more G1 races held at tracks in eastern Japan (e.g., Tokyo, Nakayama).',
                trackable: true,
                check: () => this.checkEasternG1Wins(),
                getRaces: () => this.getRacesForEasternG1()
            },
            {
                id: 'champion_west',
                nameJP: '西の雄',
                nameEN: 'Champion of the West',
                conditionJP: '西日本（京都、阪神など）のG1レースで7勝以上する。',
                conditionEN: 'Win 7 or more G1 races held at tracks in western Japan (e.g., Kyoto, Hanshin).',
                trackable: true,
                check: () => this.checkWesternG1Wins(),
                getRaces: () => this.getRacesForWesternG1()
            },
            {
                id: 'traveler',
                nameJP: '旅人',
                nameEN: 'Traveler',
                conditionJP: '7種類以上のレース場に出走する（勝利は不問）。',
                conditionEN: 'Compete at 7 or more different racecourses. Winning is not a requirement.',
                trackable: false,
                check: () => this.checkDifferentRacecourses()
            },
            {
                id: 'all_ranks_conquered',
                nameJP: '全階級制覇',
                nameEN: 'All Ranks Conquered',
                conditionJP: '短距離、マイル、中距離、長距離の各距離で1回以上勝利する。',
                conditionEN: 'Win at least one race in each distance category: Short, Mile, Medium, and Long.',
                trackable: false,
                check: () => this.checkAllDistanceG1()
            },
            {
                id: 'newspaper_boy',
                nameJP: '新聞屋さん',
                nameEN: 'Newspaper Boy/Girl',
                conditionJP: '指定された4つの「新聞杯」レース（京都新聞杯、神戸新聞杯、中日新聞杯、東京新聞杯）に勝利する。',
                conditionEN: 'Win the four "Shimbun Hai" races: Kyoto, Kobe, Chunichi, and Tokyo Shimbun Hai.',
                trackable: true,
                check: () => this.checkNewspaperCups(),
                getRaces: () => this.getRacesForNewspaperCups()
            },
            {
                id: 'summer_sprint_series',
                nameJP: 'SSS',
                nameEN: 'Summer Sprint Series',
                conditionJP: 'サマースプリントシリーズ対象レースから3勝する。',
                conditionEN: 'Win 3 races from the Summer Sprint Series.',
                trackable: true,
                check: () => this.checkSummerSeries('sprint'),
                getRaces: () => this.getRacesForSummerSeries('sprint')
            },
            {
                id: 'summer_mile_series',
                nameJP: 'SMS',
                nameEN: 'Summer Mile Series',
                conditionJP: 'サマーマイルシリーズ対象レースから3勝する。',
                conditionEN: 'Win 3 races from the Summer Mile Series.',
                trackable: true,
                check: () => this.checkSummerSeries('mile'),
                getRaces: () => this.getRacesForSummerSeries('mile')
            },
            {
                id: 'summer_2000_series',
                nameJP: 'S2000',
                nameEN: 'Summer 2000 Series',
                conditionJP: 'サマー2000シリーズ対象レースから3勝する。',
                conditionEN: 'Win 3 races from the Summer 2000 Series.',
                trackable: true,
                check: () => this.checkSummerSeries('s2000'),
                getRaces: () => this.getRacesForSummerSeries('s2000')
            },
            {
                id: 'years_plan',
                nameJP: '一年の計は',
                nameEN: "The Year's Plan",
                conditionJP: 'シニア級1月前半の中山金杯か京都金杯で勝利する。',
                conditionEN: 'During the Senior year, win either the Nakayama Kinen or the Kyoto Kinen in January.',
                trackable: true,
                check: () => this.checkNewYearGold(),
                getRaces: () => this.getRacesForNewYearGold()
            },
            {
                id: 'wish_upon_star',
                nameJP: '星に願いを',
                nameEN: 'Wish Upon a Star',
                conditionJP: '指定された星・星座関連の名前を持つレースの中から3勝以上する。',
                conditionEN: 'Win 3 or more races from the designated list of star or constellation-themed races.',
                trackable: true,
                check: () => this.checkStarRaces(),
                getRaces: () => this.getRacesForStarRaces()
            },
            {
                id: 'jewelry',
                nameJP: 'ジュエリー',
                nameEN: 'Jewelry',
                conditionJP: '指定された宝石の名前を持つレースの中から3勝以上する（同名レースの重複は不可）。',
                conditionEN: 'Win 3 or more races from the designated list of jewelry-themed races.',
                trackable: true,
                check: () => this.checkJewelryRaces(),
                getRaces: () => this.getRacesForJewelryRaces()
            },
            {
                id: 'dual_wielder',
                nameJP: '二刀流',
                nameEN: 'Two-Sword Style / Dual Wielder',
                conditionJP: '芝とダートの両方のバ場適性をAにする。',
                conditionEN: "Achieve an 'A' rank aptitude for both Turf and Dirt surfaces.",
                trackable: true,
                check: () => this.checkDualSurface(),
                getRaces: () => this.getRacesForDualSurface()
            },
            {
                id: 'perfect_crown',
                nameJP: 'パーフェクトクラウン',
                nameEN: 'Perfect Crown',
                conditionJP: '牡馬三冠レース（皐月賞、日本ダービー、菊花賞）と、各レースに対応するトライアルレース3つに勝利する。',
                conditionEN: 'Win the three Triple Crown races (Satsuki Sho, Japan Derby, Kikka Sho) AND win one trial race for each.',
                trackable: true,
                check: () => this.checkPerfectCrown(),
                getRaces: () => this.getRacesForPerfectCrown()
            },
            {
                id: 'perfect_tiara',
                nameJP: 'パーフェクトティアラ',
                nameEN: 'Perfect Tiara',
                conditionJP: '牝馬三冠レース（桜花賞、オークス、秋華賞）と、各レースに対応するトライアルレース3つに勝利する。',
                conditionEN: 'Win the three Triple Tiara races (Oka Sho, Oaks, Akika Sho) AND win one trial race for each.',
                trackable: true,
                check: () => this.checkPerfectTiara(),
                getRaces: () => this.getRacesForPerfectTiara()
            },
            {
                id: 'improves_with_racing',
                nameJP: '叩き良化型',
                nameEN: 'Improves with Racing',
                conditionJP: "3戦以上の連続出走。'悦楽取材'の記者イベント出現が必要（簡略化済み）",
                conditionEN: "Run 3 consecutive races; requires reporter event 'Pleasure Interview' (simplified)",
                trackable: false,
                check: () => this.checkImprovesWithRacing()
            },
            {
                id: 'never_give_up',
                nameJP: '諦めない心',
                nameEN: 'Never-Give-Up Spirit',
                conditionJP: '一度負けてから勝利する（順序判定は簡略化）。',
                conditionEN: 'Lose a race, then win a race (order simplified).',
                trackable: false,
                check: () => this.checkNeverGiveUp()
            },
            {
                id: 'right_awakening',
                nameJP: '右の目覚め',
                nameEN: 'Right Awakening',
                conditionJP: '右回りのレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races on right-handed tracks.',
                trackable: true,
                check: () => this.checkDirectionalAwakening('right'),
                getRaces: () => this.getRacesForDirectionalAwakening('right')
            },
            {
                id: 'left_awakening',
                nameJP: '左の目覚め',
                nameEN: 'Left Awakening',
                conditionJP: '左回りのレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races on left-handed tracks.',
                trackable: true,
                check: () => this.checkDirectionalAwakening('left'),
                getRaces: () => this.getRacesForDirectionalAwakening('left')
            },
            {
                id: 'spring_awakening',
                nameJP: '春の目覚め',
                nameEN: 'Spring Awakening',
                conditionJP: '春の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during spring.',
                trackable: true,
                check: () => this.checkSeasonalAwakening('spring'),
                getRaces: () => this.getRacesForSeasonalAwakening('spring')
            },
            {
                id: 'summer_awakening',
                nameJP: '夏の目覚め',
                nameEN: 'Summer Awakening',
                conditionJP: '夏の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during summer.',
                trackable: true,
                check: () => this.checkSeasonalAwakening('summer'),
                getRaces: () => this.getRacesForSeasonalAwakening('summer')
            },
            {
                id: 'autumn_awakening',
                nameJP: '秋の目覚め',
                nameEN: 'Autumn Awakening',
                conditionJP: '秋の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during autumn.',
                trackable: true,
                check: () => this.checkSeasonalAwakening('autumn'),
                getRaces: () => this.getRacesForSeasonalAwakening('autumn')
            },
            {
                id: 'winter_awakening',
                nameJP: '冬の目覚め',
                nameEN: 'Winter Awakening',
                conditionJP: '冬の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during winter.',
                trackable: true,
                check: () => this.checkSeasonalAwakening('winter'),
                getRaces: () => this.getRacesForSeasonalAwakening('winter')
            }
        ];
    }

    setupEventListeners() {
        // Define filter groups
        const filterGroups = {
            grade: ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'], // OR logic
            surface: ['turf', 'dirt'], // Exclusive
            distance: ['short', 'mile', 'medium', 'long'], // Exclusive
            year: ['junior', 'classic', 'senior'], // Exclusive
            summer: ['SSS', 'SMS', 'S2000'], // Exclusive, clears all others
            other: ['selected', 'tracked']
        };
        
        // Filter buttons (only buttons with data-filter attribute)
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Special handling for 'all' - clear all filters
                if (filter === 'all') {
                    this.currentFilters.clear();
                    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
                        b.classList.remove('active');
                        b.classList.remove('summer-active');
                    });
                    e.target.classList.add('active');
                    this.renderRaces();
                    this.renderPlannerGrid();
                    return;
                }
                
                // Remove 'all' button active state when selecting specific filters
                document.querySelector('.filter-btn[data-filter="all"]')?.classList.remove('active');
                
                // Find which group this filter belongs to
                let filterGroup = null;
                for (const [groupName, filters] of Object.entries(filterGroups)) {
                    if (filters.includes(filter)) {
                        filterGroup = groupName;
                        break;
                    }
                }
                
                // Handle summer series filters - they clear everything else
                if (filterGroup === 'summer') {
                    // Clear all filters except summer ones
                    this.currentFilters.clear();
                    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
                        if (!filterGroups.summer.includes(b.dataset.filter) && b.dataset.filter !== 'all') {
                            b.classList.remove('active');
                        }
                        b.classList.remove('summer-active');
                    });
                    
                    // Toggle this summer filter
                    if (this.currentFilters.has(filter)) {
                        this.currentFilters.delete(filter);
                        e.target.classList.remove('active');
                        e.target.classList.remove('summer-active');
                    } else {
                        // Clear other summer filters (exclusive within summer group)
                        filterGroups.summer.forEach(f => {
                            this.currentFilters.delete(f);
                            const btn = document.querySelector(`.filter-btn[data-filter="${f}"]`);
                            if (btn) {
                                btn.classList.remove('active');
                                btn.classList.remove('summer-active');
                            }
                        });
                        this.currentFilters.add(filter);
                        e.target.classList.add('active');
                        e.target.classList.add('summer-active');
                    }
                }
                // Handle exclusive groups (surface, distance, year)
                else if (filterGroup === 'surface' || filterGroup === 'distance' || filterGroup === 'year') {
                    const groupFilters = filterGroups[filterGroup];
                    
                    // If clicking the same filter, toggle it off
                    if (this.currentFilters.has(filter)) {
                        this.currentFilters.delete(filter);
                        e.target.classList.remove('active');
                    } else {
                        // Remove all filters from this group and add the new one
                        groupFilters.forEach(f => {
                            this.currentFilters.delete(f);
                            const btn = document.querySelector(`.filter-btn[data-filter="${f}"]`);
                            if (btn) btn.classList.remove('active');
                        });
                        this.currentFilters.add(filter);
                        e.target.classList.add('active');
                    }
                }
                // Handle grade filters (OR logic - can have multiple)
                else if (filterGroup === 'grade') {
                    if (this.currentFilters.has(filter)) {
                        this.currentFilters.delete(filter);
                        e.target.classList.remove('active');
                    } else {
                        this.currentFilters.add(filter);
                        e.target.classList.add('active');
                    }
                }
                // Handle other filters (selected, tracked)
                else {
                    if (this.currentFilters.has(filter)) {
                        this.currentFilters.delete(filter);
                        e.target.classList.remove('active');
                    } else {
                        this.currentFilters.add(filter);
                        e.target.classList.add('active');
                    }
                }
                
                // If no filters are active, activate 'all'
                if (this.currentFilters.size === 0) {
                    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
                }
                
                this.renderRaces();
                this.renderPlannerGrid(); // Update planner to show filter highlights
            });
        });

        // ESC key closes the picker modal (in addition to clicking outside)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePicker();
            } else if (e.key === 'ArrowLeft') {
                this.navigatePicker?.(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigatePicker?.(1);
            }
        });
    }

	// =============================
	// Planner (game-style) UI
	// =============================
	createEmptyPlannerData() {
		const makeYear = () => {
			const cells = {};
			this.monthOrder.forEach(month => {
				this.halfOrder.forEach(half => {
					cells[this.cellKey(month, half)] = null; // single race or null
				});
			});
			return cells;
		};
		return { junior: makeYear(), classics: makeYear(), senior: makeYear() };
	}

	cellKey(month, half) { return `${month}|${half}`; }

	setPlannerYear(yearKey) {
		if (!['junior','classics','senior'].includes(yearKey)) return;
		this.plannerYear = yearKey;
		// Toggle active tab styles if present
		['tab-junior','tab-classics','tab-senior'].forEach(id => {
			const el = document.getElementById(id);
			if (!el) return;
			el.classList.remove('active');
		});
		const map = { junior: 'tab-junior', classics: 'tab-classics', senior: 'tab-senior' };
		const active = document.getElementById(map[yearKey]);
		if (active) active.classList.add('active');
		this.renderPlannerGrid();
	}

	clearPlannerYear() {
		const yearCells = this.plannerData[this.plannerYear];
		Object.keys(yearCells).forEach(k => { yearCells[k] = null; });
		this.syncSelectionsFromPlanner();
		this.renderPlannerGrid();
		this.renderRaces();
		this.updateProgress();
	}

		renderPlannerGrid() {
		const container = document.getElementById('planner-grid');
		if (!container) return; // older HTML may not have planner UI
		const yearCells = this.plannerData[this.plannerYear];
		const t = this.translations;
		const monthLabel = (m) => `${t.months[m] || m}`; // JP
		const halfLabel = (h) => `${t.halves[h] || h}`;   // JP
		const enShort = { January:'Jan', February:'Feb', March:'Mar', April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug', September:'Sep', October:'Oct', November:'Nov', December:'Dec' };

		const slots = [];
		this.monthOrder.forEach(month => {
			this.halfOrder.forEach(half => {
				const key = this.cellKey(month, half);
					const rawValue = yearCells[key];
					const hasAnyForSlot = this.races.some(r => r.month === month && r.half === half && !!r[this.plannerYear]);
					const selectedId = (typeof rawValue === 'string' && rawValue) ? String(rawValue) : null;
					const isSlotTracked = this.isSlotTracked(month, half, this.plannerYear);
					let slotBody = '';
					
					// Check if ANY available races in this slot match the current filters
					const hasMatchingRaces = this.currentFilters.size > 0 && this.races.some(r => {
						return r.month === month && r.half === half && !!r[this.plannerYear] && this.raceMatchesFilters(r);
					});
					
					if (selectedId) {
						let r = this.raceById ? this.raceById.get(selectedId) : null;
						if (!r) {
							// Backward compatibility: previously stored race name
							r = this.races.find(rr => rr.name === selectedId) || null;
						}
						const hasImage = r && r.image;
						const bgStyle = hasImage ? `background-image: url('${r.image}')` : '';
						const badgeClass = this.lostRaces.has(selectedId) ? 'badge-lost' : (this.wonRaces.has(selectedId) ? 'badge-won' : '');
						slotBody = `
							<div class=\"slot-wrapper\"> 
								<button class=\"slot-button ${badgeClass}\" data-race-id=\"${selectedId}\" style=\"${bgStyle}\" onclick=\"tracker.openPicker('${month}','${half}')\"> 
									<div class=\"slot-gradient\"></div>
									<div class=\"slot-title\"> 
										<div class=\"en\">${r ? r.name : ''}</div>
										<div class=\"jp\">${r && r.nameJP ? r.nameJP : ''}</div>
									</div>
								</button>
								<button class=\"slot-remove\" title=\"Remove / 削除\" onclick=\"tracker.removeRaceFromPlanner('${month}','${half}')\">×</button>
								<button class=\"loss-toggle-btn ${this.lostRaces.has(selectedId) ? 'lost' : 'won'}\" title=\"Toggle Win/Loss / 勝敗切替\" style=\"position:absolute; top:6px; left:6px;\" onclick=\"tracker.toggleWinFromPlanner('${month}','${half}')\">${this.lostRaces.has(selectedId) ? '👎' : '🏆'}</button>
							</div>
						`;
					} else {
									slotBody = `<button class=\"planner-plus ${hasAnyForSlot ? '' : 'disabled'}\" ${hasAnyForSlot ? `onclick=\"tracker.openPicker('${month}','${half}')\"` : ''}>＋ Add / 追加</button>`;
					}
					const isSummer = (month === 'July' || month === 'August');
					slots.push(`
						<div class=\"planner-slot ${!selectedId && !hasAnyForSlot ? 'disabled' : ''} ${isSummer ? 'summer' : ''} ${isSlotTracked ? 'slot-tracked' : ''} ${hasMatchingRaces ? 'filter-match' : ''}\">
							<div class=\"planner-slot-head\"><span>${monthLabel(month)} ${halfLabel(half)} / <span class=\\"en\\">${enShort[month] || month} ${half}</span></span></div>
								<div class=\"planner-slot-body\">${slotBody || `<button class=\\"planner-plus ${hasAnyForSlot ? '' : 'disabled'}\\" ${hasAnyForSlot ? `onclick=\\"tracker.openPicker('${month}','${half}')\\"` : ''}>＋ Add / 追加</button>`}</div>
						</div>
					`);
			});
		});
        container.innerHTML = slots.join('');
        this.syncProgressHeightToPlanner();
	}
	
	// Check if a race matches the current filters
	raceMatchesFilters(race) {
		// If no filters are active, don't highlight anything
		if (this.currentFilters.size === 0) {
			return false;
		}
		
		// Separate filters by type
		const gradeFilters = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
		const activeGrades = [...this.currentFilters].filter(f => gradeFilters.includes(f));
		const otherFilters = [...this.currentFilters].filter(f => !gradeFilters.includes(f));
		
		// Check grade filters with OR logic
		if (activeGrades.length > 0) {
			const gradeMatches = activeGrades.some(filter => {
				switch(filter) {
					case 'GI': return race.type === 'GI';
					case 'GII': return race.type === 'GII';
					case 'GIII': return race.type === 'GIII';
					case 'Open': return race.type === 'Open';
					case 'Pre-OP': return race.type === 'Pre-OP';
					default: return false;
				}
			});
			if (!gradeMatches) return false;
		}
		
		// Check other filters with AND logic
		for (const filter of otherFilters) {
			let matches = false;
			switch(filter) {
				case 'junior': matches = race.junior; break;
				case 'classic': matches = race.classics; break;
				case 'senior': matches = race.senior; break;
				case 'SSS': {
					const set = new Set(this.summerSeries?.sprint || []);
					matches = set.has(race.name);
					break;
				}
				case 'SMS': {
					const set = new Set(this.summerSeries?.mile || []);
					matches = set.has(race.name);
					break;
				}
				case 'S2000': {
					const set = new Set(this.summerSeries?.s2000 || []);
					matches = set.has(race.name);
					break;
				}
				case 'selected': matches = this.selectedRaces.has(String(race.id)); break;
				case 'tracked': {
					const trackedIds = this.getTrackedFactorRaceIds();
					matches = trackedIds.has(String(race.id));
					break;
				}
				case 'turf': matches = race.surface === 'turf'; break;
				case 'dirt': matches = race.surface === 'dirt'; break;
				case 'short': matches = this.distanceCategories.short(race); break;
				case 'mile': matches = this.distanceCategories.mile(race); break;
				case 'medium': matches = this.distanceCategories.medium(race); break;
				case 'long': matches = this.distanceCategories.long(race); break;
				default: matches = true;
			}
			// If any filter doesn't match, return false
			if (!matches) return false;
		}
		// All filters matched
		return true;
	}

	openPicker(month, half) {
		this.currentPicker = { year: this.plannerYear, month, half };
		const title = document.getElementById('picker-title');
		if (title) {
			const yearMap = { junior: 'ジュニア級', classics: 'クラシック級', senior: 'シニア級' };
			title.textContent = `${yearMap[this.plannerYear]} — ${this.translations.months[month] || month} ${this.translations.halves[half] || half}`;
		}
        this.renderPickerList();
        const modal = document.getElementById('picker-modal');
        if (modal) modal.classList.remove('hidden');
        // Update toggle button state
        this.updateToggleButton();
        // Position side navs just outside the panel edges
        this.positionPickerNavs();
        // Setup swipe listeners
        this.attachPickerSwipeHandlers();
	}

	closePicker() {
		const modal = document.getElementById('picker-modal');
		if (modal) modal.classList.add('hidden');
	}

	toggleCloseOnSelection() {
		this.closeOnSelection = !this.closeOnSelection;
		this.updateToggleButton();
	}

	updateToggleButton() {
		const btn = document.getElementById('toggle-close-btn');
		if (btn) {
			const enText = btn.querySelector('.toggle-text-en');
			const jpText = btn.querySelector('.toggle-text-jp');
			if (this.closeOnSelection) {
				btn.classList.remove('active');
				if (enText) enText.textContent = 'Auto-close';
				if (jpText) jpText.textContent = '自動閉じる';
			} else {
				btn.classList.add('active');
				if (enText) enText.textContent = 'Stay open';
				if (jpText) jpText.textContent = '開いたまま';
			}
		}
	}

    onPickerBackdrop(evt) {
        // No longer needed, as backdrop has its own onclick to close.
        // Keeping for backward compatibility if still bound.
        if (!evt) return;
        const target = evt.target;
        if (target && (target.id === 'picker-modal' || target.classList.contains('picker-backdrop'))) {
            this.closePicker();
        }
    }

		renderPickerList() {
		const listEl = document.getElementById('picker-list');
		if (!listEl || !this.currentPicker) return;
		const { year, month, half } = this.currentPicker;
		const yearFlag = { junior: 'junior', classics: 'classics', senior: 'senior' }[year];
        const filtered = this.races.filter(r => r.month === month && r.half === half && (!!r[yearFlag]));
        const typeOrder = { 'GI': 0, 'GII': 1, 'GIII': 2, 'Open': 3, 'Pre-OP': 4 };
        const sorted = filtered.slice().sort((a, b) => {
            const ao = typeOrder[a.type] ?? 99;
            const bo = typeOrder[b.type] ?? 99;
            if (ao !== bo) return ao - bo;
            return (a.name || '').localeCompare(b.name || '');
        });
			const cellValue = this.plannerData[year][this.cellKey(month, half)];
        listEl.innerHTML = sorted.map(r => {
				const selected = String(cellValue) === String(r.id);
				const isTracked = this.isRaceTracked(r.id);
				const imageUrl = r.image || '';
				return `
					<div class=\"picker-item ${selected ? 'selected' : ''} ${isTracked ? 'picker-item-tracked' : ''}\" data-race-id=\"${r.id}\" onclick=\"tracker.addRaceToCurrentCellById('${r.id}')\">
					${imageUrl ? `<img src=\"${imageUrl}\" alt=\"${(r.name || '').replace(/\\"/g, '&quot;')}\">` : ''}
					<div>
						<div class="race-name">
							<div class="race-name-en">${r.name}</div>
							<div class="race-name-jp">${r.nameJP}</div>
						</div>
						<div class="race-details">
							<span class="race-grade grade-${r.type}">${r.type}</span>
							${r.length} • ${r.surface}/${this.translations.surfaces[r.surface] || r.surface}
						</div>
						<div class="race-details">
							${r.racetrack}/${this.translations.tracks[r.racetrack] || r.racetrack}
							• ${this.translations.months[r.month] || r.month} ${this.translations.halves[r.half] || r.half}
							${r.direction ? `• ${this.translations.directions[r.direction]} / ${r.direction}` : ''}
							${(() => {
								const years = [];
								if (r.junior) years.push('Junior');
								if (r.classics) years.push('Classic');
								if (r.senior) years.push('Senior');
								return years.length > 0 ? `• ${years.join('/')}` : '';
							})()}
						</div>
					</div>
				</div>
			`;
		}).join('');
	}

    navigatePicker(direction) {
        // direction: -1 (prev half) or 1 (next half). Wrap month/half within the same year.
        if (!this.currentPicker) return;
        const months = this.monthOrder;
        const halves = this.halfOrder; // ['1st','2nd']
        const yearOrder = ['junior','classics','senior'];
        let yi = yearOrder.indexOf(this.currentPicker.year);
        let mi = months.indexOf(this.currentPicker.month);
        let hi = halves.indexOf(this.currentPicker.half);
        const step = direction > 0 ? 1 : -1;
        hi += step;
        if (hi < 0) { hi = halves.length - 1; mi -= 1; }
        if (hi >= halves.length) { hi = 0; mi += 1; }
        if (mi < 0) { mi = months.length - 1; yi = (yi - 1 + yearOrder.length) % yearOrder.length; }
        if (mi >= months.length) { mi = 0; yi = (yi + 1) % yearOrder.length; }
        const year = yearOrder[yi];
        this.currentPicker = { year, month: months[mi], half: halves[hi] };
        // Update title and list
        const title = document.getElementById('picker-title');
        if (title) {
            const yearMap = { junior: 'ジュニア級', classics: 'クラシック級', senior: 'シニア級' };
            title.textContent = `${yearMap[year]} — ${this.translations.months[this.currentPicker.month] || this.currentPicker.month} ${this.translations.halves[this.currentPicker.half] || this.currentPicker.half}`;
        }
        this.renderPickerList();
        this.positionPickerNavs();
    }

    attachPickerSwipeHandlers() {
        const panel = document.getElementById('picker-panel');
        if (!panel) return;
        let startX = 0, startY = 0, isTouch = false;
        const onTouchStart = (e) => {
            isTouch = true;
            const t = e.touches ? e.touches[0] : e;
            startX = t.clientX; startY = t.clientY;
        };
        const onTouchEnd = (e) => {
            if (!isTouch) return;
            const t = (e.changedTouches && e.changedTouches[0]) || e;
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
                this.navigatePicker(dx < 0 ? 1 : -1);
            }
            isTouch = false;
        };
        panel.onmousedown = onTouchStart;
        panel.onmouseup = onTouchEnd;
        panel.ontouchstart = onTouchStart;
        panel.ontouchend = onTouchEnd;
    }

    positionPickerNavs() {
        setTimeout(() => {
            const panel = document.getElementById('picker-panel');
            const leftBtn = document.querySelector('.picker-nav-left');
            const rightBtn = document.querySelector('.picker-nav-right');
            if (panel && leftBtn && rightBtn) {
                const rect = panel.getBoundingClientRect();
                const gap = 12; // distance from panel edge
                leftBtn.style.left = `${rect.left - leftBtn.offsetWidth - gap}px`;
                leftBtn.style.top = `${rect.top + rect.height / 2 - leftBtn.offsetHeight / 2}px`;
                rightBtn.style.left = `${rect.right + gap}px`;
                rightBtn.style.top = `${rect.top + rect.height / 2 - rightBtn.offsetHeight / 2}px`;
            }
        }, 0);
    }

    addRaceToCurrentCell(raceName) {
        // Backward-compat: resolve by name then delegate to ID-based handler
        const race = this.races.find(r => r.name === raceName);
        if (race) {
            return this.addRaceToCurrentCellById(String(race.id));
        }
        // If not found, keep prior behavior but store as string (unlikely now)
        if (!this.currentPicker) return;
        const { year, month, half } = this.currentPicker;
        const key = this.cellKey(month, half);
        const prev = this.plannerData[year][key];
        const id = String(raceName);
        this.plannerData[year][key] = id;
        if (prev && !this.isPlannedAnywhere(prev)) {
            this.selectedRaces.delete(prev);
            this.wonRaces.delete(prev);
            this.lostRaces.delete(prev);
        }
        this.selectedRaces.add(id);
        this.lostRaces.delete(id);
        this.wonRaces.add(id);
        if (this.closeOnSelection) this.closePicker();
        this.renderPlannerGrid();
        this.renderRaces();
        this.updateProgress();
    }

    addRaceToCurrentCellById(raceId) {
        if (!this.currentPicker) return;
        const id = String(raceId);
        const { year, month, half } = this.currentPicker;
        const key = this.cellKey(month, half);
        const prev = this.plannerData[year][key];
        this.plannerData[year][key] = id;
        if (prev && !this.isPlannedAnywhere(prev)) {
            this.selectedRaces.delete(prev);
            this.wonRaces.delete(prev);
            this.lostRaces.delete(prev);
        }
        this.selectedRaces.add(id);
        this.lostRaces.delete(id);
        this.wonRaces.add(id);
        if (this.closeOnSelection) this.closePicker();
        this.renderPlannerGrid();
        this.renderRaces();
        this.updateProgress();
    }

		removeRaceFromPlanner(month, half) {
		const key = this.cellKey(month, half);
			const prev = this.plannerData[this.plannerYear][key];
			this.plannerData[this.plannerYear][key] = null;
			// If previous race no longer exists in any planner cell, remove from global selections
			if (prev && !this.isPlannedAnywhere(prev)) {
				this.selectedRaces.delete(prev);
				this.wonRaces.delete(prev);
				this.lostRaces.delete(prev);
			}
		this.renderPlannerGrid();
		this.renderRaces();
		this.updateProgress();
	}

    toggleWinFromPlanner(month, half) {
			const key = this.cellKey(month, half);
            const id = this.plannerData[this.plannerYear][key];
            if (!id) return;
			// Cycle Won -> Lost -> Won
            this.toggleWinById(id);
		this.renderPlannerGrid();
	}

	syncSelectionsFromPlanner() {
		// Reconstruct global selections from planner (does not include manual grid selections)
			const planned = new Set();
			Object.values(this.plannerData).forEach(yearCells => {
				Object.values(yearCells).forEach(value => { if (value) planned.add(value); });
			});
		// Remove any selection not planned
		Array.from(this.selectedRaces).forEach(n => { if (!planned.has(n)) {
			this.selectedRaces.delete(n);
			this.wonRaces.delete(n);
			this.lostRaces.delete(n);
		}});
	}

    isPlannedAnywhere(raceId) {
			return Object.values(this.plannerData).some(yearCells => {
            return Object.values(yearCells).some(value => value === raceId);
			});
		}

    planRaceIntoPlanner(race, preferYear) {
        // Decide target year: prefer the active tab if applicable; otherwise the first truthy flag
        let targetYear = null;
        const flags = ['junior','classics','senior'];
        if (preferYear && race[preferYear]) targetYear = preferYear;
        if (!targetYear) {
            for (let i = 0; i < flags.length; i++) {
                if (race[flags[i]]) { targetYear = flags[i]; break; }
            }
        }
        if (!targetYear) targetYear = this.plannerYear;
        const key = this.cellKey(race.month, race.half);
        const prevId = this.plannerData[targetYear][key];
        this.plannerData[targetYear][key] = String(race.id);
        if (prevId && !this.isPlannedAnywhere(prevId)) {
            this.selectedRaces.delete(prevId);
            this.wonRaces.delete(prevId);
            this.lostRaces.delete(prevId);
        }
    }

    removeRaceEverywhereFromPlanner(raceId) {
        Object.keys(this.plannerData).forEach(yearKey => {
            const yearCells = this.plannerData[yearKey];
            Object.keys(yearCells).forEach(cellKey => {
                if (yearCells[cellKey] === raceId) yearCells[cellKey] = null;
            });
        });
    }

    renderRaces() {
        const grid = document.getElementById('races-grid');
        const filteredRaces = this.getFilteredRaces();
        
        grid.innerHTML = filteredRaces.map(race => {
            const isTracked = this.isRaceTracked(race.id);
            const isInPlanner = this.isPlannedAnywhere(String(race.id));
            return `
            <div class="race-card ${this.selectedRaces.has(String(race.id)) ? 'selected' : ''} ${this.wonRaces.has(String(race.id)) ? 'won' : ''} ${isTracked ? 'race-tracked' : ''} ${isInPlanner ? 'race-in-planner' : ''}" 
                 data-race-id="${race.id}" data-race="${race.name}" onclick="tracker.toggleParticipationById('${race.id}')">
                ${race.image ? `<div class="race-thumb"><img class="race-thumb-img" src="${race.image}" alt="${(race.name || '').replace(/"/g, '&quot;')}" loading="lazy"></div>` : ''}
                <div class="race-name">
                    <div class="race-name-en">${race.name}</div>
                    <div class="race-name-jp">${race.nameJP}</div>
                </div>
                <div class="race-details">
                    <span class="race-grade grade-${race.type}">${race.type}</span>
                    ${race.length} • ${race.surface}/${this.translations.surfaces[race.surface] || race.surface}
                </div>
                <div class="race-details">
                    ${race.racetrack}/${this.translations.tracks[race.racetrack] || race.racetrack}
                    • ${this.translations.months[race.month] || race.month} ${this.translations.halves[race.half] || race.half} / ${race.month} ${race.half}
                    ${race.direction ? `• ${this.translations.directions[race.direction]} / ${race.direction}` : ''}
                    ${(() => {
                        const years = [];
                        if (race.junior) years.push('Junior');
                        if (race.classics) years.push('Classic');
                        if (race.senior) years.push('Senior');
                        return years.length > 0 ? `• ${years.join('/')}` : '';
                    })()}
                </div>
                ${this.selectedRaces.has(String(race.id)) ? `
                <div class="win-button-container">
                    <button class="loss-toggle-btn ${this.lostRaces.has(String(race.id)) ? 'lost' : 'won'}" 
                            onclick="event.stopPropagation(); tracker.toggleWinById('${race.id}')">
                        ${this.lostRaces.has(String(race.id)) ? '👎' : '🏆'}
                    </button>
                </div>
                ` : ''}
            </div>
            `;
        }).join('');
        this.syncProgressHeightToPlanner();
    }

    getFilteredRaces() {
        // If no filters are active, show all races
        if (this.currentFilters.size === 0) {
            return this.sortRacesList([...this.races]);
        }
        
        // Separate filters by type
        const gradeFilters = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
        const activeGrades = [...this.currentFilters].filter(f => gradeFilters.includes(f));
        const otherFilters = [...this.currentFilters].filter(f => !gradeFilters.includes(f));
        
        let list = [...this.races];
        
        // Apply grade filters with OR logic
        if (activeGrades.length > 0) {
            list = list.filter(race => {
                return activeGrades.some(filter => {
                    switch(filter) {
                        case 'GI': return race.type === 'GI';
                        case 'GII': return race.type === 'GII';
                        case 'GIII': return race.type === 'GIII';
                        case 'Open': return race.type === 'Open';
                        case 'Pre-OP': return race.type === 'Pre-OP';
                        default: return false;
                    }
                });
            });
        }
        
        // Apply other filters with AND logic
        for (const filter of otherFilters) {
            list = list.filter(race => {
                switch(filter) {
                    case 'junior': return race.junior;
                    case 'classic': return race.classics;
                    case 'senior': return race.senior;
                    case 'SSS': {
                        const set = new Set(this.summerSeries?.sprint || []);
                        return set.has(race.name);
                    }
                    case 'SMS': {
                        const set = new Set(this.summerSeries?.mile || []);
                        return set.has(race.name);
                    }
                    case 'S2000': {
                        const set = new Set(this.summerSeries?.s2000 || []);
                        return set.has(race.name);
                    }
                    case 'selected': return this.selectedRaces.has(String(race.id));
                    case 'tracked': {
                        const trackedIds = this.getTrackedFactorRaceIds();
                        return trackedIds.has(String(race.id));
                    }
                    case 'turf': return race.surface === 'turf';
                    case 'dirt': return race.surface === 'dirt';
                    case 'short': return this.distanceCategories.short(race);
                    case 'mile': return this.distanceCategories.mile(race);
                    case 'medium': return this.distanceCategories.medium(race);
                    case 'long': return this.distanceCategories.long(race);
                    default: return true;
                }
            });
        }
        
        return this.sortRacesList(list);
    }
    
    sortRacesList(list) {
        const typeOrder = { 'GI': 0, 'GII': 1, 'GIII': 2, 'Open': 3, 'Pre-OP': 4 };
        return list.sort((a, b) => {
            const ao = typeOrder[a.type] ?? 99;
            const bo = typeOrder[b.type] ?? 99;
            if (ao !== bo) return ao - bo;
            const am = this.monthOrder.indexOf(a.month);
            const bm = this.monthOrder.indexOf(b.month);
            if (am !== bm) return am - bm;
            const halfOrder = { '1st': 0, '2nd': 1 };
            const ah = halfOrder[a.half] ?? 0;
            const bh = halfOrder[b.half] ?? 0;
            if (ah !== bh) return ah - bh;
            return (a.name || '').localeCompare(b.name || '');
        });
    }

    toggleParticipationById(raceId) {
        const id = String(raceId);
        if (this.selectedRaces.has(id)) {
            // Remove participation and clear all results
            this.selectedRaces.delete(id);
            this.wonRaces.delete(id);
            this.lostRaces.delete(id);
            // Also remove from planner wherever it appears
            this.removeRaceEverywhereFromPlanner(id);
        } else {
            // Add participation and automatically mark as won
            this.selectedRaces.add(id);
            this.wonRaces.add(id);
            // Also place into planner for the appropriate year/month/half
            const race = this.raceById.get(id);
            if (race) this.planRaceIntoPlanner(race, this.plannerYear);
        }
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }

    // Helpers to support name-based conditions while the authoritative state uses IDs
    getIdsForNames(nameList) {
        const result = new Set();
        (nameList || []).forEach(name => {
            const ids = this.raceIdsByName.get(name);
            if (ids) ids.forEach(id => result.add(id));
        });
        return result;
    }

    hasWonAnyByNames(nameList) {
        const ids = this.getIdsForNames(nameList);
        for (const id of ids) if (this.wonRaces.has(id)) return true;
        return false;
    }

    countWinsByFilter(predicate) {
        let count = 0;
        this.wonRaces.forEach(id => {
            const race = this.raceById.get(String(id));
            if (race && predicate(race)) count++;
        });
        return count;
    }

    toggleWinById(raceId) {
        const id = String(raceId);
        if (!this.selectedRaces.has(id)) return; // Can't win/lose if not participating
        
        // Toggle between Won and Lost
        if (this.wonRaces.has(id)) {
            // Currently won, change to lost
            this.wonRaces.delete(id);
            this.lostRaces.add(id);
        } else if (this.lostRaces.has(id)) {
            // Currently lost, change to won
            this.lostRaces.delete(id);
            this.wonRaces.add(id);
        }
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }

    clearAll() {
        const confirmed = confirm('This will clear all races in planner and database.\n\nこれにより、プランナーとデータベースのすべてのレースがクリアされます。\n\nAre you sure you want to continue?');
        if (!confirmed) return;

        this.selectedRaces.clear();
        this.wonRaces.clear();
        this.lostRaces.clear();
        // Also clear planner across all years
        Object.keys(this.plannerData).forEach(yearKey => {
            const cells = this.plannerData[yearKey];
            Object.keys(cells).forEach(k => { cells[k] = null; });
        });
        this.renderPlannerGrid();
        this.renderRaces();
        this.updateProgress();
    }

    updateProgress() {
        // Update stats
        document.getElementById('total-races').textContent = this.selectedRaces.size;
        document.getElementById('total-wins').textContent = this.wonRaces.size;
        document.getElementById('total-losses').textContent = this.lostRaces.size;
        
        // Check all hidden factors
        const results = this.hiddenFactors.map(factor => ({
            ...factor,
            result: factor.check()
        }));
        
        const completedCount = results.filter(r => r.result.completed).length;
        document.getElementById('completed-factors').textContent = completedCount;
        
        // Render hidden factors
        this.renderHiddenFactors(results);
        this.syncProgressHeightToPlanner();
    }

    syncProgressHeightToPlanner() {
        try {
            const planner = document.getElementById('planner-section');
            const panel = document.getElementById('progress-panel');
            if (!planner || !panel) return;
            const plannerHeight = planner.getBoundingClientRect().height;
            panel.style.maxHeight = `${plannerHeight}px`;
        } catch (err) {
            // ignore
        }
    }

    // =============================
    // Hidden Factor Tracking
    // =============================

    /**
     * Set the currently tracked hidden factor
     * @param {string|null} factorId - The ID of the factor to track, or null to clear
     */
    setTrackedFactor(factorId) {
        // If clicking the same factor, toggle it off
        if (this.trackedFactorId === factorId) {
            this.trackedFactorId = null;
        } else {
            this.trackedFactorId = factorId;
        }
        this.updateProgress();
        this.renderRaces();
        this.renderPlannerGrid();
    }

    /**
     * Clear the currently tracked factor
     */
    clearTrackedFactor() {
        this.trackedFactorId = null;
        this.updateProgress();
        this.renderRaces();
        this.renderPlannerGrid();
    }

    /**
     * Get the set of race IDs that satisfy the currently tracked factor
     * @returns {Set<string>} Set of race IDs, or empty Set if no factor tracked
     */
    getTrackedFactorRaceIds() {
        if (!this.trackedFactorId) return new Set();
        const factor = this.hiddenFactors.find(f => f.id === this.trackedFactorId);
        if (!factor || !factor.getRaces) return new Set();
        return factor.getRaces();
    }

    /**
     * Check if a race satisfies the currently tracked factor
     * @param {string} raceId - The race ID to check
     * @returns {boolean}
     */
    isRaceTracked(raceId) {
        const trackedIds = this.getTrackedFactorRaceIds();
        return trackedIds.has(String(raceId));
    }

    /**
     * Check if a planner slot (month/half) has any races that satisfy the tracked factor
     * @param {string} month - Month name
     * @param {string} half - Half ('1st' or '2nd')
     * @param {string} yearKey - 'junior', 'classics', or 'senior'
     * @returns {boolean}
     */
    isSlotTracked(month, half, yearKey) {
        if (!this.trackedFactorId) return false;
        const trackedIds = this.getTrackedFactorRaceIds();
        if (trackedIds.size === 0) return false;
        
        // Check if any tracked race matches this slot
        for (const id of trackedIds) {
            const race = this.raceById.get(String(id));
            if (race && race.month === month && race.half === half && race[yearKey]) {
                return true;
            }
        }
        return false;
    }

    // =============================
    // getRaces methods for trackable factors
    // =============================

    getRacesForEasternG1() {
        const result = new Set();
        this.races.forEach(race => {
            if (this.isGradeOne(race) && this.easternTracks.includes(race.racetrack)) {
                result.add(String(race.id));
            }
        });
        return result;
    }

    getRacesForWesternG1() {
        const result = new Set();
        this.races.forEach(race => {
            if (this.isGradeOne(race) && this.westernTracks.includes(race.racetrack)) {
                result.add(String(race.id));
            }
        });
        return result;
    }

    getRacesForNewspaperCups() {
        const names = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
        return this.getIdsForNames(names);
    }

    getRacesForSummerSeries(seriesKey) {
        const targetNames = (this.summerSeries && this.summerSeries[seriesKey]) ? this.summerSeries[seriesKey] : [];
        return this.getIdsForNames(targetNames);
    }

    getRacesForNewYearGold() {
        const result = new Set();
        const targets = new Set(['Nakayama Kinen', 'Kyoto Kinen']);
        this.races.forEach(race => {
            if (targets.has(race.name) && race.senior && race.month === 'January' && race.half === '1st') {
                result.add(String(race.id));
            }
        });
        return result;
    }

    getRacesForStarRaces() {
        const names = [
            'Procyon Stakes', 'Capella Stakes', 'Centaur Stakes', 'Aldebaran Stakes',
            'Rigel Stakes', 'Betelgeuse Stakes', 'Cassiopeia Stakes', 'Sirius Stakes'
        ];
        return this.getIdsForNames(names);
    }

    getRacesForJewelryRaces() {
        const names = ['Diamond Stakes', 'Turquoise Stakes', 'Opal Stakes'];
        return this.getIdsForNames(names);
    }

    getRacesForDualSurface() {
        const result = new Set();
        this.races.forEach(race => {
            if (race.surface === 'turf' || race.surface === 'dirt') {
                result.add(String(race.id));
            }
        });
        return result;
    }

    getRacesForPerfectCrown() {
        const triple = ['Satsuki Sho', 'Japan Derby', 'Kikka Sho'];
        const groupA = ['Yayoi Sho', 'Spring Stakes', 'Wakaba Stakes'];
        const groupB = ['Aoba Sho', 'Principal Stakes'];
        const groupC = ['Kobe Shimbun Hai', 'Saint Lite Kinen'];
        const allNames = [...triple, ...groupA, ...groupB, ...groupC];
        return this.getIdsForNames(allNames);
    }

    getRacesForPerfectTiara() {
        const triple = ['Oka Sho', 'Oaks', 'Akika Sho'];
        const groupA = ['Fillies Review', 'Tulip Sho', 'Anemone Stakes'];
        const groupB = ['Flora Stakes', 'Sweet Pea Stakes'];
        const groupC = ['Rose Stakes', 'Shion Stakes'];
        const allNames = [...triple, ...groupA, ...groupB, ...groupC];
        return this.getIdsForNames(allNames);
    }

    getRacesForDirectionalAwakening(direction) {
        const result = new Set();
        this.races.forEach(race => {
            if (race.direction === direction) {
                result.add(String(race.id));
            }
        });
        return result;
    }

    getRacesForSeasonalAwakening(season) {
        const result = new Set();
        this.races.forEach(race => {
            if (race.season === season) {
                result.add(String(race.id));
            }
        });
        return result;
    }

    renderHiddenFactors(results) {
        const container = document.getElementById('hidden-factors');
        
        container.innerHTML = results.map(factor => {
            const statusClass = factor.result.completed ? 'completed' : 
                               factor.result.progress > 0 ? 'partial' : '';
            const progressPercentage = Math.min(100, (factor.result.current / factor.result.required) * 100);
            const isTracked = this.trackedFactorId === factor.id;
            const showTrackButton = factor.trackable !== false;
            
            return `
                <div class="factor-item ${statusClass} ${isTracked ? 'factor-tracked' : ''}">
                    <div class="factor-header">
                        <div class="factor-name">
                            <div class="factor-name-en">${factor.nameEN}</div>
                            <div class="factor-name-jp">${factor.nameJP}</div>
                            ${factor.result.completed ? '<div class="completion-badge">✅</div>' : ''}
                        </div>
                        ${showTrackButton ? `
                            <button class="btn btn-track ${isTracked ? 'active' : ''}" 
                                    onclick="tracker.setTrackedFactor('${factor.id}')" 
                                    title="Track this factor / この因子を追跡">
                                🔍
                            </button>
                        ` : ''}
                    </div>
                    <div class="factor-condition">
                        <div class="condition-en">${factor.conditionEN || factor.condition}</div>
                        ${factor.conditionJP ? `<div class="condition-jp">${factor.conditionJP}</div>` : ''}
                    </div>
                    <div class="factor-progress">
                        <div>Progress / 進捗: ${factor.result.current}/${factor.result.required}</div>
                        ${factor.result.details ? `<div style="margin-top: 2px; font-size: 0.75rem;">• ${factor.result.details}</div>` : ''}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Show/hide clear tracking button
        const clearBtn = document.getElementById('clear-tracking-btn');
        if (clearBtn) {
            clearBtn.style.display = this.trackedFactorId ? 'block' : 'none';
        }
        
        // Show/hide tracked filter button
        const trackedFilterBtn = document.getElementById('tracked-filter-btn');
        if (trackedFilterBtn) {
            trackedFilterBtn.style.display = this.trackedFactorId ? 'inline-flex' : 'none';
        }
    }

    // Planner-aware chronological helpers
    buildPlannerTimeline() {
        const cells = [];
        const yearOrder = ['junior','classics','senior'];
        try {
            yearOrder.forEach(year => {
                const yearCells = this.plannerData[year] || {};
                this.monthOrder.forEach(month => {
                    this.halfOrder.forEach(half => {
                        const key = this.cellKey(month, half);
                        const raw = yearCells[key];
                        const id = raw ? String(raw) : null;
                        const won = id ? this.wonRaces.has(id) : false;
                        const lost = id ? this.lostRaces.has(id) : false;
                        cells.push({ year, month, half, id, won, lost, filled: !!id });
                    });
                });
            });
        } catch (e) {
            // Fallback to empty timeline
        }
        return cells;
    }

    getMaxConsecutiveRunsFromPlanner() {
        const cells = this.buildPlannerTimeline();
        let max = 0, cur = 0;
        for (const c of cells) {
            if (c.filled) { cur += 1; } else { cur = 0; }
            if (cur > max) max = cur;
        }
        return max;
    }

    getMaxConsecutiveWinsFromPlanner() {
        const cells = this.buildPlannerTimeline();
        let max = 0, cur = 0;
        for (const c of cells) {
            if (c.won) { cur += 1; } else { cur = 0; }
            if (cur > max) max = cur;
        }
        return max;
    }

    hasLossThenWinFromPlanner() {
        const cells = this.buildPlannerTimeline();
        let seenLoss = false;
        for (const c of cells) {
            if (!c.filled) continue;
            if (c.lost) seenLoss = true;
            if (c.won && seenLoss) return true;
        }
        return false;
    }

    // Condition checking methods
    checkConsecutiveRuns() {
        // Enforce true consecutiveness using planner timeline
        const maxStreak = this.getMaxConsecutiveRunsFromPlanner();
        const required = 2;
        return {
            completed: maxStreak >= required,
            current: Math.min(maxStreak, required),
            required,
            progress: Math.min(100, (maxStreak / required) * 100),
            details: `Max planned consecutive runs: ${maxStreak}`
        };
    }
    checkConsecutiveWins() {
        // Enforce true consecutiveness using planner timeline
        const maxWinStreak = this.getMaxConsecutiveWinsFromPlanner();
        const required = 2;
        return {
            completed: maxWinStreak >= required,
            current: Math.min(maxWinStreak, required),
            required,
            progress: Math.min(100, (maxWinStreak / required) * 100),
            details: `Max planned consecutive wins: ${maxWinStreak}`
        };
    }

    checkEasternG1Wins() {
        const eastern = Array.from(this.wonRaces)
            .map(id => this.raceById.get(String(id)))
            .filter(race => race && this.isGradeOne(race) && this.easternTracks.includes(race.racetrack))
            .map(r => r.name);
        return {
            completed: eastern.length >= 7,
            current: eastern.length,
            required: 7,
            progress: (eastern.length / 7) * 100,
            details: `Eastern G1 wins: ${eastern.join(', ')}`
        };
    }

    checkWesternG1Wins() {
        const western = Array.from(this.wonRaces)
            .map(id => this.raceById.get(String(id)))
            .filter(race => race && this.isGradeOne(race) && this.westernTracks.includes(race.racetrack))
            .map(r => r.name);
        return {
            completed: western.length >= 7,
            current: western.length,
            required: 7,
            progress: (western.length / 7) * 100,
            details: `Western G1 wins: ${western.join(', ')}`
        };
    }

    checkDifferentRacecourses() {
        const racecourses = new Set();
        this.selectedRaces.forEach(id => {
            const race = this.raceById.get(String(id));
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

    checkAllDistanceG1() {
        // CSV-aligned: any race win counts (not GI-restricted)
        const distanceWins = { short: false, mile: false, medium: false, long: false };
        Array.from(this.wonRaces).forEach(id => {
            const race = this.raceById.get(String(id));
            if (!race) return;
            Object.keys(distanceWins).forEach(category => {
                if (this.distanceCategories[category](race)) {
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

    checkNewspaperCups() {
        const names = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
        const wonNames = names.filter(n => {
            const ids = this.raceIdsByName.get(n);
            if (!ids) return false;
            for (const id of ids) if (this.wonRaces.has(String(id))) return true;
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

    checkSummerSeries(seriesKey) {
        const targetNames = (this.summerSeries && this.summerSeries[seriesKey]) ? this.summerSeries[seriesKey] : [];
        const wonNames = targetNames.filter(n => {
            const ids = this.raceIdsByName.get(n);
            if (!ids) return false;
            for (const id of ids) if (this.wonRaces.has(String(id))) return true;
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

    checkNewYearGold() {
        // Senior year, January, first half; must win Nakayama Kinen or Kyoto Kinen
        const targets = new Set(['Nakayama Kinen', 'Kyoto Kinen']);
        const qualified = [];
        this.wonRaces.forEach(id => {
            const race = this.raceById.get(String(id));
            if (!race) return;
            if (!targets.has(race.name)) return;
            if (race.senior && race.month === 'January' && race.half === '1st') qualified.push(race.name);
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

    checkStarRaces() {
        const names = [
            'Procyon Stakes', 'Capella Stakes', 'Centaur Stakes', 'Aldebaran Stakes',
            'Rigel Stakes', 'Betelgeuse Stakes', 'Cassiopeia Stakes', 'Sirius Stakes'
        ];
        const wonNames = names.filter(n => {
            const ids = this.raceIdsByName.get(n);
            if (!ids) return false;
            for (const id of ids) if (this.wonRaces.has(String(id))) return true;
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

    checkJewelryRaces() {
        // Dataset-limited: only a subset available; CSV requires 3 distinct wins
        const names = ['Diamond Stakes', 'Turquoise Stakes', 'Opal Stakes'];
        const wonNames = names.filter(n => {
            const ids = this.raceIdsByName.get(n);
            if (!ids) return false;
            for (const id of ids) if (this.wonRaces.has(String(id))) return true;
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

    checkDualSurface() {
        let turfWins = false;
        let dirtWins = false;
        this.wonRaces.forEach(id => {
            const race = this.raceById.get(String(id));
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

    checkPerfectCrown() {
        const triple = ['Satsuki Sho', 'Japan Derby', 'Kikka Sho'];
        const groupA = ['Yayoi Sho', 'Spring Stakes', 'Wakaba Stakes'];
        const groupB = ['Aoba Sho', 'Principal Stakes'];
        const groupC = ['Kobe Shimbun Hai', 'Saint Lite Kinen'];
        const wonNamesSet = new Set(Array.from(this.wonRaces).map(id => {
            const r = this.raceById.get(String(id));
            return r ? r.name : null;
        }).filter(Boolean));
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

    checkPerfectTiara() {
        const triple = ['Oka Sho', 'Oaks', 'Akika Sho'];
        const groupA = ['Fillies Review', 'Tulip Sho', 'Anemone Stakes'];
        const groupB = ['Flora Stakes', 'Sweet Pea Stakes'];
        const groupC = ['Rose Stakes', 'Shion Stakes'];
        const wonNamesSet = new Set(Array.from(this.wonRaces).map(id => {
            const r = this.raceById.get(String(id));
            return r ? r.name : null;
        }).filter(Boolean));
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

    checkImprovesWithRacing() {
        // Require 3 consecutive planned races (reporter event still simplified/unmodeled)
        const maxStreak = this.getMaxConsecutiveRunsFromPlanner();
        const required = 3;
        return {
            completed: maxStreak >= required,
            current: Math.min(maxStreak, required),
            required,
            progress: Math.min(100, (maxStreak / required) * 100),
            details: `Max planned consecutive runs: ${maxStreak} (reporter event not modeled)`
        };
    }

    checkNeverGiveUp() {
        // Enforce order: a loss occurs before a later win in planner timeline
        const cells = this.buildPlannerTimeline();
        const anyLoss = cells.some(c => c.lost);
        const anyWin = cells.some(c => c.won);
        const completed = this.hasLossThenWinFromPlanner();
        return {
            completed,
            current: completed ? 2 : (anyLoss || anyWin ? 1 : 0),
            required: 2,
            progress: completed ? 100 : (anyLoss || anyWin ? 50 : 0),
            details: completed ? 'Loss occurs before a later win (planner order)' : 'Need a loss followed by a later win (planner order)'
        };
    }

    checkRebelliousSpirit() {
        // Simplified: assume any win counts as this would require aptitude data
        const wonAny = this.wonRaces.size > 0;
        
        return {
            completed: wonAny,
            current: wonAny ? 1 : 0,
            required: 1,
            progress: wonAny ? 100 : 0,
            details: `Simplified: Any win counts (requires aptitude system)`
        };
    }

    checkDirectionalAwakening(direction) {
        const names = Array.from(this.wonRaces)
            .map(id => this.raceById.get(String(id)))
            .filter(r => r && r.direction === direction)
            .map(r => r.name);
        return {
            completed: names.length >= 6,
            current: names.length,
            required: 6,
            progress: (names.length / 6) * 100,
            details: `${direction}-handed wins: ${names.join(', ')}`
        };
    }

    checkSeasonalAwakening(season) {
        const names = Array.from(this.wonRaces)
            .map(id => this.raceById.get(String(id)))
            .filter(r => r && r.season === season)
            .map(r => r.name);
        return {
            completed: names.length >= 6,
            current: names.length,
            required: 6,
            progress: (names.length / 6) * 100,
            details: `${season} wins: ${names.join(', ')}`
        };
    }

    // ============================================
    // STORAGE SYSTEM METHODS
    // ============================================

    // Storage version for compatibility
    get STORAGE_VERSION() {
        return "1.0";
    }

    // Dialog Controls
    openSaveDialog() {
        const modal = document.getElementById('save-modal');
        modal.classList.remove('hidden');
        this.renderSaveSlots();
    }

    closeSaveDialog() {
        const modal = document.getElementById('save-modal');
        modal.classList.add('hidden');
    }

    openLoadDialog() {
        const modal = document.getElementById('load-modal');
        modal.classList.remove('hidden');
        this.renderLoadSlots();
    }

    closeLoadDialog() {
        const modal = document.getElementById('load-modal');
        modal.classList.add('hidden');
    }

    openShareDialog() {
        const modal = document.getElementById('share-modal');
        modal.classList.remove('hidden');
        this.generateShareURL();
    }

    closeShareDialog() {
        const modal = document.getElementById('share-modal');
        modal.classList.add('hidden');
    }

    openNameDialog(slotId) {
        this.currentSaveSlot = slotId;
        const modal = document.getElementById('name-modal');
        const input = document.getElementById('name-input');
        
        // Set default name based on current progress
        const defaultName = `Save ${new Date().toLocaleDateString()} - ${this.selectedRaces.size} races`;
        input.value = defaultName;
        input.select();
        
        modal.classList.remove('hidden');
        
        // Allow Enter key to confirm
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.confirmSaveName();
            } else if (e.key === 'Escape') {
                this.closeNameDialog();
            }
        };
    }

    closeNameDialog() {
        const modal = document.getElementById('name-modal');
        modal.classList.add('hidden');
        this.currentSaveSlot = null;
    }

    openDeleteDialog(slotId, saveName) {
        this.currentDeleteSlot = slotId;
        const modal = document.getElementById('delete-modal');
        const message = document.getElementById('delete-message');
        message.textContent = `Are you sure you want to delete "${saveName}"? This cannot be undone.`;
        modal.classList.remove('hidden');
    }

    closeDeleteDialog() {
        const modal = document.getElementById('delete-modal');
        modal.classList.add('hidden');
        this.currentDeleteSlot = null;
    }

    // Save/Load Operations
    promptSaveName(slotId) {
        this.openNameDialog(slotId);
    }

    confirmSaveName() {
        const input = document.getElementById('name-input');
        const saveName = input.value.trim() || `Save ${Date.now()}`;
        
        if (this.currentSaveSlot) {
            this.saveToSlot(this.currentSaveSlot, saveName);
            this.closeNameDialog();
        }
    }

    saveToSlot(slotId, saveName) {
        console.log('🔍 [SAVE DEBUG] Starting save to slot', slotId, 'with name:', saveName);
        try {
            const state = this.captureCurrentState();
            console.log('🔍 [SAVE DEBUG] State captured:', state);
            console.log('🔍 [SAVE DEBUG] State size:', JSON.stringify(state).length, 'characters');
            
            state.saveName = saveName;
            state.slotId = slotId;
            
            const key = `uma_save_slot_${slotId}`;
            const jsonString = JSON.stringify(state);
            console.log('🔍 [SAVE DEBUG] JSON string length:', jsonString.length);
            console.log('🔍 [SAVE DEBUG] Attempting to save to localStorage with key:', key);
            
            localStorage.setItem(key, jsonString);
            console.log('✅ [SAVE DEBUG] Save successful!');
            
            // Verify save
            const verification = localStorage.getItem(key);
            console.log('🔍 [SAVE DEBUG] Verification - data retrieved:', verification ? 'YES' : 'NO');
            
            this.showToast(`💾 Saved to Slot ${slotId}: ${saveName}`, 'success');
            this.closeSaveDialog();
        } catch (error) {
            console.error('❌ [SAVE DEBUG] Save failed with error:', error);
            console.error('❌ [SAVE DEBUG] Error name:', error.name);
            console.error('❌ [SAVE DEBUG] Error message:', error.message);
            console.error('❌ [SAVE DEBUG] localStorage available?', typeof localStorage !== 'undefined');
            
            // Check localStorage quota
            try {
                let total = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        total += localStorage[key].length + key.length;
                    }
                }
                console.error('❌ [SAVE DEBUG] Current localStorage usage:', total, 'characters');
            } catch (e) {
                console.error('❌ [SAVE DEBUG] Could not check localStorage usage');
            }
            
            this.showToast('❌ Save failed. Storage might be full.', 'error');
        }
    }

    confirmLoadSlot(slotId) {
        const saveData = this.loadSaveData(slotId);
        if (!saveData) {
            this.showToast('❌ No save data found in this slot.', 'error');
            return;
        }

        // Simple confirmation
        const saveName = saveData.saveName || 'Unnamed Save';
        if (confirm(`Load "${saveName}"?\n\nThis will replace your current progress.`)) {
            this.loadFromSlot(slotId);
        }
    }

    loadFromSlot(slotId) {
        try {
            const saveData = this.loadSaveData(slotId);
            if (!saveData) {
                this.showToast('❌ No save data found.', 'error');
                return;
            }

            this.restoreState(saveData);
            this.showToast(`📂 Loaded: ${saveData.saveName || 'Save ' + slotId}`, 'success');
            this.closeLoadDialog();
        } catch (error) {
            console.error('Load failed:', error);
            this.showToast('❌ Load failed. Save data may be corrupted.', 'error');
        }
    }

    loadSaveData(slotId) {
        const key = `uma_save_slot_${slotId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    renameSlot(slotId) {
        const saveData = this.loadSaveData(slotId);
        if (!saveData) return;

        const currentName = saveData.saveName || 'Unnamed Save';
        const modal = document.getElementById('name-modal');
        const input = document.getElementById('name-input');
        
        input.value = currentName;
        input.select();
        this.currentSaveSlot = slotId;
        
        modal.classList.remove('hidden');
        
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const newName = input.value.trim() || currentName;
                saveData.saveName = newName;
                const key = `uma_save_slot_${slotId}`;
                localStorage.setItem(key, JSON.stringify(saveData));
                this.closeNameDialog();
                this.showToast(`✏️ Renamed to: ${newName}`, 'success');
                this.renderSaveSlots();
                this.renderLoadSlots();
            } else if (e.key === 'Escape') {
                this.closeNameDialog();
            }
        };
    }

    confirmDeleteSlot(slotId) {
        const saveData = this.loadSaveData(slotId);
        if (!saveData) return;

        const saveName = saveData.saveName || `Slot ${slotId}`;
        this.openDeleteDialog(slotId, saveName);
    }

    executeDelete() {
        if (this.currentDeleteSlot) {
            const key = `uma_save_slot_${this.currentDeleteSlot}`;
            localStorage.removeItem(key);
            
            this.showToast(`🗑️ Deleted save slot ${this.currentDeleteSlot}`, 'success');
            this.closeDeleteDialog();
            this.renderSaveSlots();
            this.renderLoadSlots();
        }
    }

    getAllSaves() {
        const saves = [];
        for (let i = 1; i <= 3; i++) {
            const save = this.loadSaveData(i);
            if (save) {
                saves.push({ slotId: i, ...save });
            }
        }
        return saves;
    }

    // State Management
    captureCurrentState() {
        console.log('🔍 [STATE DEBUG] Capturing current state...');
        console.log('🔍 [STATE DEBUG] selectedRaces:', this.selectedRaces);
        console.log('🔍 [STATE DEBUG] wonRaces:', this.wonRaces);
        console.log('🔍 [STATE DEBUG] lostRaces:', this.lostRaces);
        console.log('🔍 [STATE DEBUG] plannerData:', this.plannerData);
        console.log('🔍 [STATE DEBUG] trackedFactorId:', this.trackedFactorId);
        
        const state = {
            version: this.STORAGE_VERSION,
            timestamp: Date.now(),
            metadata: {
                racesRun: this.selectedRaces.size,
                wins: this.wonRaces.size,
                losses: this.lostRaces.size,
                factorsCompleted: this.getCompletedFactorCount(),
                lastModified: new Date().toISOString()
            },
            selections: {
                selectedRaces: Array.from(this.selectedRaces),
                wonRaces: Array.from(this.wonRaces),
                lostRaces: Array.from(this.lostRaces)
            },
            planner: this.plannerData,
            tracking: {
                trackedFactorId: this.trackedFactorId
            }
        };
        
        console.log('✅ [STATE DEBUG] State captured successfully');
        return state;
    }

    restoreState(state) {
        // Validate version compatibility
        if (!this.isCompatibleVersion(state.version)) {
            throw new Error('Incompatible save version');
        }

        // Restore selections
        this.selectedRaces = new Set(state.selections.selectedRaces);
        this.wonRaces = new Set(state.selections.wonRaces);
        this.lostRaces = new Set(state.selections.lostRaces);

        // Restore planner
        this.plannerData = state.planner;

        // Restore tracking
        this.trackedFactorId = state.tracking.trackedFactorId || null;

        // Re-render everything
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }

    getCompletedFactorCount() {
        return this.hiddenFactors.filter(f => {
            const check = f.check(); // Each factor has its own check() method
            return check.completed;
        }).length;
    }

    isCompatibleVersion(version) {
        const [major] = version.split('.');
        const [currentMajor] = this.STORAGE_VERSION.split('.');
        return major === currentMajor;
    }

    // Share Functionality
    generateShareURL() {
        console.log('🔍 [SHARE DEBUG] Starting share URL generation');
        try {
            // Check if LZString is available
            console.log('🔍 [SHARE DEBUG] LZString available?', typeof LZString !== 'undefined');
            if (typeof LZString === 'undefined') {
                console.error('❌ [SHARE DEBUG] LZString library not loaded!');
                this.showToast('❌ Compression library not loaded', 'error');
                return;
            }
            
            const state = this.captureCurrentState();
            console.log('🔍 [SHARE DEBUG] State captured:', state);
            
            const json = JSON.stringify(state);
            console.log('🔍 [SHARE DEBUG] JSON length:', json.length);
            console.log('🔍 [SHARE DEBUG] JSON preview:', json.substring(0, 200));
            
            const compressed = LZString.compressToEncodedURIComponent(json);
            console.log('🔍 [SHARE DEBUG] Compressed length:', compressed.length);
            console.log('🔍 [SHARE DEBUG] Compression ratio:', ((compressed.length / json.length) * 100).toFixed(2) + '%');
            
            const baseUrl = window.location.origin + window.location.pathname;
            console.log('🔍 [SHARE DEBUG] Base URL:', baseUrl);
            
            const shareUrl = `${baseUrl}?state=${compressed}`;
            console.log('🔍 [SHARE DEBUG] Final share URL length:', shareUrl.length);
            console.log('🔍 [SHARE DEBUG] Share URL:', shareUrl.substring(0, 100) + '...');

            // Update UI
            const urlInput = document.getElementById('share-url-input');
            if (!urlInput) {
                console.error('❌ [SHARE DEBUG] share-url-input element not found!');
                return;
            }
            
            urlInput.value = shareUrl;
            console.log('🔍 [SHARE DEBUG] URL input value set:', urlInput.value.substring(0, 100));
            
            document.getElementById('share-stat-races').textContent = state.metadata.racesRun;
            document.getElementById('share-stat-wins').textContent = state.metadata.wins;
            document.getElementById('share-stat-factors').textContent = state.metadata.factorsCompleted;
            
            console.log('✅ [SHARE DEBUG] Share URL generated successfully');
        } catch (error) {
            console.error('❌ [SHARE DEBUG] Share URL generation failed:', error);
            console.error('❌ [SHARE DEBUG] Error name:', error.name);
            console.error('❌ [SHARE DEBUG] Error message:', error.message);
            console.error('❌ [SHARE DEBUG] Stack trace:', error.stack);
            this.showToast('❌ Failed to generate share URL', 'error');
        }
    }

    copyShareURL() {
        console.log('🔍 [COPY DEBUG] Starting copy to clipboard');
        const input = document.getElementById('share-url-input');
        
        if (!input) {
            console.error('❌ [COPY DEBUG] share-url-input element not found!');
            return;
        }
        
        console.log('🔍 [COPY DEBUG] Input value:', input.value);
        console.log('🔍 [COPY DEBUG] Input value length:', input.value.length);
        
        if (!input.value || input.value.length === 0) {
            console.error('❌ [COPY DEBUG] Input value is empty!');
            this.showToast('❌ No URL to copy', 'error');
            return;
        }
        
        input.select();
        
        console.log('🔍 [COPY DEBUG] Attempting to copy with navigator.clipboard');
        navigator.clipboard.writeText(input.value).then(() => {
            console.log('✅ [COPY DEBUG] Copy successful!');
            console.log('💡 [COPY DEBUG] IMPORTANT: Make sure to paste the ENTIRE URL (all ' + input.value.length + ' characters)');
            this.showToast('📋 URL copied! Make sure to paste the ENTIRE link', 'success');
        }).catch(err => {
            console.error('❌ [COPY DEBUG] Copy failed:', err);
            console.error('❌ [COPY DEBUG] Error details:', err.message);
            
            // Fallback to older method
            console.log('🔍 [COPY DEBUG] Trying fallback copy method...');
            try {
                input.select();
                document.execCommand('copy');
                console.log('✅ [COPY DEBUG] Fallback copy successful!');
                this.showToast('📋 URL copied! Paste the ENTIRE link', 'success');
            } catch (fallbackErr) {
                console.error('❌ [COPY DEBUG] Fallback copy also failed:', fallbackErr);
                this.showToast('❌ Failed to copy URL', 'error');
            }
        });
    }

    decodeURLState() {
        const params = new URLSearchParams(window.location.search);
        const compressed = params.get('state');
        if (!compressed) return null;

        console.log('🔍 [DECODE DEBUG] Compressed string length:', compressed.length);
        console.log('🔍 [DECODE DEBUG] Compressed string:', compressed.substring(0, 100) + '...');

        try {
            const json = LZString.decompressFromEncodedURIComponent(compressed);
            console.log('🔍 [DECODE DEBUG] Decompressed JSON length:', json ? json.length : 0);
            console.log('🔍 [DECODE DEBUG] Decompressed JSON preview:', json ? json.substring(0, 200) : 'null');
            
            if (!json || json === 'null') {
                console.error('❌ [DECODE DEBUG] Decompression returned null - URL may be truncated or corrupted');
                this.showToast('❌ Invalid or incomplete share URL', 'error');
                return null;
            }
            
            const parsed = JSON.parse(json);
            console.log('✅ [DECODE DEBUG] Successfully parsed shared state');
            return parsed;
        } catch (e) {
            console.error('❌ [DECODE DEBUG] Failed to decode shared state:', e);
            console.error('❌ [DECODE DEBUG] This usually means the URL was truncated. Make sure you copy the ENTIRE URL!');
            this.showToast('❌ Invalid share URL - URL may be incomplete', 'error');
            return null;
        }
    }

    initializeFromURL() {
        console.log('🔍 [INIT DEBUG] Checking for shared state in URL...');
        console.log('🔍 [INIT DEBUG] Current URL:', window.location.href);
        
        const sharedState = this.decodeURLState();
        
        if (sharedState) {
            console.log('🔍 [INIT DEBUG] Shared state found in URL:', sharedState);
            this.restoreState(sharedState);
            const saveName = sharedState.saveName || 'Shared Save';
            this.showToast(`🔗 Loaded shared state: ${saveName}`, 'success');
            // Clean URL after loading
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('✅ [INIT DEBUG] Shared state loaded and URL cleaned');
        } else {
            console.log('🔍 [INIT DEBUG] No shared state in URL');
        }
    }

    // UI Rendering
    renderSaveSlots() {
        const container = document.getElementById('save-slots-grid');
        container.innerHTML = '';

        for (let slotId = 1; slotId <= 3; slotId++) {
            const saveData = this.loadSaveData(slotId);
            container.innerHTML += this.renderSaveSlot(slotId, saveData);
        }
    }

    renderLoadSlots() {
        const container = document.getElementById('load-slots-grid');
        container.innerHTML = '';

        for (let slotId = 1; slotId <= 3; slotId++) {
            const saveData = this.loadSaveData(slotId);
            container.innerHTML += this.renderLoadSlot(slotId, saveData);
        }
    }

    renderSaveSlot(slotId, saveData) {
        const isEmpty = !saveData;
        const timestamp = saveData ? new Date(saveData.timestamp).toLocaleString() : '';
        const meta = saveData ? saveData.metadata : null;
        const saveName = saveData ? saveData.saveName || 'Unnamed Save' : '';

        return `
            <div class="save-slot-card ${isEmpty ? 'empty' : 'filled'}" data-slot="${slotId}">
                <div class="slot-header">
                    <span class="slot-number">Slot ${slotId}</span>
                    ${!isEmpty ? `
                        <div class="slot-actions">
                            <button class="btn-rename-slot" onclick="tracker.renameSlot(${slotId}); event.stopPropagation();" title="Rename">✏️</button>
                            <button class="btn-delete-slot" onclick="tracker.confirmDeleteSlot(${slotId}); event.stopPropagation();" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                </div>
                <div class="slot-body" onclick="tracker.${isEmpty ? 'promptSaveName' : 'promptSaveName'}(${slotId})">
                    ${isEmpty ? `
                        <div class="empty-slot">
                            <div class="plus-icon">＋</div>
                            <div>Click to save here</div>
                            <div class="jp-text">ここに保存</div>
                        </div>
                    ` : `
                        <div class="slot-info">
                            <div class="slot-name">${saveName}</div>
                            <div class="slot-timestamp">${timestamp}</div>
                            <div class="slot-stats">
                                <span>🏇 ${meta.racesRun}</span>
                                <span>🏆 ${meta.wins}</span>
                                <span>✅ ${meta.factorsCompleted}</span>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    renderLoadSlot(slotId, saveData) {
        const isEmpty = !saveData;
        const timestamp = saveData ? new Date(saveData.timestamp).toLocaleString() : '';
        const meta = saveData ? saveData.metadata : null;
        const saveName = saveData ? saveData.saveName || 'Unnamed Save' : '';

        return `
            <div class="save-slot-card ${isEmpty ? 'empty' : 'filled'}" data-slot="${slotId}">
                <div class="slot-header">
                    <span class="slot-number">Slot ${slotId}</span>
                    ${!isEmpty ? `
                        <div class="slot-actions">
                            <button class="btn-delete-slot" onclick="tracker.confirmDeleteSlot(${slotId}); event.stopPropagation();" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                </div>
                <div class="slot-body" onclick="${isEmpty ? '' : `tracker.confirmLoadSlot(${slotId})`}">
                    ${isEmpty ? `
                        <div class="empty-slot">
                            <div style="color: #cbd5e0;">Empty Slot</div>
                            <div class="jp-text">空のスロット</div>
                        </div>
                    ` : `
                        <div class="slot-info">
                            <div class="slot-name">${saveName}</div>
                            <div class="slot-timestamp">${timestamp}</div>
                            <div class="slot-stats">
                                <span>🏇 ${meta.racesRun}</span>
                                <span>🏆 ${meta.wins}</span>
                                <span>✅ ${meta.factorsCompleted}</span>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // Utilities
    showToast(message, type = 'success') {
        // Remove existing toasts
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the tracker when the page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 [STARTUP DEBUG] ==================== PAGE LOAD ====================');
    console.log('🔍 [STARTUP DEBUG] Checking system requirements...');
    console.log('🔍 [STARTUP DEBUG] localStorage available?', typeof localStorage !== 'undefined');
    console.log('🔍 [STARTUP DEBUG] LZString loaded?', typeof LZString !== 'undefined');
    
    if (typeof LZString !== 'undefined') {
        console.log('✅ [STARTUP DEBUG] LZString library loaded successfully');
        console.log('🔍 [STARTUP DEBUG] LZString methods:', Object.keys(LZString));
    } else {
        console.error('❌ [STARTUP DEBUG] LZString library NOT loaded! Share feature will not work.');
    }
    
    console.log('🔍 [STARTUP DEBUG] Initializing UmaMusumeTracker...');
    tracker = new UmaMusumeTracker();
    console.log('✅ [STARTUP DEBUG] UmaMusumeTracker initialized');
    
    // Check for shared state in URL
    tracker.initializeFromURL();
    
    console.log('🔍 [STARTUP DEBUG] ==================== READY ====================');
});