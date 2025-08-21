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
                'Fukushima': '福島'
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
        // Sample of race data from CSV - in a real app you'd load this from the CSV file
        this.races = [
            // January races
            { name: "Junior Cup", nameJP: "ジュニアカップ", type: "Open", length: "1,600 m", surface: "turf", 
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "January", half: "1st", direction: "right", season: "winter" },
            { name: "Fairy Stakes", nameJP: "フェアリーステークス", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "January", half: "1st", direction: "right", season: "winter" },
            { name: "Kyoto Kinpai", nameJP: "京都金杯", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: false, senior: true, month: "January", half: "1st", direction: "right", season: "winter" },
            { name: "Nakayama Kinpai", nameJP: "中山金杯", type: "GIII", length: "2,000 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: false, senior: true, month: "January", half: "1st", direction: "right", season: "winter" },
            
            // February races  
            { name: "Tokyo Shinbun Hai", nameJP: "東京新聞杯", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: false, senior: true, month: "February", half: "1st", direction: "left", season: "winter" },
            { name: "February Stakes", nameJP: "フェブラリーステークス", type: "GI", length: "1,600 m", surface: "dirt",
              racetrack: "Tokyo", junior: false, classics: false, senior: true, month: "February", half: "2nd", direction: "left", season: "winter" },

            // March races
            { name: "Takamatsunomiya Kinen", nameJP: "高松宮記念", type: "GI", length: "1,200 m", surface: "turf",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: false, senior: true, month: "March", half: "2nd", direction: "left", season: "spring" },
            { name: "Osaka Hai", nameJP: "大阪杯", type: "GI", length: "2,000 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: false, senior: true, month: "March", half: "2nd", direction: "right", season: "spring" },

            // April races
            { name: "Oka Sho", nameJP: "桜花賞", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: false, month: "April", half: "1st", direction: "right", season: "spring" },
            { name: "Satsuki Sho", nameJP: "皐月賞", type: "GI", length: "2,000 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "April", half: "1st", direction: "right", season: "spring" },
            { name: "Spring Tennoushou", nameJP: "天皇賞（春）", type: "GI", length: "3,200 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: false, senior: true, month: "April", half: "2nd", direction: "right", season: "spring" },

            // May races
            { name: "NHK Mile Cup", nameJP: "NHKマイルC", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: false, month: "May", half: "1st", direction: "left", season: "spring" },
            { name: "Tokyo Yushun", nameJP: "日本ダービー", type: "GI", length: "2,400 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: false, month: "May", half: "2nd", direction: "left", season: "spring" },
            { name: "Yushun Himba", nameJP: "オークス", type: "GI", length: "2,400 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: false, month: "May", half: "2nd", direction: "left", season: "spring" },
            { name: "Victoria Mile", nameJP: "ヴィクトリアマイル", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: false, senior: true, month: "May", half: "1st", direction: "left", season: "spring" },

            // June races
            { name: "Yasuda Kinen", nameJP: "安田記念", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: true, month: "June", half: "1st" },
            { name: "Takarazuka Kinen", nameJP: "宝塚記念", type: "GI", length: "2,200 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: true, month: "June", half: "2nd" },

            // October races
            { name: "Kyoto Daishouten", nameJP: "京都大賞典", type: "GII", length: "2,400 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: true, month: "October", half: "1st", direction: "right", season: "autumn" },
            { name: "Autumn Tennoushou", nameJP: "天皇賞（秋）", type: "GI", length: "2,000 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: true, month: "October", half: "2nd", direction: "left", season: "autumn" },
            { name: "Kikuka Sho", nameJP: "菊花賞", type: "GI", length: "3,000 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: false, month: "October", half: "2nd", direction: "right", season: "autumn" },
            { name: "Shuka Sho", nameJP: "秋華賞", type: "GI", length: "2,000 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: false, month: "October", half: "2nd", direction: "right", season: "autumn" },

            // November races
            { name: "Mile Championship", nameJP: "マイルCS", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: true, month: "November", half: "2nd", direction: "right", season: "autumn" },
            { name: "Japan Cup", nameJP: "ジャパンC", type: "GI", length: "2,400 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: true, month: "November", half: "2nd", direction: "left", season: "autumn" },
            { name: "Queen Elizabeth Hai", nameJP: "エリザベス女王杯", type: "GI", length: "2,200 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: true, month: "November", half: "1st", direction: "right", season: "autumn" },

            // December races
            { name: "Arima Kinen", nameJP: "有馬記念", type: "GI", length: "2,500 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: true, month: "December", half: "2nd", direction: "right", season: "winter" },
            { name: "Hanshin Juvenile Fillies", nameJP: "阪神JF", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: true, classics: false, senior: false, month: "December", half: "1st", direction: "right", season: "winter" },

            // Newspaper Cup races
            { name: "Kyoto Shinbun Hai", nameJP: "京都新聞杯", type: "GII", length: "2,200 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: true, senior: false, month: "May", half: "1st", direction: "right", season: "spring" },
            { name: "Kobe Shinbun Hai", nameJP: "神戸新聞杯", type: "GII", length: "2,400 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: false, month: "September", half: "2nd", direction: "right", season: "autumn" },
            { name: "Chunichi Shinbun Hai", nameJP: "中日新聞杯", type: "GIII", length: "2,000 m", surface: "turf",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: true, senior: true, month: "December", half: "1st", direction: "left", season: "winter" },

            // Star/constellation themed races
            { name: "Procyon Stakes", nameJP: "プロキオンステークス", type: "GIII", length: "1,400 m", surface: "dirt",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: true, senior: true, month: "July", half: "1st", direction: "left", season: "summer" },
            { name: "Capella Stakes", nameJP: "カペラステークス", type: "GIII", length: "1,200 m", surface: "dirt",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: true, month: "December", half: "1st", direction: "right", season: "winter" },
            { name: "Centaur Stakes", nameJP: "セントウルステークス", type: "GII", length: "1,200 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: true, month: "September", half: "1st", direction: "right", season: "autumn" },

            // Jewelry themed races
            { name: "Diamond Stakes", nameJP: "ダイヤモンドステークス", type: "GIII", length: "3,400 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: false, senior: true, month: "February", half: "2nd", direction: "left", season: "winter" },
            { name: "Turquoise Stakes", nameJP: "ターコイズステークス", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: true, month: "December", half: "1st", direction: "right", season: "winter" },
            { name: "Coral Stakes", nameJP: "コーラルステークス", type: "Open", length: "1,400 m", surface: "dirt",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: false, senior: true, month: "April", half: "1st", direction: "right", season: "spring" },

            // Additional G1 races for comprehensive testing
            { name: "Sprinters Stakes", nameJP: "スプリンターズS", type: "GI", length: "1,200 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: true, month: "September", half: "2nd", direction: "right", season: "autumn" },
            { name: "Champions Cup", nameJP: "チャンピオンズC", type: "GI", length: "1,800 m", surface: "dirt",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: true, senior: true, month: "December", half: "1st", direction: "left", season: "winter" },
            { name: "Asahi Hai Futurity Stakes", nameJP: "朝日杯FS", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: true, classics: false, senior: false, month: "December", half: "1st", direction: "right", season: "winter" },
            { name: "Hopeful Stakes", nameJP: "ホープフルS", type: "GI", length: "2,000 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: true, classics: false, senior: false, month: "December", half: "2nd", direction: "right", season: "winter" },

            // Triple Crown Trial Races
            { name: "Yayoi Sho", nameJP: "弥生賞", type: "GII", length: "2,000 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "March", half: "1st", direction: "right", season: "spring", trial_for: "Satsuki Sho" },
            { name: "Spring Stakes", nameJP: "スプリングステークス", type: "GII", length: "1,800 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "March", half: "2nd", direction: "right", season: "spring", trial_for: "Tokyo Yushun" },
            { name: "Saint Lite Kinen", nameJP: "セントライト記念", type: "GII", length: "2,200 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: true, senior: false, month: "September", half: "2nd", direction: "right", season: "autumn", trial_for: "Kikuka Sho" },

            // Triple Tiara Trial Races
            { name: "Tulip Sho", nameJP: "チューリップ賞", type: "GII", length: "1,600 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: false, month: "March", half: "1st", direction: "right", season: "spring", trial_for: "Oka Sho" },
            { name: "Flora Stakes", nameJP: "フローラステークス", type: "GII", length: "2,000 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: false, month: "April", half: "2nd", direction: "left", season: "spring", trial_for: "Yushun Himba" },
            { name: "Rose Stakes", nameJP: "ローズステークス", type: "GII", length: "1,800 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: false, month: "September", half: "1st", direction: "right", season: "autumn", trial_for: "Shuka Sho" },

            // Summer Sprint Series (SSS)
            { name: "CBC Award", nameJP: "CBC賞", type: "GIII", length: "1,200 m", surface: "turf",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: true, senior: true, month: "July", half: "1st", direction: "left", season: "summer", series: "SSS" },
            { name: "Keeneland Cup", nameJP: "キーンランドカップ", type: "GIII", length: "1,200 m", surface: "turf",
              racetrack: "Sapporo", junior: false, classics: true, senior: true, month: "August", half: "2nd", direction: "right", season: "summer", series: "SSS" },
            { name: "Kitakyushu Kinen", nameJP: "北九州記念", type: "GIII", length: "1,200 m", surface: "turf",
              racetrack: "Kokura (Kitakyushu)", junior: false, classics: true, senior: true, month: "August", half: "2nd", direction: "right", season: "summer", series: "SSS" },

            // Summer Mile Series (SMS)
            { name: "Yasuda Kinen", nameJP: "安田記念", type: "GI", length: "1,600 m", surface: "turf",
              racetrack: "Tokyo", junior: false, classics: true, senior: true, month: "June", half: "1st", direction: "left", season: "summer", series: "SMS" },
            { name: "Chukyou Kinen", nameJP: "中京記念", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Chukyou (Nagoya)", junior: false, classics: true, senior: true, month: "July", half: "2nd", direction: "left", season: "summer", series: "SMS" },
            { name: "Sekiya Kinen", nameJP: "関屋記念", type: "GIII", length: "1,600 m", surface: "turf",
              racetrack: "Niigata", junior: false, classics: true, senior: true, month: "August", half: "1st", direction: "left", season: "summer", series: "SMS" },

            // Summer 2000 Series (S2000)
            { name: "Takarazuka Kinen", nameJP: "宝塚記念", type: "GI", length: "2,200 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: true, month: "June", half: "2nd", direction: "right", season: "summer", series: "S2000" },
            { name: "Hakodate Kinen", nameJP: "函館記念", type: "GIII", length: "2,000 m", surface: "turf",
              racetrack: "Hakodate", junior: false, classics: true, senior: true, month: "July", half: "1st", direction: "right", season: "summer", series: "S2000" },
            { name: "Sapporo Kinen", nameJP: "札幌記念", type: "GII", length: "2,000 m", surface: "turf",
              racetrack: "Sapporo", junior: false, classics: true, senior: true, month: "August", half: "2nd", direction: "right", season: "summer", series: "S2000" },

            // More newspaper races
            { name: "Silk Road Stakes", nameJP: "シルクロードステークス", type: "GIII", length: "1,200 m", surface: "turf",
              racetrack: "Kyoto", junior: false, classics: false, senior: true, month: "January", half: "2nd", direction: "right", season: "winter" },
            { name: "Ocean Stakes", nameJP: "オーシャンステークス", type: "GIII", length: "1,200 m", surface: "turf",
              racetrack: "Nakayama (Chiba)", junior: false, classics: false, senior: true, month: "March", half: "1st", direction: "right", season: "spring" },

            // More star/constellation races  
            { name: "Aldebaran Stakes", nameJP: "アルデバランステークス", type: "Open", length: "1,900 m", surface: "dirt",
              racetrack: "Kyoto", junior: false, classics: false, senior: true, month: "February", half: "1st", direction: "right", season: "winter" },
            { name: "Rigel Stakes", nameJP: "リゲルステークス", type: "Open", length: "1,600 m", surface: "turf",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: true, month: "December", half: "1st", direction: "right", season: "winter" },
            { name: "Betelgeuse Stakes", nameJP: "ベテルギウスステークス", type: "Open", length: "1,800 m", surface: "dirt",
              racetrack: "Hanshin (Takarazuka)", junior: false, classics: true, senior: true, month: "December", half: "2nd", direction: "right", season: "winter" }
        ];
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
                conditionEN: 'During the Senior year, win either the Nakayama Kimpai or the Kyoto Kimpai in January.',
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
                conditionEN: 'Win the three Triple Crown races (Satsuki Sho, Tokyo Yushun, Kikuka Sho) AND win one trial race for each.',
                check: () => this.checkPerfectCrown()
            },
            {
                id: 'perfect_tiara',
                nameJP: 'パーフェクトティアラ',
                nameEN: 'Perfect Tiara',
                conditionJP: '牝馬三冠レース（桜花賞、オークス、秋華賞）と、各レースに対応するトライアルレース3つに勝利する。',
                conditionEN: 'Win the three Triple Tiara races (Oka Sho, Yushun Himba, Shuka Sho) AND win one trial race for each.',
                check: () => this.checkPerfectTiara()
            },
            {
                id: 'summer_sprint_series',
                nameJP: 'SSS (サマースプリントシリーズ)',
                nameEN: 'SSS (Summer Sprint Series)',
                conditionJP: 'サマースプリントシリーズ対象レースの中から3勝以上する。',
                conditionEN: 'Win 3 or more races from the Summer Sprint Series.',
                check: () => this.checkSummerSeries('SSS')
            },
            {
                id: 'summer_mile_series',
                nameJP: 'SMS (サマーマイルシリーズ)',
                nameEN: 'SMS (Summer Mile Series)',
                conditionJP: 'サマーマイルシリーズ対象レースの中から3勝以上する。',
                conditionEN: 'Win 3 or more races from the Summer Mile Series.',
                check: () => this.checkSummerSeries('SMS')
            },
            {
                id: 'summer_2000_series',
                nameJP: 'S2000 (サマー2000シリーズ)',
                nameEN: 'S2000 (Summer 2000 Series)',
                conditionJP: 'サマー2000シリーズ対象レースの中から3勝以上する。',
                conditionEN: 'Win 3 or more races from the Summer 2000 Series.',
                check: () => this.checkSummerSeries('S2000')
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
                    <button class="win-btn ${this.wonRaces.has(race.name) ? 'won' : this.lostRaces.has(race.name) ? 'lost' : ''}" 
                            onclick="event.stopPropagation(); tracker.toggleWin('${race.name}')">
                        ${this.wonRaces.has(race.name) ? '🏆 Won / 勝利' : 
                          this.lostRaces.has(race.name) ? '❌ Lost / 敗北' : 
                          '🏆 Mark as Win / 勝利にする'}
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
            this.selectedRaces.delete(raceName);
            this.wonRaces.delete(raceName); // If not participating, can't win
            this.lostRaces.delete(raceName); // If not participating, can't lose
        } else {
            this.selectedRaces.add(raceName);
        }
        this.renderRaces();
        this.updateProgress();
    }

    toggleWin(raceName) {
        if (!this.selectedRaces.has(raceName)) return; // Can't win/lose if not participating
        
        // Toggle between Won and Lost (default to Won on first click)
        if (this.wonRaces.has(raceName)) {
            // Currently won, change to lost
            this.wonRaces.delete(raceName);
            this.lostRaces.add(raceName);
        } else if (this.lostRaces.has(raceName)) {
            // Currently lost, change to won
            this.lostRaces.delete(raceName);
            this.wonRaces.add(raceName);
        } else {
            // First click - default to won
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
        const newspaperRaces = ['Kyoto Shinbun Hai', 'Kobe Shinbun Hai', 'Chunichi Shinbun Hai', 'Tokyo Shinbun Hai'];
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
        const goldCups = ['Nakayama Kinpai', 'Kyoto Kinpai'];
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
        const jewelryRaces = ['Diamond Stakes', 'Turquoise Stakes', 'Coral Stakes'];
        const wonJewelryRaces = jewelryRaces.filter(race => this.wonRaces.has(race));
        
        return {
            completed: wonJewelryRaces.length >= 3,
            current: wonJewelryRaces.length,
            required: 3,
            progress: (wonJewelryRaces.length / 3) * 100,
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
        const tripleCrownRaces = ['Satsuki Sho', 'Tokyo Yushun', 'Kikuka Sho'];
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
        const tripleTiaraRaces = ['Oka Sho', 'Yushun Himba', 'Shuka Sho'];
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

    checkSummerSeries(seriesName) {
        const seriesRaces = Array.from(this.wonRaces).filter(raceName => {
            const race = this.races.find(r => r.name === raceName);
            return race && race.series === seriesName;
        });
        
        return {
            completed: seriesRaces.length >= 3,
            current: seriesRaces.length,
            required: 3,
            progress: (seriesRaces.length / 3) * 100,
            details: `${seriesName} wins: ${seriesRaces.join(', ')}`
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
