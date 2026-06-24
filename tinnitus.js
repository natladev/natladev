// Press-and-hold tinnitus demo, tuned to match a real (clinically measured)
// tinnitus: a pure sine ring at 2828 Hz (≈ F6) with a slow "wavy"
// amplitude modulation. Starts on press, stops on release, always gentle.
(() => {
    const btn = document.getElementById('toneButton');
    if (!btn) return;

    // His measured tinnitus pitch: 2828 Hz pure sine (≈ F6).
    const TONE_HZ = 2828;

    let ctx = null;
    let nodes = null;

    const start = () => {
        if (nodes) return;
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        // Pure sine at his clinic-matched pitch.
        const tone = ctx.createOscillator();
        tone.type = 'sine';
        tone.frequency.value = TONE_HZ;

        const master = ctx.createGain();
        // Ramp in gently — never startle this audience. A pure tone at this
        // pitch is piercing, so keep it quieter than the old static demo.
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.12, now + 0.5);

        // The "wavy" part: a slow swell and fade on top of the steady ring.
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.6;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.setValueAtTime(0, now);
        lfoDepth.gain.linearRampToValueAtTime(0.05, now + 1.5);
        lfo.connect(lfoDepth).connect(master.gain);

        tone.connect(master);
        master.connect(ctx.destination);
        tone.start();
        lfo.start();

        nodes = { tone, lfo, master };
        btn.classList.add('playing');
    };

    const stop = () => {
        if (!nodes) return;
        const { tone, lfo, master } = nodes;
        nodes = null;
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        tone.stop(now + 0.3);
        lfo.stop(now + 0.3);
        btn.classList.remove('playing');
    };

    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        start();
    });
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            start();
        }
    });
    btn.addEventListener('keyup', (e) => {
        if (e.key === ' ' || e.key === 'Enter') stop();
    });
    window.addEventListener('blur', stop);
})();
