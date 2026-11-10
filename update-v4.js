/* StudyFlow v4 migration: user data is preserved; built-in questions are refreshed. */
(() => {
  'use strict';
  const STORAGE_KEY = 'studyflow_data_v1';
  const VERSION_KEY = 'studyflow_content_version';
  const CONTENT_VERSION = '4';
  const builtIns = Array.isArray(window.DEFAULT_QUESTIONS) ? window.DEFAULT_QUESTIONS : [];

  // Put the correct answer in positions 1, 2, 3, 4 evenly instead of mostly first.
  builtIns.forEach((q, index) => {
    if (q.type !== 'choice' || !Array.isArray(q.choices) || q.choices.length < 2) return;
    const choices = [...q.choices];
    const current = choices.indexOf(q.answer);
    if (current < 0) return;
    choices.splice(current, 1);
    const target = index % (choices.length + 1);
    choices.splice(target, 0, q.answer);
    q.choices = choices;
  });

  const isBuiltInId = id =>
    /^q[1-5]$/.test(String(id || '')) ||
    /^g3_/.test(String(id || ''));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || typeof saved !== 'object') {
      localStorage.setItem(VERSION_KEY, CONTENT_VERSION);
      return;
    }

    const oldQuestions = Array.isArray(saved.questions) ? saved.questions : [];
    const oldById = new Map(oldQuestions.map(q => [q.id, q]));

    // Keep questions the user created. Replace only app-provided questions.
    const userQuestions = oldQuestions.filter(q => !isBuiltInId(q.id));
    const refreshedBuiltIns = builtIns.map(q => {
      const old = oldById.get(q.id);
      return {
        ...q,
        // Preserve the user's favorite setting for the same built-in question.
        favorite: Boolean(old?.favorite ?? q.favorite)
      };
    });

    saved.questions = [...refreshedBuiltIns, ...userQuestions];
    saved.version = 4;
    saved.contentVersion = CONTENT_VERSION;

    // These are deliberately untouched:
    // settings, subjects, sessions, answers, goals and study history.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    localStorage.setItem(VERSION_KEY, CONTENT_VERSION);
  } catch (error) {
    console.error('StudyFlow v4 migration failed:', error);
  }
})();
