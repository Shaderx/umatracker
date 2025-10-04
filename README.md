# 🏇 Uma Musume Hidden Factors Tracker

A beautiful, interactive web application for tracking your Uma Musume Pretty Derby race progress and unlocking hidden factors.

## 🌐 Live Version

**⚠️ IMPORTANT: Please use the official live version at [https://uma.pwnation.net](https://uma.pwnation.net)**

This repository contains the source code. For the best experience with automatic updates, proper hosting, and all features working correctly, always use the live version above.

## ✨ Features

- **🎯 Race Progress Tracking**: Track completed races, wins, and losses
- **🔓 Hidden Factor Unlocking**: Automatically unlock hidden factors as you progress
- **🎮 Game-like UI**: Beautiful, intuitive interface inspired by Uma Musume
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **💾 Local Storage**: Your progress is saved automatically in your browser
- **🌐 Multi-language Support**: English and Japanese text throughout

## 🚀 Quick Start

1. Visit [https://uma.pwnation.net](https://uma.pwnation.net)
2. Start tracking your races in the Race Planner
3. Monitor your progress in the Progress Tracker
4. Unlock hidden factors as you complete requirements

## 📁 Project Structure

### Current Structure (Monolithic - To Be Refactored)
```
├── index.html          # Main application page
├── styles.css          # Styling and animations (~2,266 lines)
├── app.js             # Core application logic (~2,927 lines)
├── races.js           # Race data and configurations
├── .md/               # Documentation (gitignored)
│   ├── README.md      # Extended documentation
│   ├── PLANNING.md    # Development planning
│   └── ...
└── tools/             # Development utilities (gitignored)
    ├── generate_races_js.py
    └── ...
```

### Planned Modular Structure (See REFACTORING_PLAN.md)
```
├── index.html                  # Main application page
├── app.js                      # Entry point (~50 lines)
├── styles.css                  # Main CSS import file (~50 lines)
├── races.js                    # Race data and configurations
│
├── js/                         # JavaScript modules
│   ├── core/                   # Core functionality
│   │   ├── tracker.js          # Main tracker class
│   │   ├── state.js            # State management
│   │   └── utils.js            # Utility functions
│   │
│   ├── data/                   # Data management
│   │   ├── race-data.js        # Race data loading
│   │   ├── hidden-factors.js   # Hidden factors definitions
│   │   └── race-helpers.js     # Race getter functions
│   │
│   ├── ui/                     # UI rendering
│   │   ├── race-renderer.js    # Race grid rendering
│   │   ├── planner-renderer.js # Planner rendering
│   │   ├── progress-renderer.js # Progress panel
│   │   └── event-listeners.js  # Event handlers
│   │
│   ├── features/               # Feature modules
│   │   ├── filters.js          # Filter logic
│   │   ├── planner.js          # Planner management
│   │   ├── picker-modal.js     # Race picker modal
│   │   ├── tracking.js         # Factor tracking
│   │   └── scroll-lock.js      # Modal scroll lock
│   │
│   ├── storage/                # Storage system
│   │   ├── storage-manager.js  # Save/load core
│   │   ├── storage-ui.js       # Storage UI
│   │   └── url-sharing.js      # URL sharing
│   │
│   └── checks/                 # Hidden factor checks
│       ├── check-race-based.js # Race-based checks
│       ├── check-special.js    # Special checks
│       └── check-awakening.js  # Awakening checks
│
├── css/                        # CSS modules
│   ├── base/                   # Base styles
│   │   ├── reset.css           # Reset styles
│   │   ├── layout.css          # Layout structure
│   │   └── typography.css      # Typography
│   │
│   ├── components/             # UI components
│   │   ├── header.css          # Header styles
│   │   ├── footer.css          # Footer styles
│   │   ├── buttons.css         # Button styles
│   │   ├── race-cards.css      # Race card styles
│   │   ├── filters.css         # Filter styles
│   │   └── stats.css           # Stats styles
│   │
│   ├── features/               # Feature styles
│   │   ├── planner.css         # Planner styles
│   │   ├── picker-modal.css    # Modal styles
│   │   ├── progress.css        # Progress panel
│   │   ├── tracking.css        # Tracking highlights
│   │   └── storage.css         # Storage system
│   │
│   ├── responsive/             # Responsive styles
│   │   ├── mobile.css          # Mobile (< 640px)
│   │   └── tablet.css          # Tablet (641-900px)
│   │
│   └── utilities/              # Utility styles
│       ├── animations.css      # Animations
│       └── glass-effects.css   # Glass morphism
│
├── .md/                        # Documentation
│   ├── README.md               # Extended docs
│   ├── PLANNING.md             # Development planning
│   └── STORAGE.md              # Storage system docs
│
├── tools/                      # Development utilities
│   ├── generate_races_js.py    # Race data generator
│   └── download_race_images.py # Image downloader
│
├── REFACTORING_PLAN.md         # Detailed refactoring plan
└── README.md                   # This file
```

**Note**: The modular structure breaks down the large monolithic files into smaller, focused modules (< 400 lines each) that are easier for AI agents to read and for developers to maintain. See `REFACTORING_PLAN.md` for detailed breakdown and implementation strategy.

## 🛠️ Development

This repository contains the source code for development purposes. For local development:

1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server: `python -m http.server 8000`

### Current Architecture

**⚠️ Note**: The current codebase uses a monolithic architecture with large files:
- `app.js`: ~2,927 lines (single class with all functionality)
- `styles.css`: ~2,266 lines (all styles in one file)

This structure makes it difficult for AI agents to read files in a single pass (exceeds 25,000 token limit).

### Planned Refactoring

A detailed refactoring plan is available in `REFACTORING_PLAN.md` that breaks down:
- **app.js** → 18 focused modules (~165 lines average)
- **styles.css** → 17 CSS modules (~133 lines average)

**Benefits**:
- ✅ AI agents can read any file in one pass
- ✅ Better code organization and maintainability
- ✅ Easier to test individual components
- ✅ Clear separation of concerns
- ✅ More scalable architecture

See `REFACTORING_PLAN.md` for the complete breakdown and implementation strategy.

## 📞 Contact & Support

- **🐛 Bug Reports**: Contact `crazyfellow` on Discord
- **💡 Feature Requests**: Contact `crazyfellow` on Discord
- **📖 Documentation**: Check the `.md/` folder for detailed docs
- **🔨 Refactoring Plan**: See `REFACTORING_PLAN.md` for modular architecture details

## ⚖️ License

This project is open source. Please respect the Uma Musume Pretty Derby IP and use responsibly.

## 🙏 Credits

- **Made with ❤️ by shader on Discord**
- Inspired by the Uma Musume Pretty Derby game
- Built with vanilla JavaScript, HTML, and CSS

---

**🎮 Remember: For the best experience, always use [https://uma.pwnation.net](https://uma.pwnation.net)!**
