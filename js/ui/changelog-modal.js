/**
 * Changelog Modal Module
 * Handles the full changelog history modal display and filtering
 */

import { lockBodyScroll, unlockBodyScroll } from '../features/scroll-lock.js';

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
 * Render full changelog in modal
 */
export function renderChangelogModal() {
    const changelogData = window.changelogData;
    if (!changelogData || changelogData.length === 0) return '';
    
    let html = '<div class="changelog-entries-full">';
    
    for (const entry of changelogData) {
        html += renderChangelogEntry(entry);
    }
    
    html += '</div>';
    
    return html;
}

/**
 * Get unique months/years for filtering
 */
export function getChangelogDates() {
    const changelogData = window.changelogData;
    if (!changelogData) return [];
    
    const dates = new Set();
    for (const entry of changelogData) {
        const date = new Date(entry.date);
        const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        dates.add(monthYear);
    }
    
    return Array.from(dates);
}

/**
 * Filter changelog by month/year
 */
export function filterChangelogByDate(monthYear) {
    const changelogData = window.changelogData;
    if (!changelogData) return '';
    
    let html = '<div class="changelog-entries-full">';
    
    for (const entry of changelogData) {
        const date = new Date(entry.date);
        const entryMonthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (monthYear === 'all' || entryMonthYear === monthYear) {
            html += renderChangelogEntry(entry);
        }
    }
    
    html += '</div>';
    
    return html;
}

/**
 * Open changelog modal
 */
export function openChangelogModal() {
    const modal = document.getElementById('changelog-modal');
    const content = document.getElementById('changelog-modal-content');
    const dateFilter = document.getElementById('changelog-date-filter');
    
    if (!modal || !content || !dateFilter) return;
    
    // Populate date filter options
    const dates = getChangelogDates();
    let optionsHTML = '<option value="all">All Dates</option>';
    for (const date of dates) {
        optionsHTML += `<option value="${date}">${date}</option>`;
    }
    dateFilter.innerHTML = optionsHTML;
    
    // Populate content with all changelog entries
    content.innerHTML = renderChangelogModal();
    
    // Show modal
    modal.classList.remove('hidden');
    lockBodyScroll();
}

/**
 * Close changelog modal
 */
export function closeChangelogModal() {
    const modal = document.getElementById('changelog-modal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    unlockBodyScroll();
}

/**
 * Filter changelog display
 */
export function filterChangelog(monthYear) {
    const content = document.getElementById('changelog-modal-content');
    if (!content) return;
    
    content.innerHTML = filterChangelogByDate(monthYear);
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

