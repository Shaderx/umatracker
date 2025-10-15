/**
 * Changelog Renderer Module
 * Handles display of changelog data in the UI (preview section only)
 */

import { state } from '../core/state.js';

/**
 * Render changelog section - shows only latest entry
 */
export function renderChangelog() {
    const container = document.getElementById('changelog-container');
    if (!container) return;

    // Check if we have changelog data
    if (!window.changelogData || !Array.isArray(window.changelogData) || window.changelogData.length === 0) {
        container.innerHTML = '<p class="changelog-empty">No changelog available</p>';
        return;
    }

    const changelogData = window.changelogData;
    const latestEntry = changelogData[0]; // Only show the most recent entry
    
    let html = '<div class="changelog-wrapper">';
    html += '<h2 class="changelog-title">📜 Changelog</h2>';
    html += '<div class="changelog-preview">';

    // Render only the latest entry
    html += renderChangelogEntry(latestEntry);

    // Add fade overlay and "Show More" button if there are more entries
    if (changelogData.length > 1) {
        html += '<div class="changelog-fade-overlay"></div>';
        html += '<button class="changelog-show-more" onclick="tracker.openChangelogModal()">Show Full History</button>';
    }

    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

/**
 * Render a single changelog entry
 */
function renderChangelogEntry(entry) {
    let html = `<div class="changelog-entry">`;
    html += `<div class="changelog-date">${formatDate(entry.date)}</div>`;
    html += `<div class="changelog-changes">`;
    
    for (const changeGroup of entry.changes) {
        html += `<div class="changelog-category">`;
        html += `<div class="changelog-category-title">${changeGroup.category}</div>`;
        html += `<ul class="changelog-items">`;
        
        for (const item of changeGroup.items) {
            html += `<li>${escapeHtml(item)}</li>`;
        }
        
        html += `</ul>`;
        html += `</div>`;
    }
    
    html += `</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Format date string for display
 */
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateStr;
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize changelog display
 */
export function initChangelog() {
    // Wait for DOM and changelog data to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderChangelog);
    } else {
        renderChangelog();
    }
}


