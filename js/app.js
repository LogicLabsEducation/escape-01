import { missionConfig } from './puzzles.js';

// --- Constants & Config ---
const STORAGE_KEY = 'escape_protocol_progress';

// --- State Management ---
const initialState = {
    currentPuzzleIndex: 0,
    isComplete: false,
    wrongAttempts: 0
};

function getState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialState;
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
}

// --- Audio System (Web Audio API) ---
class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.3; // Default volume
    }

    playTone(freq, type, duration, startTime = 0) {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    // SFX Presets
    click() {
        // High mechanical click
        this.playTone(800, 'square', 0.05);
        this.playTone(1200, 'square', 0.01, 0.01);
    }

    hover() {
        // Very short, high blip
        this.playTone(2000, 'sine', 0.03);
    }

    success() {
        // Major Arpeggio (C Majorish)
        const now = 0;
        this.playTone(523.25, 'square', 0.1, now);       // C5
        this.playTone(659.25, 'square', 0.1, now + 0.1); // E5
        this.playTone(783.99, 'square', 0.2, now + 0.2); // G5
        this.playTone(1046.50, 'square', 0.4, now + 0.3); // C6
    }

    error() {
        // Dissonant low buzz
        this.playTone(150, 'sawtooth', 0.3);
        this.playTone(140, 'sawtooth', 0.3, 0.05); // slightly detuned
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

const audio = new AudioController();

function playSound(type) {
    if (audio.ctx.state === 'suspended') {
        audio.ctx.resume();
    }

    if (audio[type]) {
        audio[type]();
    }
}

function toggleMute() {
    const isMuted = audio.toggleMute();
    const btn = document.getElementById('mute-btn');
    btn.textContent = isMuted ? "[UNMUTE]" : "[MUTE]";
    btn.classList.toggle('text-red-500', isMuted);
}

// --- DOM Elements ---
const dom = {
    intro: document.getElementById('intro-screen'),
    victory: document.getElementById('victory-screen'),
    warpField: document.getElementById('warp-field'),
    startBtn: document.getElementById('start-btn'),
    app: document.getElementById('app'),
    output: document.getElementById('terminal-output'),
    input: document.getElementById('command-input'),
    missionName: document.getElementById('mission-name'),
    systemStatus: document.getElementById('system-status'),
    resetBtn: document.getElementById('reset-btn'),
    resetBtn: document.getElementById('reset-btn'),
    muteBtn: document.getElementById('mute-btn'),
    progressBar: document.getElementById('progress-bar')
};

// --- Terminal Logic ---
function appendLog(html, type = 'info') {
    const div = document.createElement('div');
    if (type === 'user') {
        div.className = "text-white mt-2";
        div.innerHTML = `<span class="text-terminal-green mr-2">></span> ${html}`;
    } else if (type === 'error') {
        div.className = "text-red-500";
        div.innerHTML = `[ERROR] ${html}`;
    } else if (type === 'success') {
        div.className = "text-terminal-green font-bold";
        div.innerHTML = `[SUCCESS] ${html}`;
    } else {
        div.className = "text-terminal-dim"; // System info
        div.innerHTML = html;
    }

    dom.output.appendChild(div);
    scrollToBottom();
}

function appendPuzzle(puzzle) {
    const div = document.createElement('div');
    div.className = "mt-6 border-l-2 border-terminal-green pl-4 py-2";
    div.innerHTML = `
        <h2 class="text-lg font-bold text-white mb-2">/// MISSION: ${puzzle.title} ///</h2>
        <div class="text-lg leading-relaxed">${puzzle.prompt}</div>
    `;
    dom.output.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    dom.output.scrollTop = dom.output.scrollHeight;
}

// --- Game Logic ---
function initGame() {
    const state = getState();

    // UI Init
    dom.missionName.textContent = missionConfig.title;

    // Start Screen Listener
    dom.startBtn.addEventListener('click', () => {
        // Resume Audio
        if (audio.ctx.state === 'suspended') {
            audio.ctx.resume();
        }
        playSound('success'); // Boot sound

        // UI Transition
        dom.intro.classList.add('hidden');
        dom.app.classList.remove('hidden');

        // Start Game Focus
        dom.input.focus();
        // Start Game Focus
        dom.input.focus();
    });

    // Initial UI Update
    updateProgressBar(state);

    // Event Listeners
    dom.input.addEventListener('keydown', handleInput);
    dom.resetBtn.addEventListener('click', resetState);
    dom.muteBtn.addEventListener('click', toggleMute);

    // Initial Render
    if (state.isComplete) {
        showWinState();
    } else {
        renderCurrentLevel(state);
    }

    // Interactive Audio Feedack
    const interactables = [dom.resetBtn, dom.muteBtn, dom.input];
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click')); // General click feedback
    });

    // Focus Keep-alive
    document.addEventListener('click', (e) => {
        if (!dom.app.classList.contains('hidden') && !e.target.closest('button')) {
            dom.input.focus();
        }
        // Ensure AudioContext is resuming on user gesture anywhere
        if (audio.ctx.state === 'suspended') audio.ctx.resume();
    });
}

function renderCurrentLevel(state) {
    const puzzle = missionConfig.puzzles[state.currentPuzzleIndex];
    if (puzzle) {
        appendPuzzle(puzzle);
    } else {
        showWinState();
    }
}

function handleInput(e) {
    if (e.key !== 'Enter') {
        // Typing Sound
        playSound('click');
        return;
    }

    const rawInput = dom.input.value;
    // Sanitization: Remove non-alphanumeric, convert to uppercase
    const input = rawInput.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    dom.input.value = '';
    if (!input) return;

    appendLog(rawInput, 'user'); // Show what they typed originally


    // Process Command
    processCommand(input);
}

function processCommand(input) {
    const state = getState();

    if (state.isComplete) {
        appendLog("Mission already complete. Reset to restart.", "info");
        return;
    }

    const currentPuzzle = missionConfig.puzzles[state.currentPuzzleIndex];

    // Obfuscation / Validation Logic
    const encoded = btoa(input);

    if (encoded === currentPuzzle.hash) {
        // Success
        handleSuccess(state, currentPuzzle);
    } else {
        // Failure
        handleFailure(state, currentPuzzle);
    }
}

function handleSuccess(state, puzzle) {
    playSound('success');
    appendLog(puzzle.successMsg || "ACCESS GRANTED.", "success");

    state.currentPuzzleIndex++;
    state.wrongAttempts = 0; // Reset for next puzzle

    if (state.currentPuzzleIndex >= missionConfig.puzzles.length) {
        state.isComplete = true;
        saveState(state);
        setTimeout(showWinState, 1000);
    } else {
        saveState(state);
        setTimeout(() => {
            renderCurrentLevel(state);
        }, 800);
    }
    updateProgressBar(state);
}

function handleFailure(state, puzzle) {
    playSound('error');
    appendLog("ACCESS DENIED. INVALID CREDENTIALS.", "error");

    state.wrongAttempts++;
    saveState(state);

    if (state.wrongAttempts >= 3) {
        // Trigger Hint
        const hintMsg = puzzle.hint || "REFER TO VISUAL DATA IN MISSION LOG.";
        setTimeout(() => {
            appendLog(`/// HINT: ${hintMsg} ///`, 'warning');
            playSound('hover'); // Gentle alert
        }, 500);
    }

    const container = dom.input.parentElement;
    container.classList.add('animate-[pulse_0.2s_ease-in-out_2]');
    setTimeout(() => {
        container.classList.remove('animate-[pulse_0.2s_ease-in-out_2]');
    }, 500);
}

function showWinState() {
    // Hide Game
    dom.app.classList.add('hidden');
    dom.victory.classList.remove('hidden');

    // Trigger Warp Animation
    createWarpStars();

    // Final Audio
    playSound('success');

    // Reset State for next reload
    localStorage.removeItem(STORAGE_KEY);
}

function createWarpStars() {
    // Create 100 stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'warp-star';

        // Random Position & Delay
        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        const delay = Math.random() * 2;

        star.style.transform = `translate(${x}px, ${y}px)`;
        star.style.animationDelay = `${delay}s`;

        dom.warpField.appendChild(star);
    }
}

function updateProgressBar(state) {
    const total = missionConfig.puzzles.length;
    const current = state.currentPuzzleIndex;
    const percent = Math.min(100, Math.round((current / total) * 100));

    if (dom.progressBar) {
        dom.progressBar.style.width = `${percent}%`;
    }
}

// Start
window.addEventListener('DOMContentLoaded', initGame);
