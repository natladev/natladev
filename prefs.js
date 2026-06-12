// Reading preferences widget — theme, font, text size, line spacing.
// Saved values are applied before first paint by the inline snippet in each page's <head>.
(function () {
    const KEY = 'natladev-prefs';
    const root = document.documentElement;
    const systemLight = window.matchMedia('(prefers-color-scheme: light)');

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
    }

    let prefs = load();

    function apply() {
        const theme = prefs.theme || 'system';
        root.dataset.theme = theme === 'system' ? (systemLight.matches ? 'light' : 'dark') : theme;
        if (prefs.font) root.dataset.font = prefs.font; else delete root.dataset.font;
        if (prefs.textsize) root.dataset.textsize = prefs.textsize; else delete root.dataset.textsize;
        if (prefs.spacing) root.dataset.spacing = prefs.spacing; else delete root.dataset.spacing;
    }

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* private mode */ }
    }

    systemLight.addEventListener('change', apply);

    const groups = [
        { key: 'theme', label: 'Theme', def: 'system', options: [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']] },
        { key: 'font', label: 'Font', def: '', options: [['', 'Default'], ['dyslexic', 'Dyslexia-friendly']] },
        { key: 'textsize', label: 'Text size', def: '', options: [['', 'A'], ['large', 'A+'], ['xl', 'A++']] },
        { key: 'spacing', label: 'Line spacing', def: '', options: [['', 'Normal'], ['relaxed', 'Relaxed']] }
    ];

    const toggle = document.createElement('button');
    toggle.className = 'prefs-toggle';
    toggle.textContent = 'Aa';
    toggle.setAttribute('aria-label', 'Reading preferences');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'prefsPanel');

    const panel = document.createElement('div');
    panel.className = 'prefs-panel';
    panel.id = 'prefsPanel';
    panel.hidden = true;

    const title = document.createElement('h2');
    title.textContent = 'Reading preferences';
    panel.appendChild(title);

    function refreshButtons() {
        panel.querySelectorAll('.prefs-options button').forEach(btn => {
            const current = prefs[btn.dataset.group] || '';
            const value = btn.dataset.value;
            const isActive = btn.dataset.group === 'theme'
                ? (prefs.theme || 'system') === value
                : current === value;
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    groups.forEach(group => {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = group.label;
        fieldset.appendChild(legend);
        const row = document.createElement('div');
        row.className = 'prefs-options';
        group.options.forEach(([value, label]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.dataset.group = group.key;
            btn.dataset.value = value;
            btn.addEventListener('click', () => {
                if (group.key === 'theme') {
                    if (value === 'system') delete prefs.theme; else prefs.theme = value;
                } else if (value === '') {
                    delete prefs[group.key];
                } else {
                    prefs[group.key] = value;
                }
                save();
                apply();
                refreshButtons();
            });
            row.appendChild(btn);
        });
        fieldset.appendChild(row);
        panel.appendChild(fieldset);
    });

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'prefs-reset';
    reset.textContent = 'Reset to defaults';
    reset.addEventListener('click', () => {
        prefs = {};
        try { localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
        apply();
        refreshButtons();
    });
    panel.appendChild(reset);

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !panel.hidden) {
            setOpen(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', e => {
        if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) setOpen(false);
    });

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    refreshButtons();
    apply();
})();
