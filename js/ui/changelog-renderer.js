/**
 * Changelog Renderer Module
 * Handles display of changelog data in the UI
 */

import { state } from '../core/state.js';

/**
 * Render changelog section
 */
export function renderChangelog() {
    const container = document.getElementById('changelog-container');
    if (!container) return;

    // Check if we have changelog data
    if (!window.changelogData || !Array.isArray(window.changelogData)) {
        container.innerHTML = '<p class="changelog-empty">No changelog available</p>';
        return;
    }

    const changelogData = window.changelogData;
    
    // Limit to most recent entries (e.g., last 10 dates)
    const recentEntries = changelogData.slice(0, 10);
    
    let html = '<div class="changelog-wrapper">';
    html += '<h2 class="changelog-title">📜 Changelog</h2>';
    html += '<div class="changelog-entries">';
    
    for (const entry of recentEntries) {
        html += `<div class="changelog-entry">`;
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
    }
    
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
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

