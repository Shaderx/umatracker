// Race data and hidden factors
class UmaMusumeTracker {
    constructor() {
        this.races = [];
        this.hiddenFactors = [];
        this.selectedRaces = new Set();
        this.wonRaces = new Set();
        this.lostRaces = new Set();
        this.currentFilter = 'all';
        
        this.initializeData();
        this.setupEventListeners();
        this.renderRaces();
        this.updateProgress();
    }

    initializeData() {
        // Distance categories (in meters)
        this.distanceCategories = {
            short: race => parseInt(race.length.replace(/[^\d]/g, '')) <= 1400,
            mile: race => {
                const length = parseInt(race.length.replace(/[^\d]/g, ''));
                return length >= 1500 && length <= 1700;
            },
            medium: race => {
                const length = parseInt(race.length.replace(/[^\d]/g, ''));
                return length >= 1800 && length <= 2200;
            },
            long: race => parseInt(race.length.replace(/[^\d]/g, '')) >= 2300
        };

        // Eastern Japan tracks
        this.easternTracks = ['Tokyo', 'Nakayama (Chiba)', 'Niigata', 'Fukushima'];
        
        // Western Japan tracks  
        this.westernTracks = ['Kyoto', 'Hanshin (Takarazuka)', 'Chukyou (Nagoya)', 'Kokura (Kitakyushu)', 'Sapporo', 'Hakodate'];

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
        // Parse CSV data from RaceComplete.csv
        this.races = this.parseCSVData();
    }

    parseCSVData() {
        // CSV data from RaceComplete.csv - representative sample
        const csvData = `函館ジュニアステークス,Hakodate Junior Stakes,6月後半,1年目,ジュニア,,,G3,函館,芝,1200m,短距離,右,,,
中京ジュニアステークス,Chukyo Junior Stakes,7月後半,1年目,ジュニア,,,OP,中京,芝,1600m,マイル,左,,,
朝日杯フューチュリティステークス,Asahi Hai Futurity Stakes,12月前半,1年目,ジュニア,,,G1,阪神,芝,1600m,マイル,右,外,,
阪神ジュベナイルフィリーズ,Hanshin Juvenile Fillies,12月前半,1年目,ジュニア,,,G1,阪神,芝,1600m,マイル,右,外,,
ホープフルステークス,Hopeful Stakes,12月後半,1年目,ジュニア,,,G1,中山,芝,2000m,中距離,右,内,,
京成杯,Keisei Hai,1月前半,2年目,,クラシック,,G3,中山,芝,2000m,中距離,右,内,,
フェアリーステークス,Fairy Stakes,1月前半,2年目,,クラシック,,G3,中山,芝,1600m,マイル,右,外,,
シンザン記念,Shinzan Kinen,1月前半,2年目,,クラシック,,G3,京都,芝,1600m,マイル,右,外,,
皐月賞,Satsuki Sho,4月前半,2年目,,クラシック,,G1,中山,芝,2000m,中距離,右,内,,
桜花賞,Oka Sho,4月前半,2年目,,クラシック,,G1,阪神,芝,1600m,マイル,右,外,,
NHKマイルカップ,NHK Mile Cup,5月前半,2年目,,クラシック,,G1,東京,芝,1600m,マイル,左,,,
日本ダービー,Japan Derby,5月後半,2年目,,クラシック,,G1,東京,芝,2400m,中距離,左,,,
オークス,Oaks,5月後半,2年目,,クラシック,,G1,東京,芝,2400m,中距離,左,,,
安田記念,Yasuda Kinen,6月前半,2年目,,クラシック,シニア,G1,東京,芝,1600m,マイル,左,,,
宝塚記念,Takarazuka Kinen,6月後半,2年目,,クラシック,シニア,G1,阪神,芝,2200m,中距離,右,内,,
スプリンターズステークス,Sprinters Stakes,9月後半,2年目,,クラシック,シニア,G1,中山,芝,1200m,短距離,右,外,,
神戸新聞杯,Kobe Shimbun Hai,9月後半,2年目,,クラシック,,G2,阪神,芝,2400m,中距離,右,外,,
菊花賞,Kikka Sho,10月後半,2年目,,クラシック,,G1,京都,芝,3000m,長距離,右,外,,
秋華賞,Akika Sho,10月後半,2年目,,クラシック,,G1,京都,芝,2000m,中距離,右,内,,
天皇賞（秋）,Tenno Sho (Autumn),10月後半,2年目,,クラシック,シニア,G1,東京,芝,2000m,中距離,左,,,
エリザベス女王杯,Queen Elizabeth II Cup,11月前半,2年目,,クラシック,シニア,G1,京都,芝,2200m,中距離,右,外,,
ジャパンカップ,Japan Cup,11月後半,2年目,,クラシック,シニア,G1,東京,芝,2400m,中距離,左,,,
マイルチャンピオンシップ,Mile Championship,11月後半,2年目,,クラシック,シニア,G1,京都,芝,1600m,マイル,右,外,,
チャンピオンズカップ,Champions Cup,12月前半,2年目,,クラシック,シニア,G1,中京,ダート,1800m,マイル,左,,,
有馬記念,Arima Kinen,12月後半,2年目,,クラシック,シニア,G1,中山,芝,2500m,長距離,右,内,,
京都金杯,Kyoto Kinen,1月前半,3年目,,,シニア,G3,京都,芝,1600m,マイル,右,外,,
中山金杯,Nakayama Kinen,1月前半,3年目,,,シニア,G3,中山,芝,2000m,中距離,右,内,,
東京新聞杯,Tokyo Shimbun Hai,2月前半,3年目,,,シニア,G3,東京,芝,1600m,マイル,左,,,
フェブラリーステークス,February Stakes,2月後半,3年目,,,シニア,G1,東京,ダート,1600m,マイル,左,,,
高松宮記念,Takamatsunomiya Kinen,3月後半,3年目,,,シニア,G1,中京,芝,1200m,短距離,左,,,
大阪杯,Osaka Hai,3月後半,3年目,,,シニア,G1,阪神,芝,2000m,中距離,右,内,,
天皇賞（春）,Tenno Sho (Spring),4月後半,3年目,,,シニア,G1,京都,芝,3200m,長距離,右,外,,
ヴィクトリアマイル,Victoria Mile,5月前半,3年目,,,シニア,G1,東京,芝,1600m,マイル,左,,,
帝王賞,Teioh Sho,6月後半,3年目,,,シニア,G1,大井,ダート,2000m,中距離,右,,,
プロキオンステークス,Procyon Stakes,7月前半,3年目,,クラシック,シニア,G3,中京,ダート,1400m,短距離,左,,,
カペラステークス,Capella Stakes,12月前半,3年目,,クラシック,シニア,G3,中山,ダート,1200m,短距離,右,,,
セントウルステークス,Centaur Stakes,9月前半,3年目,,クラシック,シニア,G2,阪神,芝,1200m,短距離,右,内,,
ダイヤモンドステークス,Diamond Stakes,2月後半,3年目,,,シニア,G3,東京,芝,3400m,長距離,左,,,
ターコイズステークス,Turquoise Stakes,12月前半,3年目,,クラシック,シニア,G3,中山,芝,1600m,マイル,右,外,,
シルクロードステークス,Silk Road Stakes,1月後半,3年目,,,シニア,G3,京都,芝,1200m,短距離,右,内,,
オーシャンステークス,Ocean Stakes,3月前半,3年目,,,シニア,G3,中山,芝,1200m,短距離,右,外,,
アルデバランステークス,Aldebaran Stakes,2月前半,3年目,,,シニア,OP,京都,ダート,1900m,中距離,右,,,
リゲルステークス,Rigel Stakes,12月前半,3年目,,クラシック,シニア,OP,阪神,芝,1600m,マイル,右,外,,
ベテルギウスステークス,Betelgeuse Stakes,12月後半,3年目,,クラシック,シニア,OP,阪神,ダート,1800m,マイル,右,,,
京都新聞杯,Kyoto Shimbun Hai,5月前半,2年目,,クラシック,,G2,京都,芝,2200m,中距離,右,外,,
中日新聞杯,Chunichi Shimbun Hai,12月前半,3年目,,クラシック,シニア,G3,中京,芝,2000m,中距離,左,,,
弥生賞,Yayoi Sho,3月前半,2年目,,クラシック,,G2,中山,芝,2000m,中距離,右,内,,
スプリングステークス,Spring Stakes,3月後半,2年目,,クラシック,,G2,中山,芝,1800m,マイル,右,内,,
セントライト記念,Saint Lite Kinen,9月後半,2年目,,クラシック,,G2,中山,芝,2200m,中距離,右,外,,
チューリップ賞,Tulip Sho,3月前半,2年目,,クラシック,,G2,阪神,芝,1600m,マイル,右,外,,
フローラステークス,Flora Stakes,4月後半,2年目,,クラシック,,G2,東京,芝,2000m,中距離,左,,,
ローズステークス,Rose Stakes,9月前半,2年目,,クラシック,,G2,阪神,芝,1800m,マイル,右,外,,`;

        const lines = csvData.trim().split('\n');
        const races = [];
        
        // Parse each line of CSV data
        for (let i = 0; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 13) {
                const race = this.createRaceObject(values);
                if (race) {
                    races.push(race);
                }
            }
        }
        
        return races;
    }

    parseCSVLine(line) {
        return line.split(',');
    }

    createRaceObject(values) {
        const [nameJP, nameEN, date, year, junior, classics, senior, grade, location, ground, distance, distanceCategory, direction, innerOuter] = values;
        
        // Use English name if available, otherwise use Japanese name
        const name = nameEN.trim() || nameJP.trim();
        
        // Parse month and half from date (e.g., "6月後半" -> month: "June", half: "2nd")
        const monthHalf = this.parseDateString(date);
        
        // Convert grade format
        const type = this.convertGrade(grade);
        
        // Convert surface
        const surface = this.convertSurface(ground);
        
        // Convert track name
        const racetrack = this.convertTrackName(location);
        
        // Convert direction
        const convertedDirection = this.convertDirection(direction);
        
        // Determine season from month
        const season = this.getSeason(monthHalf.month);
        
        return {
            name: name,
            nameJP: nameJP.trim(),
            type: type,
            length: distance,
            surface: surface,
            racetrack: racetrack,
            junior: junior.trim() === 'ジュニア',
            classics: classics.trim() === 'クラシック',
            senior: senior.trim() === 'シニア',
            month: monthHalf.month,
            half: monthHalf.half,
            direction: convertedDirection,
            season: season
        };
    }

    parseDateString(dateStr) {
        const monthMap = {
            '1月': 'January', '2月': 'February', '3月': 'March', '4月': 'April',
            '5月': 'May', '6月': 'June', '7月': 'July', '8月': 'August',
            '9月': 'September', '10月': 'October', '11月': 'November', '12月': 'December'
        };
        
        const halfMap = {
            '前半': '1st',
            '後半': '2nd'
        };
        
        // Extract month and half from strings like "6月後半"
        const monthMatch = dateStr.match(/(\d+月)/);
        const halfMatch = dateStr.match(/(前半|後半)/);
        
        const month = monthMatch ? monthMap[monthMatch[1]] || 'January' : 'January';
        const half = halfMatch ? halfMap[halfMatch[1]] || '1st' : '1st';
        
        return { month, half };
    }

    convertGrade(grade) {
        const gradeMap = {
            'G1': 'GI',
            'G2': 'GII',
            'G3': 'GIII',
            'OP': 'Open',
            'Pre-OP': 'Pre-OP'
        };
        return gradeMap[grade] || grade;
    }

    convertSurface(ground) {
        const surfaceMap = {
            '芝': 'turf',
            'ダート': 'dirt'
        };
        return surfaceMap[ground] || ground;
    }

    convertTrackName(location) {
        const trackMap = {
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
        };
        return trackMap[location] || location;
    }

    convertDirection(direction) {
        const directionMap = {
            '右': 'right',
            '左': 'left',
            '直線': 'straight'
        };
        return directionMap[direction] || direction;
    }

    getSeason(month) {
        const seasonMap = {
            'December': 'winter', 'January': 'winter', 'February': 'winter',
            'March': 'spring', 'April': 'spring', 'May': 'spring',
            'June': 'summer', 'July': 'summer', 'August': 'summer',
            'September': 'autumn', 'October': 'autumn', 'November': 'autumn'
        };
        return seasonMap[month] || 'spring';
    }

    loadHiddenFactors() {
        this.hiddenFactors = [
            {
                id: 'consecutive_wins',
                nameJP: '連戦連勝',
                nameEN: 'Consecutive Wins',
                conditionJP: '2戦以上の連続出走で勝利する。',
                conditionEN: 'Win 2 or more consecutive races.',
                check: () => this.checkConsecutiveWins()
            },
            {
                id: 'champion_east',
                nameJP: '東の雄',
                nameEN: 'Champion of the East',
                conditionJP: '東日本（東京、中山など）のG1レースで7勝以上する。',
                conditionEN: 'Win 7 or more G1 races held at tracks in eastern Japan (e.g., Tokyo, Nakayama).',
                check: () => this.checkEasternG1Wins()
            },
            {
                id: 'champion_west',
                nameJP: '西の雄',
                nameEN: 'Champion of the West',
                conditionJP: '西日本（京都、阪神など）のG1レースで7勝以上する。',
                conditionEN: 'Win 7 or more G1 races held at tracks in western Japan (e.g., Kyoto, Hanshin).',
                check: () => this.checkWesternG1Wins()
            },
            {
                id: 'traveler',
                nameJP: '旅人',
                nameEN: 'Traveler',
                conditionJP: '7種類以上のレース場に出走する（勝利は不問）。',
                conditionEN: 'Compete at 7 or more different racecourses. Winning is not a requirement.',
                check: () => this.checkDifferentRacecourses()
            },
            {
                id: 'all_ranks_conquered',
                nameJP: '全階級制覇',
                nameEN: 'All Ranks Conquered',
                conditionJP: '短距離、マイル、中距離、長距離のG1全てで1回以上勝利する。',
                conditionEN: 'Win at least one G1 race in each distance category: Short, Mile, Medium, and Long.',
                check: () => this.checkAllDistanceG1()
            },
            {
                id: 'newspaper_boy',
                nameJP: '新聞屋さん',
                nameEN: 'Newspaper Boy/Girl',
                conditionJP: '指定された4つの「新聞杯」レース（京都新聞杯、神戸新聞杯、中日新聞杯、東京新聞杯）に勝利する。',
                conditionEN: 'Win the four "Shimbun Hai" races: Kyoto, Kobe, Chunichi, and Tokyo Shimbun Hai.',
                check: () => this.checkNewspaperCups()
            },
            {
                id: 'years_plan',
                nameJP: '一年の計は',
                nameEN: "The Year's Plan",
                conditionJP: 'シニア級1月前半の中山金杯か京都金杯で勝利する。',
                conditionEN: 'During the Senior year, win either the Nakayama Kinen or the Kyoto Kinen in January.',
                check: () => this.checkNewYearGold()
            },
            {
                id: 'wish_upon_star',
                nameJP: '星に願いを',
                nameEN: 'Wish Upon a Star',
                conditionJP: '指定された星・星座関連の名前を持つレースの中から3勝以上する。',
                conditionEN: 'Win 3 or more races from the designated list of star or constellation-themed races.',
                check: () => this.checkStarRaces()
            },
            {
                id: 'jewelry',
                nameJP: 'ジュエリー',
                nameEN: 'Jewelry',
                conditionJP: '指定された宝石の名前を持つレースの中から3勝以上する（同名レースの重複は不可）。',
                conditionEN: 'Win 3 or more races from the designated list of jewelry-themed races.',
                check: () => this.checkJewelryRaces()
            },
            {
                id: 'dual_wielder',
                nameJP: '二刀流',
                nameEN: 'Two-Sword Style / Dual Wielder',
                conditionJP: '芝とダートの両方のバ場適性をAにする。',
                conditionEN: "Achieve an 'A' rank aptitude for both Turf and Dirt surfaces.",
                check: () => this.checkDualSurface()
            },
            {
                id: 'perfect_crown',
                nameJP: 'パーフェクトクラウン',
                nameEN: 'Perfect Crown',
                conditionJP: '牡馬三冠レース（皐月賞、日本ダービー、菊花賞）と、各レースに対応するトライアルレース3つに勝利する。',
                conditionEN: 'Win the three Triple Crown races (Satsuki Sho, Japan Derby, Kikka Sho) AND win one trial race for each.',
                check: () => this.checkPerfectCrown()
            },
            {
                id: 'perfect_tiara',
                nameJP: 'パーフェクトティアラ',
                nameEN: 'Perfect Tiara',
                conditionJP: '牝馬三冠レース（桜花賞、オークス、秋華賞）と、各レースに対応するトライアルレース3つに勝利する。',
                conditionEN: 'Win the three Triple Tiara races (Oka Sho, Oaks, Akika Sho) AND win one trial race for each.',
                check: () => this.checkPerfectTiara()
            },
            {
                id: 'improves_with_racing',
                nameJP: '叩き良化型',
                nameEN: 'Improves with Racing',
                conditionJP: '2戦以上の連続出走。',
                conditionEN: 'Compete in 2 or more consecutive races.',
                check: () => this.checkImprovesWithRacing()
            },
            {
                id: 'rebellious_spirit',
                nameJP: '反骨精神',
                nameEN: 'Rebellious Spirit',
                conditionJP: '適性D以下のレース（距離またはバ場）で勝利する。',
                conditionEN: "Win a race with a 'D' rank or lower aptitude for either the distance or the surface.",
                check: () => this.checkRebelliousSpirit()
            },
            {
                id: 'right_awakening',
                nameJP: '右の目覚め',
                nameEN: 'Right Awakening',
                conditionJP: '右回りのレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races on right-handed tracks.',
                check: () => this.checkDirectionalAwakening('right')
            },
            {
                id: 'left_awakening',
                nameJP: '左の目覚め',
                nameEN: 'Left Awakening',
                conditionJP: '左回りのレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races on left-handed tracks.',
                check: () => this.checkDirectionalAwakening('left')
            },
            {
                id: 'spring_awakening',
                nameJP: '春の目覚め',
                nameEN: 'Spring Awakening',
                conditionJP: '春の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during spring.',
                check: () => this.checkSeasonalAwakening('spring')
            },
            {
                id: 'summer_awakening',
                nameJP: '夏の目覚め',
                nameEN: 'Summer Awakening',
                conditionJP: '夏の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during summer.',
                check: () => this.checkSeasonalAwakening('summer')
            },
            {
                id: 'autumn_awakening',
                nameJP: '秋の目覚め',
                nameEN: 'Autumn Awakening',
                conditionJP: '秋の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during autumn.',
                check: () => this.checkSeasonalAwakening('autumn')
            },
            {
                id: 'winter_awakening',
                nameJP: '冬の目覚め',
                nameEN: 'Winter Awakening',
                conditionJP: '冬の季節のレースで6回以上勝利する。',
                conditionEN: 'Win 6 or more races during winter.',
                check: () => this.checkSeasonalAwakening('winter')
            }
        ];
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderRaces();
            });
        });
    }

    renderRaces() {
        const grid = document.getElementById('races-grid');
        const filteredRaces = this.getFilteredRaces();
        
        grid.innerHTML = filteredRaces.map(race => `
            <div class="race-card ${this.selectedRaces.has(race.name) ? 'selected' : ''} ${this.wonRaces.has(race.name) ? 'won' : ''}" 
                 data-race="${race.name}" onclick="tracker.toggleParticipation('${race.name}')">
                <div class="race-name">
                    <div class="race-name-en">${race.name}</div>
                    <div class="race-name-jp">${race.nameJP}</div>
                </div>
                <div class="race-details">
                    <span class="race-grade grade-${race.type}">${race.type}</span>
                    ${race.length} • ${race.surface}/${this.translations.surfaces[race.surface] || race.surface} • ${race.racetrack}/${this.translations.tracks[race.racetrack] || race.racetrack}
                </div>
                <div class="race-details">
                    ${race.month}/${this.translations.months[race.month] || race.month} ${race.half}/${this.translations.halves[race.half] || race.half}
                    ${race.direction ? `• ${race.direction}/${this.translations.directions[race.direction]}` : ''}
                    ${race.season ? `• ${race.season}/${this.translations.seasons[race.season]}` : ''}
                    ${race.series ? `• ${race.series}` : ''}
                </div>
                <div class="race-details">
                    ${race.classics ? `• Classic/${this.translations.types['Classic']}` : ''}
                    ${race.senior ? `• Senior/${this.translations.types['Senior']}` : ''}
                    ${race.junior ? `• Junior/${this.translations.types['Junior']}` : ''}
                    ${race.trial_for ? `• Trial for ${race.trial_for}` : ''}
                </div>
                ${this.selectedRaces.has(race.name) ? `
                <div class="win-button-container">
                    <button class="loss-toggle-btn ${this.lostRaces.has(race.name) ? 'lost' : 'won'}" 
                            onclick="event.stopPropagation(); tracker.toggleWin('${race.name}')">
                        ${this.lostRaces.has(race.name) ? '❌' : '🏆→❌'}
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('');
    }

    getFilteredRaces() {
        switch(this.currentFilter) {
            case 'GI':
                return this.races.filter(race => race.type === 'GI');
            case 'classic':
                return this.races.filter(race => race.classics);
            case 'senior':
                return this.races.filter(race => race.senior);
            case 'selected':
                return this.races.filter(race => this.selectedRaces.has(race.name));
            default:
                return this.races;
        }
    }

    toggleParticipation(raceName) {
        if (this.selectedRaces.has(raceName)) {
            // Remove participation and clear all results
            this.selectedRaces.delete(raceName);
            this.wonRaces.delete(raceName);
            this.lostRaces.delete(raceName);
        } else {
            // Add participation and automatically mark as won
            this.selectedRaces.add(raceName);
            this.wonRaces.add(raceName);
        }
        this.renderRaces();
        this.updateProgress();
    }

    toggleWin(raceName) {
        if (!this.selectedRaces.has(raceName)) return; // Can't win/lose if not participating
        
        // Toggle between Won and Lost
        if (this.wonRaces.has(raceName)) {
            // Currently won, change to lost
            this.wonRaces.delete(raceName);
            this.lostRaces.add(raceName);
        } else if (this.lostRaces.has(raceName)) {
            // Currently lost, change to won
            this.lostRaces.delete(raceName);
            this.wonRaces.add(raceName);
        }
        this.renderRaces();
        this.updateProgress();
    }

    clearAll() {
        this.selectedRaces.clear();
        this.wonRaces.clear();
        this.lostRaces.clear();
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
    }

    renderHiddenFactors(results) {
        const container = document.getElementById('hidden-factors');
        
        container.innerHTML = results.map(factor => {
            const statusClass = factor.result.completed ? 'completed' : 
                               factor.result.progress > 0 ? 'partial' : '';
            const progressPercentage = Math.min(100, (factor.result.current / factor.result.required) * 100);
            
            return `
                <div class="factor-item ${statusClass}">
                    <div class="factor-name">
                        <div class="factor-name-en">${factor.nameEN}</div>
                        <div class="factor-name-jp">${factor.nameJP}</div>
                        ${factor.result.completed ? '<div class="completion-badge">✅</div>' : ''}
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
    }

    // Condition checking methods
    checkConsecutiveWins() {
        // This would need race order tracking - simplified for demo
        const wins = Array.from(this.wonRaces);
        return {
            completed: wins.length >= 2,
            current: Math.min(wins.length, 2),
            required: 2,
            progress: wins.length >= 2 ? 100 : (wins.length / 2) * 100,
            details: wins.length >= 2 ? 'Need consecutive wins (simplified)' : ''
        };
    }

    checkEasternG1Wins() {
        const easternG1Wins = Array.from(this.wonRaces).filter(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.type === 'GI' && this.easternTracks.includes(race.racetrack);
        });
        
        return {
            completed: easternG1Wins.length >= 7,
            current: easternG1Wins.length,
            required: 7,
            progress: (easternG1Wins.length / 7) * 100,
            details: `Eastern G1 wins: ${easternG1Wins.join(', ')}`
        };
    }

    checkWesternG1Wins() {
        const westernG1Wins = Array.from(this.wonRaces).filter(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.type === 'GI' && this.westernTracks.includes(race.racetrack);
        });
        
        return {
            completed: westernG1Wins.length >= 7,
            current: westernG1Wins.length,
            required: 7,
            progress: (westernG1Wins.length / 7) * 100,
            details: `Western G1 wins: ${westernG1Wins.join(', ')}`
        };
    }

    checkDifferentRacecourses() {
        const racecourses = new Set();
        this.selectedRaces.forEach(raceName => {
            const race = this.races.find(r => r.name === raceName);
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
        const distanceWins = { short: false, mile: false, medium: false, long: false };
        
        Array.from(this.wonRaces).forEach(raceName => {
            const race = this.races.find(r => r.name === raceName);
            if (race && race.type === 'GI') {
                Object.keys(distanceWins).forEach(category => {
                    if (this.distanceCategories[category](race)) {
                        distanceWins[category] = true;
                    }
                });
            }
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
        const newspaperRaces = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
        const wonNewspaperRaces = newspaperRaces.filter(race => this.wonRaces.has(race));
        
        return {
            completed: wonNewspaperRaces.length >= 4,
            current: wonNewspaperRaces.length,
            required: 4,
            progress: (wonNewspaperRaces.length / 4) * 100,
            details: `Won: ${wonNewspaperRaces.join(', ')}`
        };
    }

    checkNewYearGold() {
        const goldCups = ['Nakayama Kinen', 'Kyoto Kinen'];
        const wonGoldCups = goldCups.filter(race => this.wonRaces.has(race));
        
        return {
            completed: wonGoldCups.length >= 1,
            current: wonGoldCups.length,
            required: 1,
            progress: wonGoldCups.length >= 1 ? 100 : 0,
            details: `Won: ${wonGoldCups.join(', ')}`
        };
    }

    checkStarRaces() {
        const starRaces = ['Procyon Stakes', 'Capella Stakes', 'Centaur Stakes', 'Aldebaran Stakes', 'Rigel Stakes', 'Betelgeuse Stakes'];
        const wonStarRaces = starRaces.filter(race => this.wonRaces.has(race));
        
        return {
            completed: wonStarRaces.length >= 3,
            current: wonStarRaces.length,
            required: 3,
            progress: (wonStarRaces.length / 3) * 100,
            details: `Won: ${wonStarRaces.join(', ')}`
        };
    }

    checkJewelryRaces() {
        const jewelryRaces = ['Diamond Stakes', 'Turquoise Stakes'];
        const wonJewelryRaces = jewelryRaces.filter(race => this.wonRaces.has(race));
        
        return {
            completed: wonJewelryRaces.length >= 2,
            current: wonJewelryRaces.length,
            required: 2,
            progress: (wonJewelryRaces.length / 2) * 100,
            details: `Won: ${wonJewelryRaces.join(', ')}`
        };
    }

    checkDualSurface() {
        const turfWins = Array.from(this.wonRaces).some(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.surface === 'turf';
        });
        
        const dirtWins = Array.from(this.wonRaces).some(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.surface === 'dirt';
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
        const tripleCrownRaces = ['Satsuki Sho', 'Japan Derby', 'Kikka Sho'];
        const trialRaces = ['Yayoi Sho', 'Spring Stakes', 'Saint Lite Kinen'];
        
        const wonCrown = tripleCrownRaces.filter(race => this.wonRaces.has(race));
        const wonTrials = trialRaces.filter(race => this.wonRaces.has(race));
        
        const crownComplete = wonCrown.length === 3;
        const trialsComplete = wonTrials.length >= 3;
        const completed = crownComplete && trialsComplete;
        
        return {
            completed,
            current: wonCrown.length + wonTrials.length,
            required: 6,
            progress: completed ? 100 : ((wonCrown.length + wonTrials.length) / 6) * 100,
            details: `Crown: ${wonCrown.join(', ')} | Trials: ${wonTrials.join(', ')}`
        };
    }

    checkPerfectTiara() {
        const tripleTiaraRaces = ['Oka Sho', 'Oaks', 'Akika Sho'];
        const trialRaces = ['Tulip Sho', 'Flora Stakes', 'Rose Stakes'];
        
        const wonTiara = tripleTiaraRaces.filter(race => this.wonRaces.has(race));
        const wonTrials = trialRaces.filter(race => this.wonRaces.has(race));
        
        const tiaraComplete = wonTiara.length === 3;
        const trialsComplete = wonTrials.length >= 3;
        const completed = tiaraComplete && trialsComplete;
        
        return {
            completed,
            current: wonTiara.length + wonTrials.length,
            required: 6,
            progress: completed ? 100 : ((wonTiara.length + wonTrials.length) / 6) * 100,
            details: `Tiara: ${wonTiara.join(', ')} | Trials: ${wonTrials.join(', ')}`
        };
    }

    checkImprovesWithRacing() {
        // Simplified: just check if participated in 2+ races
        const participated = this.selectedRaces.size;
        
        return {
            completed: participated >= 2,
            current: participated,
            required: 2,
            progress: (participated / 2) * 100,
            details: `Participated in ${participated} races (consecutive tracking simplified)`
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
        const directionalWins = Array.from(this.wonRaces).filter(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.direction === direction;
        });
        
        return {
            completed: directionalWins.length >= 6,
            current: directionalWins.length,
            required: 6,
            progress: (directionalWins.length / 6) * 100,
            details: `${direction}-handed wins: ${directionalWins.join(', ')}`
        };
    }

    checkSeasonalAwakening(season) {
        const seasonalWins = Array.from(this.wonRaces).filter(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.season === season;
        });
        
        return {
            completed: seasonalWins.length >= 6,
            current: seasonalWins.length,
            required: 6,
            progress: (seasonalWins.length / 6) * 100,
            details: `${season} wins: ${seasonalWins.join(', ')}`
        };
    }
}

// Initialize the tracker when the page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new UmaMusumeTracker();
});