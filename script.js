/* ==========================================================================
   ROMANTIC BIRTHDAY SURPRISE APP LOGIC & STATE MACHINE
   ========================================================================== */

// Page State Machine Configuration
const PAGES = {
    ADMIN: 'page-admin',
    BIRTHDAY: 'page-birthday',
    LOVER: 'page-lover',
    PROPOSAL: 'page-proposal',
    REJECTION: 'page-rejection',
    HAPPY_BIRTHDAY: 'page-happy-birthday'
};

let currentPageId = PAGES.ADMIN;
let isMusicPlaying = false;
let audioCtx = null;
let musicInterval = null;

// ==========================================
// 1. PAGE NAVIGATION & TRANSITIONS
// ==========================================
function navigateTo(targetPageId) {
    const currentPage = document.getElementById(currentPageId);
    const targetPage = document.getElementById(targetPageId);

    if (!targetPage) return;

    if (currentPage) {
        currentPage.classList.remove('active');
        currentPage.classList.add('hidden');
    }

    targetPage.classList.remove('hidden');
    // Force reflow for animation restart
    void targetPage.offsetWidth;
    targetPage.classList.add('active');

    currentPageId = targetPageId;

    // Trigger celebration effects if entering Happy Birthday page
    if (targetPageId === PAGES.HAPPY_BIRTHDAY) {
        triggerConfetti();
        playChimeSound();
    }
}

// ==========================================
// 2. ADMIN LOGIN HANDLER
// ==========================================
function handleAdminLogin() {
    const userVal = document.getElementById('admin-user').value.trim();
    const passVal = document.getElementById('admin-pass').value.trim();
    const errorEl = document.getElementById('admin-error');

    // Admin login requires username 'buv' and passcode 'krish'
    if (userVal.toLowerCase() === 'buv' && passVal.toLowerCase() === 'krish') {
        errorEl.classList.remove('show');
        playClickSound();
        navigateTo(PAGES.BIRTHDAY);
    } else {
        errorEl.textContent = 'Incorrect username or passcode';
        errorEl.classList.add('show');
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth;
        errorEl.style.animation = 'shake 0.4s ease-in-out';
    }
}

// ==========================================
// 3. BIRTHDAY VERIFICATION HANDLER
// ==========================================
function handleBirthdayVerification() {
    const inputVal = document.getElementById('birthday-input').value.trim();
    const errorEl = document.getElementById('birthday-error');

    // Clean user input for flexible match (31.10.2005, 31/10/2005, 31-10-2005, 2005-10-31)
    const cleanedInput = inputVal.replace(/[/.-]/g, '');

    // Target date: 31102005 or 20051031
    if (cleanedInput === '31102005' || cleanedInput === '20051031') {
        errorEl.classList.remove('show');
        playClickSound();
        navigateTo(PAGES.LOVER);
    } else {
        errorEl.classList.add('show');
        // Re-trigger shake animation
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth;
        errorEl.style.animation = 'shake 0.4s ease-in-out';
    }
}

// ==========================================
// 4. LOVER SELECTION HANDLER
// ==========================================
function selectLover(choice) {
    const errorEl = document.getElementById('lover-error');

    if (choice === 'A') {
        errorEl.classList.remove('show');
        playClickSound();
        navigateTo(PAGES.PROPOSAL);
    } else {
        errorEl.classList.add('show');
        playErrorSound();
        const btnB = document.getElementById('btn-lover-b');
        btnB.style.transform = 'scale(0.9) rotate(8deg)';
        setTimeout(() => {
            btnB.style.transform = '';
        }, 300);
    }
}

// ==========================================
// 5. MARRIAGE PROPOSAL HANDLER
// ==========================================
function handleProposalChoice(isYes) {
    playClickSound();
    if (isYes) {
        navigateTo(PAGES.HAPPY_BIRTHDAY);
    } else {
        navigateTo(PAGES.REJECTION);
    }
}

// ==========================================
// 6. REJECTION PAGE HANDLER
// ==========================================
function handleRejectionClick() {
    const btn = document.getElementById('btn-please-say-yes');
    
    // Change button text to YES with feeling emojis
    btn.innerHTML = 'YES 💖🥹✨';
    btn.style.transform = 'scale(1.15)';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    btn.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';

    playChimeSound();
    triggerConfetti();

    // Smooth transition to Happy Birthday Page after brief pause
    setTimeout(() => {
        navigateTo(PAGES.HAPPY_BIRTHDAY);
    }, 800);
}

// ==========================================
// 7. INTERACTIVE CAKE CANDLES HANDLER
// ==========================================
let candlesBlown = false;

function blowOutCandles() {
    if (candlesBlown) return;

    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => flame.classList.add('extinguished'));

    candlesBlown = true;
    document.getElementById('cake-status-text').innerHTML = '🎉 Wish Granted! Candles Blown Out! ✨';
    
    playChimeSound();
    triggerConfetti();
}

function restartSurprise() {
    // Reset cake flames
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => flame.classList.remove('extinguished'));
    candlesBlown = false;
    document.getElementById('cake-status-text').innerHTML = '👇 Tap the candles to blow them out!';

    // Reset rejection button
    const rejectionBtn = document.getElementById('btn-please-say-yes');
    if (rejectionBtn) {
        rejectionBtn.innerHTML = 'Please say yes';
        rejectionBtn.style.transform = '';
        rejectionBtn.style.background = '';
        rejectionBtn.style.boxShadow = '';
    }

    navigateTo(PAGES.BIRTHDAY);
}

// ==========================================
// 8. AUDIO SYNTHESIZER & MUSIC PLAYER
// ==========================================
function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
}

function toggleMusic() {
    initAudio();
    const btn = document.getElementById('music-control-btn');
    const icon = document.getElementById('music-icon');
    const bgmAudio = document.getElementById('bgm-audio');

    if (isMusicPlaying) {
        if (musicInterval) clearTimeout(musicInterval);
        if (bgmAudio) bgmAudio.pause();
        isMusicPlaying = false;
        if (btn) {
            btn.style.background = 'rgba(30, 41, 59, 0.85)';
            btn.style.color = '#38bdf8';
        }
        if (icon) icon.textContent = '🎵';
    } else {
        isMusicPlaying = true;
        if (btn) {
            btn.style.background = 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)';
            btn.style.color = '#ffffff';
        }
        if (icon) icon.textContent = '🎶';

        // Try playing MP3 audio file first if present
        if (bgmAudio && bgmAudio.src) {
            bgmAudio.play().then(() => {
                // MP3 playing successfully
            }).catch(() => {
                // Fallback to Web Audio API Synth Melody
                playMelodyLoop();
            });
        } else {
            playMelodyLoop();
        }
    }
}

const musicControlBtnEl = document.getElementById('music-control-btn');
if (musicControlBtnEl) {
    musicControlBtnEl.addEventListener('click', toggleMusic);
}

function playRichNote(freq, dur = 0.5) {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;

        // 1. Lead Violin/Flute Acoustic Voice (Triangle Wave)
        const oscLead = audioCtx.createOscillator();
        const gainLead = audioCtx.createGain();
        oscLead.type = 'triangle';
        oscLead.frequency.setValueAtTime(freq, now);

        gainLead.gain.setValueAtTime(0.001, now);
        gainLead.gain.linearRampToValueAtTime(0.09, now + 0.08);
        gainLead.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.2);

        oscLead.connect(gainLead);
        gainLead.connect(audioCtx.destination);
        oscLead.start(now);
        oscLead.stop(now + dur + 0.25);

        // 2. Warm Strings Harmony Voice (Sine 5th Interval)
        const oscHarmony = audioCtx.createOscillator();
        const gainHarmony = audioCtx.createGain();
        oscHarmony.type = 'sine';
        oscHarmony.frequency.setValueAtTime(freq * 1.5, now); // Perfect 5th

        gainHarmony.gain.setValueAtTime(0.001, now);
        gainHarmony.gain.linearRampToValueAtTime(0.025, now + 0.1);
        gainHarmony.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.15);

        oscHarmony.connect(gainHarmony);
        gainHarmony.connect(audioCtx.destination);
        oscHarmony.start(now);
        oscHarmony.stop(now + dur + 0.2);

        // 3. Deep Bass Voice (Sub Octave)
        const oscBass = audioCtx.createOscillator();
        const gainBass = audioCtx.createGain();
        oscBass.type = 'sine';
        oscBass.frequency.setValueAtTime(freq / 2, now);

        gainBass.gain.setValueAtTime(0.001, now);
        gainBass.gain.linearRampToValueAtTime(0.04, now + 0.05);
        gainBass.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.3);

        oscBass.connect(gainBass);
        gainBass.connect(audioCtx.destination);
        oscBass.start(now);
        oscBass.stop(now + dur + 0.35);

    } catch (e) {
        console.warn('Rich Audio play error', e);
    }
}

function playMelodyLoop() {
    // Perfect Musical Score for Adiye - "Vaa Senthazhini" & Tamil Love BGM Medley
    const vaaSenthazhiniMelody = [
        // --- Vaa Senthazhini Motif ---
        { note: 392.00, dur: 0.50 }, // G4 - Vaa
        { note: 440.00, dur: 0.50 }, // A4 - Sen-
        { note: 523.25, dur: 0.65 }, // C5 - tha-
        { note: 493.88, dur: 0.38 }, // B4 - zhi-
        { note: 440.00, dur: 0.38 }, // A4 - ni
        { note: 392.00, dur: 0.75 }, // G4
        
        { note: 329.63, dur: 0.45 }, // E4
        { note: 392.00, dur: 0.45 }, // G4
        { note: 440.00, dur: 0.50 }, // A4
        { note: 392.00, dur: 0.38 }, // G4
        { note: 349.23, dur: 0.38 }, // F4
        { note: 329.63, dur: 0.50 }, // E4
        { note: 293.66, dur: 0.80 }, // D4

        { note: 392.00, dur: 0.50 }, // G4
        { note: 523.25, dur: 0.55 }, // C5
        { note: 493.88, dur: 0.38 }, // B4
        { note: 523.25, dur: 0.50 }, // C5
        { note: 587.33, dur: 0.60 }, // D5
        { note: 493.88, dur: 0.38 }, // B4
        { note: 523.25, dur: 0.80 }, // C5

        { note: 440.00, dur: 0.50 }, // A4
        { note: 523.25, dur: 0.50 }, // C5
        { note: 493.88, dur: 0.38 }, // B4
        { note: 440.00, dur: 0.38 }, // A4
        { note: 392.00, dur: 0.50 }, // G4
        { note: 349.23, dur: 0.38 }, // F4
        { note: 392.00, dur: 0.90 }, // G4

        // --- Romantic Interlude ---
        { note: 523.25, dur: 0.55 }, // C5
        { note: 587.33, dur: 0.55 }, // D5
        { note: 659.25, dur: 0.70 }, // E5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 523.25, dur: 0.65 }, // C5
        { note: 440.00, dur: 0.80 }  // A4
    ];

    let noteIdx = 0;

    function playStep() {
        if (!isMusicPlaying) return;
        const current = vaaSenthazhiniMelody[noteIdx];
        playRichNote(current.note, current.dur);

        noteIdx = (noteIdx + 1) % vaaSenthazhiniMelody.length;
        musicInterval = setTimeout(playStep, current.dur * 740);
    }

    playStep();
}

function playNote(freq, type = 'sine', duration = 0.2, gainVal = 0.08) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Audio play note error', e);
    }
}

function playClickSound() {
    try {
        initAudio();
        playNote(523.25, 'sine', 0.15, 0.12);
    } catch (e) {}
}

function playChimeSound() {
    try {
        initAudio();
        playNote(523.25, 'triangle', 0.2, 0.15);
        setTimeout(() => playNote(659.25, 'triangle', 0.2, 0.15), 100);
        setTimeout(() => playNote(783.99, 'triangle', 0.3, 0.15), 200);
    } catch (e) {}
}

function playErrorSound() {
    try {
        initAudio();
        playNote(220, 'sawtooth', 0.2, 0.1);
    } catch (e) {}
}

// ==========================================
// 9. BACKGROUND PARTICLES CANVAS
// ==========================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleIcons = ['💖', '🌸', '✨', '☁️', '🤍'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.speedY = -(0.5 + Math.random() * 1.2);
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.icon = particleIcons[Math.floor(Math.random() * particleIcons.length)];
        this.size = 14 + Math.random() * 16;
        this.opacity = 0.3 + Math.random() * 0.5;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < -30) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px serif`;
        ctx.fillText(this.icon, this.x, this.y);
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 35), 30);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==========================================
// 10. CONFETTI PARTICLE SYSTEM
// ==========================================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let isConfettiRunning = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

const CONFETTI_COLORS = ['#38bdf8', '#7dd3fc', '#fda4af', '#f43f5e', '#fbbf24', '#ffffff'];

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
        this.size = 8 + Math.random() * 8;
        this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        this.speedY = 2 + Math.random() * 4;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 6;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate((this.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = this.color;
        confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        confettiCtx.restore();
    }
}

function triggerConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 120; i++) {
        confettiPieces.push(new ConfettiPiece());
    }

    if (!isConfettiRunning) {
        isConfettiRunning = true;
        animateConfetti();
    }
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiPieces.forEach((p, idx) => {
        p.update();
        p.draw();
    });

    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20);

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        isConfettiRunning = false;
    }
}
