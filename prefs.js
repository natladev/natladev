// Reading preferences widget — theme, tint, font, text size, spacing, letter anchors.
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
        // A tint is a tinted light page, so it brings the light theme with it.
        if (prefs.tint) { root.dataset.tint = prefs.tint; root.dataset.theme = 'light'; } else delete root.dataset.tint;
        if (prefs.font) root.dataset.font = prefs.font; else delete root.dataset.font;
        if (prefs.textsize) root.dataset.textsize = prefs.textsize; else delete root.dataset.textsize;
        if (prefs.spacing) root.dataset.spacing = prefs.spacing; else delete root.dataset.spacing;
        applyAnchors();
    }

    // Letter anchors, as in ClearPage: b, d, p and q each keep one color, so
    // the letters that mirror each other stop swapping places.
    const ANCHOR_CLASS = { b: 'a-b', d: 'a-d', p: 'a-p', q: 'a-q' };
    const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, svg: 1, VIDEO: 1 };
    let anchorWatch = null;

    function anchorize() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!/[bdpq]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
                for (let el = node.parentNode; el && el !== document.body; el = el.parentNode) {
                    if (SKIP[el.nodeName] || el.isContentEditable
                        || (el.classList && el.classList.contains('anchor'))) return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
            const fragment = document.createDocumentFragment();
            node.nodeValue.split(/([bdpq])/).forEach(part => {
                if (ANCHOR_CLASS[part]) {
                    const span = document.createElement('span');
                    span.className = 'anchor ' + ANCHOR_CLASS[part];
                    span.dataset.auto = '';
                    span.textContent = part;
                    fragment.appendChild(span);
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            node.parentNode.replaceChild(fragment, node);
        });
    }

    function applyAnchors() {
        const on = prefs.anchors === 'on';
        if (on) {
            root.dataset.anchors = 'on';
            if (!document.body) return;
            anchorize();
            // Text that arrives later (a language switch, a caption) gets them too.
            if (!anchorWatch) {
                let queued = false;
                anchorWatch = new MutationObserver(() => {
                    if (queued) return;
                    queued = true;
                    requestAnimationFrame(() => { queued = false; if (prefs.anchors === 'on') anchorize(); });
                });
                anchorWatch.observe(document.body, { childList: true, subtree: true, characterData: true });
            }
        } else {
            delete root.dataset.anchors;
            if (anchorWatch) { anchorWatch.disconnect(); anchorWatch = null; }
            document.querySelectorAll('span.anchor[data-auto]').forEach(span => {
                const parent = span.parentNode;
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize();
            });
        }
    }

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* private mode */ }
    }

    systemLight.addEventListener('change', apply);

    // English source strings; other languages come from window.I18N (translations.js).
    // Labels starting with "prefs." are translation keys; anything else (A, A+, A++)
    // is a literal shown as-is in every language.
    const EN = {
        'prefs.title': 'Reading preferences',
        'prefs.theme': 'Theme',
        'prefs.system': 'System',
        'prefs.light': 'Light',
        'prefs.dark': 'Dark',
        'prefs.font': 'Font',
        'prefs.default': 'Default',
        'prefs.dyslexic': 'Dyslexia-friendly',
        'prefs.textsize': 'Text size',
        'prefs.spacing': 'Spacing',
        'prefs.tint': 'Background tint',
        'prefs.none': 'None',
        'prefs.cream': 'Cream',
        'prefs.sage': 'Sage',
        'prefs.sky': 'Sky',
        'prefs.lilac': 'Lilac',
        'prefs.anchors': 'Letter anchors',
        'prefs.off': 'Off',
        'prefs.on': 'On',
        'prefs.normal': 'Normal',
        'prefs.relaxed': 'Relaxed',
        'prefs.reset': 'Reset to defaults'
    };
    function siteLang() {
        return (window.getSiteLang && window.getSiteLang()) || 'en';
    }
    function t(key) {
        if (key.indexOf('prefs.') !== 0) return key; // literal label
        const lang = siteLang();
        if (lang !== 'en' && window.I18N && window.I18N[lang] && window.I18N[lang][key] != null) {
            return window.I18N[lang][key];
        }
        return EN[key];
    }
    function mark(el, key) {
        if (key.indexOf('prefs.') === 0) el.dataset.l10n = key;
        el.textContent = t(key);
    }

    const groups = [
        { key: 'theme', label: 'prefs.theme', def: 'system', options: [['system', 'prefs.system'], ['light', 'prefs.light'], ['dark', 'prefs.dark']] },
        { key: 'tint', label: 'prefs.tint', def: '', options: [['', 'prefs.none'], ['cream', 'prefs.cream'], ['sage', 'prefs.sage'], ['sky', 'prefs.sky'], ['lilac', 'prefs.lilac']] },
        { key: 'font', label: 'prefs.font', def: '', options: [['', 'prefs.default'], ['dyslexic', 'prefs.dyslexic']] },
        { key: 'textsize', label: 'prefs.textsize', def: '', options: [['', 'A'], ['large', 'A+'], ['xl', 'A++']] },
        { key: 'spacing', label: 'prefs.spacing', def: '', options: [['', 'prefs.normal'], ['relaxed', 'prefs.relaxed']] },
        { key: 'anchors', label: 'prefs.anchors', def: '', options: [['', 'prefs.off'], ['on', 'prefs.on']] }
    ];

    const toggle = document.createElement('button');
    toggle.className = 'prefs-toggle';
    // Labelled, so it reads as "reading preferences" and not as a mystery icon.
    const toggleMark = document.createElement('span');
    toggleMark.className = 'prefs-aa';
    toggleMark.textContent = 'Aa';
    toggleMark.setAttribute('aria-hidden', 'true');
    const toggleLabel = document.createElement('span');
    toggleLabel.className = 'prefs-label';
    mark(toggleLabel, 'prefs.title');
    toggle.append(toggleMark, toggleLabel);
    toggle.setAttribute('aria-label', t('prefs.title'));
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'prefsPanel');

    const panel = document.createElement('div');
    panel.className = 'prefs-panel';
    panel.id = 'prefsPanel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'prefsTitle');

    const title = document.createElement('h2');
    title.id = 'prefsTitle';
    title.tabIndex = -1;
    mark(title, 'prefs.title');
    panel.appendChild(title);

    // Refresh pressed-state across every set of controls on the page
    // (the floating panel and any inline mount share one source of truth).
    function refreshButtons() {
        document.querySelectorAll('.prefs-options button').forEach(btn => {
            const current = prefs[btn.dataset.group] || '';
            const value = btn.dataset.value;
            const isActive = btn.dataset.group === 'theme'
                ? (prefs.theme || 'system') === value
                : current === value;
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    // Build the fieldset/button controls into the given container.
    function buildControls(container) {
        groups.forEach(group => {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            mark(legend, group.label);
            fieldset.appendChild(legend);
            const row = document.createElement('div');
            row.className = 'prefs-options';
            group.options.forEach(([value, label]) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                mark(btn, label);
                btn.dataset.group = group.key;
                btn.dataset.value = value;
                if (group.key === 'tint' && value) btn.classList.add('prefs-swatch', 'tint-' + value);
                btn.addEventListener('click', () => {
                    if (group.key === 'theme') {
                        if (value === 'system') delete prefs.theme; else prefs.theme = value;
                        // Leaving the light theme leaves the tint behind.
                        if (value !== 'light') delete prefs.tint;
                    } else if (group.key === 'tint' && value) {
                        prefs.tint = value;
                        prefs.theme = 'light';
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
            container.appendChild(fieldset);
        });
    }

    buildControls(panel);

    // Optional inline mount: a page can include <div id="prefs-inline">
    // to surface the same controls within its content.
    const inlineMount = document.getElementById('prefs-inline');
    if (inlineMount) buildControls(inlineMount);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'prefs-reset';
    mark(reset, 'prefs.reset');
    reset.addEventListener('click', () => {
        prefs = {};
        try { localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
        apply();
        refreshButtons();
    });
    panel.appendChild(reset);

    // The same panel from the top bar, where people look for settings first.
    const navToggle = document.createElement('button');
    navToggle.type = 'button';
    navToggle.className = 'prefs-nav';
    navToggle.textContent = 'Aa';
    navToggle.setAttribute('aria-label', t('prefs.title'));
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'prefsPanel');
    const langSwitch = document.querySelector('.navbar .lang-switch');
    if (langSwitch) langSwitch.parentNode.insertBefore(navToggle, langSwitch);

    function setOpen(open, fromNav) {
        panel.hidden = !open;
        // Opened from the top bar, it drops down from there.
        panel.classList.toggle('from-nav', Boolean(open && fromNav));
        toggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-expanded', String(open));
        // Keyboard and screen reader users land in the panel they just opened.
        if (open) title.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    navToggle.addEventListener('click', () => setOpen(panel.hidden, true));
    // On a phone the label gives way to the page once the visitor scrolls.
    const onScroll = () => root.classList.toggle('prefs-scrolled', window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !panel.hidden) {
            const opener = panel.classList.contains('from-nav') ? navToggle : toggle;
            setOpen(false);
            opener.focus();
        }
    });
    document.addEventListener('click', e => {
        if (!panel.hidden && !panel.contains(e.target) && !toggle.contains(e.target)
            && e.target !== navToggle) setOpen(false);
    });

    // Re-translate every label when the site language changes.
    function relabel() {
        document.querySelectorAll('[data-l10n]').forEach(el => {
            el.textContent = t(el.dataset.l10n);
        });
        toggle.setAttribute('aria-label', t('prefs.title'));
        navToggle.setAttribute('aria-label', t('prefs.title'));
    }
    document.addEventListener('natladev:langchange', relabel);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    refreshButtons();
    apply();
    relabel();

    // First-visit nudge: invite people to read the site their way (shown once, ever).
    try {
        const HINT_KEY = 'natladev-hint';
        if (!localStorage.getItem(HINT_KEY)) {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // i18n.js has already resolved the language (URL override, saved choice, browser).
            const hintLang = siteLang();
            const dict = (hintLang !== 'en' && window.I18N && window.I18N[hintLang]) ? window.I18N[hintLang] : null;
            const hintHTML = (dict && dict['prefs.hint'])
                ? dict['prefs.hint']
                : 'New here? You can read this site <strong>your way</strong> — font, size, spacing, and color.';
            const dismissText = (dict && dict['prefs.hintDismiss']) ? dict['prefs.hintDismiss'] : 'Got it';

            const hint = document.createElement('div');
            hint.className = 'prefs-hint';
            hint.setAttribute('role', 'status');
            hint.innerHTML = '<p>' + hintHTML + '</p>';

            const got = document.createElement('button');
            got.type = 'button';
            got.className = 'prefs-hint-dismiss';
            got.textContent = dismissText;
            hint.appendChild(got);

            document.body.appendChild(hint);
            try { localStorage.setItem(HINT_KEY, '1'); } catch (e) { /* private mode */ }
            if (!reduce) toggle.classList.add('attention');

            const dismiss = () => {
                hint.classList.add('is-gone');
                toggle.classList.remove('attention');
                setTimeout(() => hint.remove(), 350);
            };
            got.addEventListener('click', dismiss);
            toggle.addEventListener('click', dismiss, { once: true });
            requestAnimationFrame(() => requestAnimationFrame(() => hint.classList.add('is-shown')));
            setTimeout(dismiss, 12000);
        }
    } catch (e) { /* private mode — skip the nudge */ }
})();
