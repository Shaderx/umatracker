# Uma Musume Hidden Factors Tracker 🏇

An interactive web app to plan and track Hidden Factors for Uma Musume: Pretty Derby.

Live: https://uma.pwnation.net — no install needed, just open and use.
Local: clone this repo and open `index.html` in your browser.

## Features

### 🏁 Race Selection
- **Interactive Race Calendar**: Click on races to mark participation and wins
- **Smart Filtering**: GI/GII/GIII, Pre‑OP/OP, year (Junior/Classic/Senior), Summer Series (SSS/SMS/S2000), and Selected
- **Visual Feedback**: Color-coded race cards show participation status and wins
- **Dual Action Buttons**: Separate buttons for "Participate" and "Win" status

### 📊 Progress Tracking
- **Real-time Updates**: Hidden factor progress updates as you select races
- **Progress Bars**: Visual indicators showing completion percentage for each factor
- **Statistics Panel**: Quick overview of total races, wins, and completed factors
- **Detailed Progress**: Shows specific requirements and current progress for each hidden factor

### 🎯 Hidden Factors Implemented

#### Race-Based Factors
- **連戦連勝 (Consecutive Runs)**: Race 2 races in a row
- **東の雄 (Champion of the East)**: Win 7+ G1 races in eastern Japan tracks
- **西の雄 (Champion of the West)**: Win 7+ G1 races in western Japan tracks
- **旅人 (Traveler)**: Compete at 7+ different racecourses
- **全階級制覇 (All Ranks Conquered)**: Win at least one race in each distance category

#### Special Series
- **新聞屋さん (Newspaper Boy/Girl)**: Win all four "Shimbun Hai" newspaper cup races
- **一年の計は (The Year's Plan)**: Win either Nakayama or Kyoto Kinpai in January
- **星に願いを (Wish Upon a Star)**: Win 3+ star/constellation-themed races
- **ジュエリー (Jewelry)**: Win 3+ jewelry-themed races
- **二刀流 (Dual Wielder)**: Win races on both turf and dirt surfaces
 - **SSS (Summer Sprint Series)**: Win 3 races from the Summer Sprint Series
 - **SMS (Summer Mile Series)**: Win 3 races from the Summer Mile Series
 - **S2000 (Summer 2000 Series)**: Win 3 races from the Summer 2000 Series

## How to Use

1. **Open the App**:
   - Hosted: visit `https://uma.pwnation.net`
   - Local: open `index.html` in your web browser
2. **Select Races**: 
   - Click "Participate" to mark a race as attempted
   - Click "Win" to mark a race as won (only available after participating)
3. **Track Progress**: Watch the right panel update with your hidden factor progress
4. **Use Filters**: Filter races by type to focus on specific goals
5. **Clear Progress**: Use the "Clear All" button to reset your progress

## Distance Categories

The app categorizes race distances as follows:
- **Short**: 1,000-1,400m races
- **Mile**: 1,500-1,700m races  
- **Medium**: 1,800-2,200m races
- **Long**: 2,300m+ races

## Track Locations

### Eastern Japan Tracks
- Tokyo
- Nakayama (Chiba)
- Niigata
- Fukushima
  - Also counted for East: Kawasaki, Ooi, Funabashi, Morioka

### Western Japan Tracks
- Kyoto
- Hanshin (Takarazuka)
- Chukyou (Nagoya)
- Kokura (Kitakyushu)
- Sapporo
- Hakodate

## Special Race Categories

### Newspaper Cup Races (新聞杯)
- Kyoto Shinbun Hai (京都新聞杯)
- Kobe Shinbun Hai (神戸新聞杯)
- Chunichi Shinbun Hai (中日新聞杯)
- Tokyo Shinbun Hai (東京新聞杯)

### Star/Constellation Races
- Procyon Stakes (プロキオンステークス)
- Capella Stakes (カペラステークス)
- Centaur Stakes (セントウルステークス)
- Aldebaran Stakes (アルデバランステークス)
- Rigel Stakes (リゲルステークス)
- Betelgeuse Stakes (ベテルギウスステークス)

### Jewelry Races
- Diamond Stakes (ダイヤモンドステークス)
- Turquoise Stakes (ターコイズステークス)
- Opal Stakes (オパールステークス)

## Technical Details

### Files
- `index.html`: Main application interface
- `app.js`: Application logic and data
- `races.js`: Generated race dataset (loaded by the app)
- `README.md`: This documentation

### Browser Support
- Modern browsers with ES6+ support
- No external dependencies required

## Future Enhancements

- Import/export progress data
- Additional hidden factors from the complete XML file
- More comprehensive race database from the CSV
- Training-based and skill-based hidden factors
- Progress sharing and comparison features

## Data Sources

Based on the provided data files:
- `CompleteDual.xml`: Hidden factor conditions
- `RaceComplete.csv`: Race information

---

**Note**: This is a fan-made tool for Uma Musume: Pretty Derby and is not affiliated with Cygames.



