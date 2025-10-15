// Auto-generated changelog
// Generated on: 2025-10-15 18:23:33
// Do not edit manually - run debug/tools/generate_changelog.py to regenerate

const changelogData = [
  {
    "date": "2025-10-15",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "Reformat infocards display and add year-specific colors",
          "Fix picker modal flicker issue - implement opacity masking",
          "Add year pagination system to race planner modal"
        ]
      },
      {
        "category": "\ud83d\udc1b Fixes",
        "items": [
          "Remove debug logs from picker modal flicker fix",
          "Remove debug console.log statements from picker-modal.js"
        ]
      },
      {
        "category": "\ud83d\udc84 Style",
        "items": [
          "Enhanced progress tracker with smart factor display and quick stats"
        ]
      },
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Standardize picker function naming to eliminate import aliases",
          "Remove location info from track names - simplify Nakayama, Hanshin, Chukyou, Kokura",
          "Switch to modular app architecture",
          "Organize icons: move all icon files to dedicated icons/ directory"
        ]
      }
    ]
  },
  {
    "date": "2025-10-07",
    "changes": [
      {
        "category": "\u267b\ufe0f Refactor",
        "items": [
          "Refactor codebase into modular structure"
        ]
      }
    ]
  },
  {
    "date": "2025-10-05",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "\\refactor: create modular foundation with 7 modules and complete documentation",
          "Add body scroll lock for mobile/tablet when modals are open",
          "Remove body lock and add mobile close button",
          "Implement natural carousel swipe with preloaded adjacent cards",
          "Add full-screen swipe gestures with animations for picker modal",
          "Add mobile/tablet navigation indicators and fix button positioning",
          "Implement comprehensive filter system and UI enhancements"
        ]
      },
      {
        "category": "\ud83d\udc1b Fixes",
        "items": [
          "Fix iOS mobile picker highlighting delay",
          "Fix modal picker carousel issues",
          "Fix carousel swipe skipping dates by preventing duplicate event handlers",
          "Fix mobile scrolling issue in race planner modal picker",
          "Show auto-close button in all carousel cards and fix vertical scroll blocking",
          "Prevent button reflow by pre-rendering all carousel cards and improve scroll detection",
          "Prevent button reflow during swipe and improve layout stability",
          "Allow vertical scrolling in race list while preserving swipe gestures",
          "Prevent background scroll when modals are open",
          "Mobile button sizing consistency in race planner",
          "Update distance categories for proper filtering"
        ]
      },
      {
        "category": "\u267b\ufe0f Refactor",
        "items": [
          "\\refactor: extract Phase 1 modules (Easy Wins)"
        ]
      },
      {
        "category": "\ud83d\udd27 Chore",
        "items": [
          "Update filter button styling and functionality"
        ]
      },
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Dynamic sorting and auto-clear tracking for hidden factors",
          "Responsive layout improvements and Discord server integration"
        ]
      }
    ]
  },
  {
    "date": "2025-10-04",
    "changes": [
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "No race no click"
        ]
      }
    ]
  },
  {
    "date": "2025-09-30",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "UI improvements: Add junior/classic/senior info to race database, reduce font sizes and spacing",
          "Add complete save/load/share system with sleek UI",
          "\ud83d\udcdd Add comprehensive README.md",
          "Implement hidden factor race tracking system",
          "Planner: switch to ID-based state; fix slot images; picker uses ID; add raceById/raceIdsByName; refactor factor checks to IDs with name\u2192IDs mapping; update docs"
        ]
      },
      {
        "category": "\u267b\ufe0f Refactor",
        "items": [
          "\ud83d\uddc2\ufe0f Repository Cleanup & File Organization"
        ]
      },
      {
        "category": "\ud83d\udc84 Style",
        "items": [
          "\ud83c\udfa8 Major UI Enhancements & Logo Integration"
        ]
      },
      {
        "category": "\ud83d\udcdd Docs",
        "items": [
          "Remove rebellious spirit hidden factor and update documentation"
        ]
      },
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Factors: \u9023\u6226\u9023\u52dd should be consecutive runs, not wins; restore condition text and use checkConsecutiveRuns()"
        ]
      }
    ]
  },
  {
    "date": "2025-09-29",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "Update race data and add sorting functionality",
          "Feat(hidden-factors): align with Updatedhiddenconditions.csv; add Summer Series (SSS/SMS/S2000); expand star/jewel lists; robust GI detection; include NAR in east; add UI filters; update FEATURE.md"
        ]
      },
      {
        "category": "\ud83d\udc1b Fixes",
        "items": [
          "UI overhaul: game-style planner (4-col, 1 race/half), calendar compact & moved to bottom; loss toggle \ud83c\udfc6/\ud83d\udc4e with planner backdrop; background.jpg overlay; planner\u2194calendar sync; clear actions; progress panel max-height synced to planner; calendar info simplified; bug fixes and docs update"
        ]
      },
      {
        "category": "\ud83d\udc84 Style",
        "items": [
          "Split CSS into separate file",
          "Minor tweaks and accepted changes: filter button labels simplified; glass styles and calendar detail sizing in place",
          "UI polish: calendar details visible; smaller calendar detail text; glassy planner and progress panels; bilingual planner date headers (JP/EN); modal gradient backdrop and click-to-close; ESC close; smaller planner win/loss toggle; filter styles adjusted"
        ]
      },
      {
        "category": "\ud83d\udcdd Docs",
        "items": [
          "Rewrite README highlighting hosted site uma.pwnation.net, Summer Series filters, data files",
          "Update README.md"
        ]
      },
      {
        "category": "\u2705 Tests",
        "items": [
          "Gitignore: ignore TestSs/ and variants (tess/testss); remove TestSs from repo"
        ]
      },
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Remove .gitignore from repo as requested",
          ".gitignore: include self in ignore list"
        ]
      }
    ]
  },
  {
    "date": "2025-09-28",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "Add race images and supporting files, update app.js and index.html, remove incomplete race list CSV"
        ]
      }
    ]
  },
  {
    "date": "2025-08-22",
    "changes": [
      {
        "category": "\u2728 Features",
        "items": [
          "Add win/loss cycling functionality"
        ]
      },
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Simplify win/loss toggle to two-state system"
        ]
      }
    ]
  },
  {
    "date": "2025-08-21",
    "changes": [
      {
        "category": "\ud83d\udce6 Other",
        "items": [
          "Initial commit - Uma Musume Hidden Factors Tracker"
        ]
      }
    ]
  }
];

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = changelogData;
}
