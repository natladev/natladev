// Press-and-hold tinnitus demo, tuned to match a real (clinically measured)
// tinnitus: metallic static around 2 kHz and 4 kHz with a slow "wavy"
// amplitude modulation. Starts on press, stops on release, always gentle.
(() => {
    const btn = document.getElementById('toneButton');
    if (!btn) return;

    let ctx = null;
    let nodes = null;

    const makeNoiseBuffer = () => {
        const len = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        return buf;
    };

    const start = () => {
        if (nodes) return;
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer();
        noise.loop = true;

        // High-Q bandpass on noise = narrow ringing band ("metallic static").
        // Centered on his clinic-matched frequencies: 2 kHz left, 4 kHz right.
        const band2k = ctx.createBiquadFilter();
        band2k.type = 'bandpass';
        band2k.frequency.value = 2000;
        band2k.Q.value = 14;

        const band4k = ctx.createBiquadFilter();
        band4k.type = 'bandpass';
        band4k.frequency.value = 4000;
        band4k.Q.value = 14;

        const master = ctx.createGain();
        // Ramp in gently — never startle this audience.
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.25, now + 0.5);

        // The "wavy" part: a slow swell and fade on top of the static.
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.6;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.setValueAtTime(0, now);
        lfoDepth.gain.linearRampToValueAtTime(0.1, now + 1.5);
        lfo.connect(lfoDepth).connect(master.gain);

        noise.connect(band2k).connect(master);
        noise.connect(band4k).connect(master);
        master.connect(ctx.destination);
        noise.start();
        lfo.start();

        nodes = { noise, lfo, master };
        btn.classList.add('playing');
    };

    const stop = () => {
        if (!nodes) return;
        const { noise, lfo, master } = nodes;
        nodes = null;
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        noise.stop(now + 0.3);
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
