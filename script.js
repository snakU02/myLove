const particlesContainer = document.getElementById('particles-container');
const polaroidStack = document.getElementById('polaroid-stack');
const nextMemoryBtn = document.getElementById('next-memory-btn');
const memoryTitle = document.getElementById('memory-title');
const memoryCount = document.getElementById('memory-count');
const giftBox = document.getElementById('gift-box');
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letter-content');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const scenes = {
    0: document.getElementById('scene-0'),
    1: document.getElementById('scene-1'),
    2: document.getElementById('scene-2'),
    3: document.getElementById('scene-3'),
    final: document.getElementById('success-screen')
};

// --- Particles System (Only starts when Valentine theme activates) ---
let particlesActive = false;
function createHeart() {
    if (!particlesActive) return;
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's';
    heart.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');
    particlesContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 600);

// --- Memory Lane Logic (Scene 0) ---
const totalPhotos = 10;
let currentPhotoIndex = 1;

// Initialize polaroids
function initPolaroids() {
    for (let i = totalPhotos; i >= 1; i--) {
        const polaroid = document.createElement('div');
        polaroid.classList.add('polaroid');
        polaroid.style.zIndex = totalPhotos - i;
        polaroid.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`;

        const img = document.createElement('img');
        img.src = `Photo/${i}.jpg`;
        img.alt = `Memory ${i}`;

        polaroid.appendChild(img);
        polaroidStack.appendChild(polaroid);
    }
}
initPolaroids();

nextMemoryBtn.addEventListener('click', () => {
    if (currentPhotoIndex <= totalPhotos) {
        const topPolaroid = polaroidStack.lastElementChild;
        if (topPolaroid) {
            topPolaroid.style.transform = `translate(500px, -100px) rotate(45deg)`;
            topPolaroid.style.opacity = '0';
            setTimeout(() => topPolaroid.remove(), 600);
        }

        currentPhotoIndex++;

        if (currentPhotoIndex <= totalPhotos) {
            memoryCount.innerText = `${currentPhotoIndex} / ${totalPhotos}`;
            updateTheme(currentPhotoIndex);
        } else {
            // End of photos
            setTimeout(() => switchScene(0, 1), 800);
        }
    }
});

function updateTheme(index) {
    if (index === 4) {
        memoryTitle.innerText = "And we grew together...";
    }
    if (index === 7) {
        document.body.classList.add('valentine-theme');
        memoryTitle.innerText = "Every moment became special.";
        particlesActive = true;
    }
    if (index === 10) {
        memoryTitle.innerText = "To our most recent memory.";
    }
}

// --- Scene Management ---
const celebPhotosBg = document.getElementById('celebration-photos-bg');

function switchScene(from, to) {
    scenes[from].classList.remove('active');
    scenes[from].classList.add('hidden');
    setTimeout(() => {
        scenes[to].classList.remove('hidden');
        scenes[to].classList.add('active');
        // Ensure theme is active if we jumped to scene 1
        document.body.classList.add('valentine-theme');
        particlesActive = true;

        if (to === 'final') {
            setupCelebration();
        }
    }, 800);
}

// --- Celebration Decor Logic ---
const lastPhotosDir = "Last/";
const lastPhotos = [
    "IMG_20260209_215250_142.jpg",
    "IMG_20260209_215303_720.jpg",
    "IMG_20260209_215336_452.jpg",
    "IMG_20260209_215351_537.jpg",
    "IMG_20260209_215431_658.jpg",
    "IMG_20260209_215650_792.jpg",
    "IMG_20260209_215733_755.jpg",
    "IMG_20260209_215753_538.jpg",
    "IMG_20260209_215841_386.jpg"
];
const celebrationVideo = "Messenger_creation_B6058144-8B68-41AA-A1E5-2CAA93890AEE.mp4";

function setupCelebration() {
    if (!celebPhotosBg) return;
    celebPhotosBg.innerHTML = ''; // Clear

    // Scatter photos
    lastPhotos.forEach((file) => {
        const img = document.createElement('img');
        img.src = lastPhotosDir + file;
        img.classList.add('bg-item');
        applyRandomFloatingStyle(img);
        celebPhotosBg.appendChild(img);
    });

    // Add moving video
    const video = document.createElement('video');
    video.src = lastPhotosDir + celebrationVideo;
    video.classList.add('bg-item', 'bg-video');
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    applyRandomFloatingStyle(video);
    celebPhotosBg.appendChild(video);
    video.play().catch(() => { });
}

function applyRandomFloatingStyle(el) {
    el.style.left = (Math.random() * 90) + '%';
    el.style.top = (Math.random() * 90) + '%';
    const moveRange = 400;
    el.style.setProperty('--mx1', `${(Math.random() - 0.5) * moveRange * 2}px`);
    el.style.setProperty('--my1', `${(Math.random() - 0.5) * moveRange * 2}px`);
    el.style.setProperty('--mx2', `${(Math.random() - 0.5) * moveRange * 2}px`);
    el.style.setProperty('--my2', `${(Math.random() - 0.5) * moveRange * 2}px`);
    el.style.setProperty('--rot', (Math.random() - 0.5) * 80 + 'deg');
    el.style.setProperty('--dur', (Math.random() * 10 + 20) + 's');
    el.style.animationDelay = (Math.random() * -30) + 's';
}

// --- Interaction Logic ---

// Scene 1 -> 2
giftBox.addEventListener('click', () => {
    giftBox.style.transform = 'scale(0) rotate(20deg)';
    setTimeout(() => switchScene(1, 2), 500);
});

// Scene 2 Sequence
const letterMessages = [
    "Looking back at these photos...",
    "I realize how much you mean to me.",
    "Every laugh, every trip, every small moment...",
    "They all led to this very second.",
    "And now, I have a question to ask you."
];

let messageIndex = 0;
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        setTimeout(showNextMessage, 600);
    } else if (messageIndex < letterMessages.length) {
        showNextMessage();
    } else {
        switchScene(2, 3);
    }
});

function showNextMessage() {
    letterContent.style.opacity = 0;
    setTimeout(() => {
        letterContent.innerText = letterMessages[messageIndex];
        letterContent.style.opacity = 1;
        messageIndex++;
    }, 300);
}

// Scene 3 Interaction
let noClickCount = 0;
const noMessages = [
    "Are you sure?",
    "Think again! 🥺",
    "Really really sure??",
    "Look at the Yes button!",
    "It's growing for you!",
    "I'll keep asking!",
    "Give it one more thought!",
    "Okay, last chance..."
];

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);

function moveNoButton() {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';

    if (noClickCount < noMessages.length) {
        noBtn.innerText = noMessages[noClickCount];
        noClickCount++;
    }

    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = (currentSize * 1.15) + 'px';
}

yesBtn.addEventListener('click', () => {
    switchScene(3, 'final');
    for (let i = 0; i < 50; i++) {
        setTimeout(createHeart, i * 30);
    }
});
