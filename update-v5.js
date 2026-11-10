/* StudyFlow v5: preserve personal data, refresh only bundled questions. */
(() => {
  'use strict';
  const KEY = 'studyflow_data_v1';
  const BACKUP_KEY = 'studyflow_backup_before_v5';
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return;

    // Keep one automatic rollback copy.
    try { localStorage.setItem(BACKUP_KEY, raw); } catch (_) {}

    // Remove ONLY the old cached question catalogue.
    // script.js will then load the current window.DEFAULT_QUESTIONS.
    delete saved.questions;
    saved.version = 5;
    saved.contentVersion = '5';

    // Preserved: settings, subjects, sessions, answers, goals and all study history.
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch (error) {
    console.error('StudyFlow v5 migration failed:', error);
  }
})();
