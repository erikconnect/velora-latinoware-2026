/* Velora Film · trilha sonora (Web Audio, gerada ao vivo).
   JavaScript só aqui: CSS não toca áudio. Nenhuma animação do filme depende deste script. */
(function () {
  var AC = window.AudioContext || window.webkitAudioContext;
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function impulse(ctx, secs, decay) {
    var len = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  /* D como centro tonal. Cada ato: acordes (o primeiro número é o baixo), arpejo opcional, pulso opcional. */
  var ACTS = [
    { step: 8, vel: .045, chords: [[38, 50, 57, 62, 64]] },
    { step: 8, vel: .05, chords: [[38, 53, 57, 60, 64], [34, 50, 53, 57, 62], [43, 50, 53, 58, 62], [33, 52, 55, 57, 62]], arp: { n: [62, 65, 69, 72, 69, 65, 64, 60], every: .75, vel: .05 } },
    { step: 8, vel: .05, chords: [[26, 38, 50, 51, 57], [26, 38, 49, 50, 56]], pulse: { every: 1.25, vel: .34 } },
    { step: 8, vel: .05, chords: [[38, 57, 62, 66, 69], [35, 57, 61, 66, 69], [40, 59, 64, 66, 71], [38, 57, 62, 66, 74]], arp: { n: [62, 66, 69, 74, 69, 66, 74, 78], every: .25, vel: .032 } },
    { step: 8, vel: .05, chords: [[38, 57, 61, 64, 69], [35, 54, 57, 61, 66], [31, 55, 59, 62, 66], [33, 52, 57, 61, 64]], arp: { n: [69, 73, 76, 81, 76, 73, 71, 66], every: .5, vel: .04 } },
    { step: 10, vel: .055, chords: [[38, 57, 61, 64, 69, 73], [38, 57, 62, 64, 69, 74]], arp: { n: [81, 76, 73, 69], every: 2.5, vel: .035 } }
  ];

  function createEngine(ctx, dest) {
    var bus = ctx.createGain(), dry = ctx.createGain(), send = ctx.createGain(), conv = ctx.createConvolver();
    dry.gain.value = .85; send.gain.value = .42; conv.buffer = impulse(ctx, 3.4, 2.6);
    bus.connect(dry); dry.connect(dest); bus.connect(send); send.connect(conv); conv.connect(dest);
    var echo = ctx.createDelay(1.5), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), pbus = ctx.createGain();
    echo.delayTime.value = .42; fb.gain.value = .36; lp.type = 'lowpass'; lp.frequency.value = 2400;
    pbus.connect(bus); pbus.connect(echo); echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(bus);
    var nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    function env(g, t, a, peak, dur, rel) {
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.setValueAtTime(peak, t + Math.max(a, dur)); g.gain.linearRampToValueAtTime(0, t + dur + rel);
    }
    function pad(t, notes, dur, vel) {
      var per = vel / Math.sqrt(notes.length);
      notes.forEach(function (m) {
        var g = ctx.createGain(), f = ctx.createBiquadFilter(), o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
        o1.type = 'sawtooth'; o2.type = 'triangle'; o1.frequency.value = o2.frequency.value = mtof(m); o1.detune.value = -7; o2.detune.value = 6;
        f.type = 'lowpass'; f.Q.value = .4; f.frequency.setValueAtTime(450, t); f.frequency.linearRampToValueAtTime(1500, t + dur * .55); f.frequency.linearRampToValueAtTime(600, t + dur + 1.5);
        env(g, t, dur * .38, per, dur * .62, 1.6);
        o1.connect(f); o2.connect(f); f.connect(g); g.connect(bus);
        o1.start(t); o2.start(t); o1.stop(t + dur + 1.7); o2.stop(t + dur + 1.7);
      });
    }
    function bass(t, m, dur) {
      var g = ctx.createGain(), o = ctx.createOscillator(), o2 = ctx.createOscillator();
      o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m + 12);
      var g2 = ctx.createGain(); g2.gain.value = .25; env(g, t, 1.2, .13, dur * .7, 1.8);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + dur + 2); o2.stop(t + dur + 2);
    }
    function pluck(t, m, vel) {
      var g = ctx.createGain(), f = ctx.createBiquadFilter(), o = ctx.createOscillator();
      o.type = 'triangle'; o.frequency.value = mtof(m); f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(700, t + .8);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
      o.connect(f); f.connect(g); g.connect(pbus); o.start(t); o.stop(t + 1.2);
    }
    function thump(t, vel) {
      var g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(40, t + .28);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + .42);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + .5);
    }
    function blip(t, hz, dur, vel) {
      var g = ctx.createGain(), o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + .05);
    }
    function whoosh(t, dur, f0, f1, vel) {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = nb; s.loop = true; f.type = 'bandpass'; f.Q.value = 1.1;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + dur * .45); g.gain.linearRampToValueAtTime(0, t + dur);
      s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + .05);
    }

    var st = { act: 0, nc: 0, na: 0, np: 0, ci: 0, ai: 0 };
    return {
      setAct: function (n, t, intro) {
        st.act = n; st.nc = st.na = st.np = t + .05; st.ci = st.ai = 0;
        whoosh(t, 1.8, 260, 3400, .1);
        if (n === 0 && intro) { blip(t + .1, 880, .12, .06); blip(t + .9, 880, .12, .06); blip(t + 1.7, 880, .12, .06); thump(t + 2.6, .4); }
        if (n === 5) pluck(t + .6, 86, .05);
      },
      run: function (now, horizon) {
        var a = ACTS[st.act], until = now + horizon, ch;
        if (st.nc < now - 1) st.nc = st.na = st.np = now;
        while (st.nc < until) { ch = a.chords[st.ci++ % a.chords.length]; bass(st.nc, ch[0], a.step); pad(st.nc, ch.slice(1), a.step, a.vel); st.nc += a.step; }
        if (a.arp) while (st.na < until) { pluck(st.na, a.arp.n[st.ai++ % a.arp.n.length], a.arp.vel); st.na += a.arp.every; }
        if (a.pulse) while (st.np < until) { thump(st.np, a.pulse.vel); thump(st.np + .24, a.pulse.vel * .6); st.np += a.pulse.every; }
      },
      slice: function (t) { whoosh(t, .75, 700, 7500, .15); [74, 78, 81, 86].forEach(function (m, i) { pluck(t + .08 * i, m, .05); }); },
      tick: function (t) { blip(t, 1320, .09, .045); }
    };
  }
  window.__veloraFilmAudio = { createEngine: createEngine, state: function () { return ctx ? ctx.state : 'none'; } };

  var root = document.getElementById('vl-film-native');
  if (!root || !AC) { if (root) root.setAttribute('data-sound', 'off'); return; }
  var btn = root.querySelector('.vl-film-mute'), vol = root.querySelector('.vl-film-vol');
  var KEY = 'velora-film-audio', level = .7, muted = false, ctx = null, master = null, eng = null, timer = null;
  try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); if (typeof s.level === 'number') level = Math.min(1, Math.max(0, s.level)); muted = !!s.muted; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ level: level, muted: muted })); } catch (e) {} }
  function currentAct() { var r = root.querySelector('input[name="film-scene"]:checked'); return r ? +r.id.split('-').pop() : 0; }
  function paint() {
    var on = ctx && !muted && level > 0;
    root.setAttribute('data-sound', ctx ? (on ? 'on' : 'off') : (muted ? 'off' : 'idle'));
    btn.setAttribute('aria-pressed', on ? 'true' : 'false'); vol.value = Math.round(level * 100);
    vol.style.setProperty('--v', Math.round(level * 100) + '%');
  }
  function apply() {
    if (!ctx) return paint();
    var g = (muted ? 0 : Math.pow(level, 2) * 1.5);
    master.gain.setTargetAtTime(g, ctx.currentTime, .08);
    if (muted) { setTimeout(function () { if (muted && ctx.state === 'running') ctx.suspend(); }, 500); }
    else if (ctx.state === 'suspended') ctx.resume();
    paint();
  }
  function start() {
    if (ctx || muted) return;
    try {
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0;
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3.5;
      master.connect(comp); comp.connect(ctx.destination); eng = createEngine(ctx, master);
      if (ctx.state === 'suspended') ctx.resume();
      eng.setAct(currentAct(), ctx.currentTime, false); eng.run(ctx.currentTime, 1.2);
      timer = setInterval(function () { if (ctx.state === 'running') eng.run(ctx.currentTime, 1.2); }, 400);
      apply();
    } catch (e) { ctx = null; root.setAttribute('data-sound', 'off'); }
  }
  /* Desbloqueio de áudio em celulares (iOS/Android): contexto criado e retomado dentro de um gesto,
     buffer silencioso, audioSession "playback" (ignora a chave de silêncio do iPhone) e <audio> mudo. */
  var unlocked = false, keep = null;
  function silentSrc() {
    var n = 800, b = new Uint8Array(44 + n), dv = new DataView(b.buffer);
    function w(o, s) { for (var i = 0; i < s.length; i++) b[o + i] = s.charCodeAt(i); }
    w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, 8000, true); dv.setUint32(28, 8000, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true); w(36, 'data'); dv.setUint32(40, n, true);
    for (var i = 0; i < n; i++) b[44 + i] = 128;
    var s = ''; for (var j = 0; j < b.length; j++) s += String.fromCharCode(b[j]); return 'data:audio/wav;base64,' + btoa(s);
  }
  function unlock(e) {
    // Os controles de som cuidam do proprio gesto; sem isto, o pointerdown ligava e o click do botao desligava em seguida.
    if (e && e.target && e.target.closest && e.target.closest('.vl-film-sound')) return;
    if (muted) return;
    if (!ctx) start();
    if (!ctx) return;
    if (ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
    if (unlocked) return; unlocked = true;
    try { var b1 = ctx.createBuffer(1, 1, 22050), s1 = ctx.createBufferSource(); s1.buffer = b1; s1.connect(ctx.destination); s1.start(0); } catch (e) {}
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    try { keep = new Audio(silentSrc()); keep.loop = true; keep.setAttribute('playsinline', ''); keep.volume = .01; var pr = keep.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {}
  }
  ['touchend', 'click', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, unlock, true); });
  btn.addEventListener('click', function () {
    // Em repouso (sem contexto de audio ainda), o primeiro toque no alto-falante LIGA a trilha; depois alterna.
    if (!ctx && !muted) { if (level === 0) level = .7; save(); start(); return; }
    muted = !muted; if (!muted && level === 0) level = .7; save(); if (!ctx && !muted) start(); else apply();
  });
  vol.addEventListener('input', function () { level = vol.value / 100; if (level > 0 && muted) muted = false; save(); if (!ctx) start(); else apply(); });
  root.addEventListener('change', function (e) {
    var t = e.target; if (!ctx || muted) return;
    if (t.name === 'film-scene') eng.setAct(+t.id.split('-').pop(), ctx.currentTime, true);
    else if (t.id === 'film-open-cut' && t.checked) eng.slice(ctx.currentTime);
    else if (t.name === 'film-lens' || t.name === 'vl-skin-accent' || t.name === 'film-ar') eng.tick(ctx.currentTime);
  });
  document.addEventListener('visibilitychange', function () { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (!muted) ctx.resume(); });
  document.addEventListener('pageshow', function () { if (ctx && !muted && ctx.state !== 'running') ctx.resume(); });
  paint();
})();
