// Step 1: Heart Click & Confetti
const heartBtn = document.getElementById('heartBtn');
const anniversaryMessage = document.getElementById('anniversaryMessage');
const instructionText = document.getElementById('instruction-text');
const nextBtn = document.getElementById('nextBtn');

heartBtn.addEventListener('click', () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  heartBtn.style.display = 'none';
  instructionText.style.display = 'none';
  anniversaryMessage.style.display = 'block';
});

// Step 2: Next button to show 5 cards
nextBtn.addEventListener('click', () => {
  document.getElementById('screen-envelope').classList.remove('active');
  document.getElementById('screen-cards').classList.add('active');
});

// Modal Handler
function openGame(type) {
  closeModal();
  if (type === 'wordsearch') {
    document.getElementById('modal-wordsearch').style.display = 'flex';
    initWordSearch();
  } else if (type === 'card2') {
    document.getElementById('modal-card2').style.display = 'flex';
    initDotsGame();
  } else if (type === 'heartvideo') {
    document.getElementById('modal-heartvideo').style.display = 'flex';
    resetHeartGame();
  } else if (type === 'photobooth') {
    document.getElementById('modal-photobooth').style.display = 'flex';
    resetPhotobooth();
  } else if (type === 'matching') {
    document.getElementById('modal-matching').style.display = 'flex';
    initMatchingGame();
  }
}

function closeModal() {
  const anniversaryVideo = document.getElementById('anniversaryVideo');
  if (anniversaryVideo) anniversaryVideo.pause();
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

/* ================= WORD SEARCH GAME ================= */
const wsWords = ["AMAZING", "BOYFRIEND", "CARING", "ONEYEAR", "ALWAYS", "FOREVER"];
const gridLetters = [
  ['A','M','A','Z','I','N','G','X','B','O'],
  ['B','O','Y','F','R','I','E','N','D','N'],
  ['C','A','R','I','N','G','Q','W','E','E'],
  ['R','T','Y','U','I','O','P','A','S','Y'],
  ['F','O','R','E','V','E','R','D','F','E'],
  ['G','H','J','K','L','Z','X','C','V','A'],
  ['A','L','W','A','Y','S','B','N','M','R'],
  ['O','N','U','Y','0','A','R','Q','W','E'],
  ['E','R','T','Y','U','I','O','P','A','S'],
  ['D','F','G','H','J','K','L','Z','X','C']
];

let selectedCells = [];
let foundWords = new Set();

function initWordSearch() {
  const container = document.getElementById('wordsearch-grid');
  container.innerHTML = '';
  selectedCells = [];
  foundWords.clear();
  document.getElementById('ws-reward').classList.add('hidden');

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.innerText = gridLetters[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => handleCellClick(cell));
      container.appendChild(cell);
    }
  }
}

function handleCellClick(cell) {
  if (cell.classList.contains('found')) return;

  if (cell.classList.contains('selected')) {
    cell.classList.remove('selected');
    selectedCells = selectedCells.filter(c => c !== cell);
  } else {
    cell.classList.add('selected');
    selectedCells.push(cell);
  }

  checkWordSearch();
}

function checkWordSearch() {
  const selectedText = selectedCells.map(c => c.innerText).join('');
  
  wsWords.forEach(word => {
    if (selectedText.includes(word) && !foundWords.has(word)) {
      foundWords.add(word);
      selectedCells.forEach(c => {
        c.classList.remove('selected');
        c.classList.add('found');
      });
      selectedCells = [];
    }
  });

  if (foundWords.size >= 4) {
    document.getElementById('ws-reward').classList.remove('hidden');
    confetti({ particleCount: 80, spread: 60 });
  }
}

/* ================= CARD 2: DOTS -> QUIZ -> SCROLL ================= */
const dots = [
  { x: 150, y: 190, id: 1 },
  { x: 70, y: 110, id: 2 }, 
  { x: 105, y: 60, id: 3 }, 
  { x: 150, y: 95, id: 4 }, 
  { x: 195, y: 60, id: 5 }  
];

let nextDot = 1;
let connectedDots = [];

function initDotsGame() {
  nextDot = 1;
  connectedDots = [];
  document.getElementById('dots-stage').style.display = 'block';
  document.getElementById('quiz-stage').classList.add('hidden');
  document.getElementById('scroll-stage').classList.add('hidden');
  
  document.querySelectorAll('.quiz-group input').forEach(input => input.value = '');
  document.getElementById('quizFeedback').innerText = '';

  renderDots();
}

function renderDots() {
  const canvas = document.getElementById('dotsCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (connectedDots.length > 1) {
    ctx.beginPath();
    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 4;
    ctx.moveTo(connectedDots[0].x, connectedDots[0].y);
    for (let i = 1; i < connectedDots.length; i++) {
      ctx.lineTo(connectedDots[i].x, connectedDots[i].y);
    }
    ctx.stroke();
  }

  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = (dot.id < nextDot) ? '#ff4d6d' : '#ee9ca7';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dot.id, dot.x, dot.y);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dotsCanvas');
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const targetDot = dots.find(d => d.id === nextDot);
      if (targetDot) {
        const dist = Math.hypot(clickX - targetDot.x, clickY - targetDot.y);
        if (dist <= 20) {
          connectedDots.push(targetDot);
          nextDot++;
          renderDots();

          if (nextDot > dots.length) {
            connectedDots.push(dots[0]);
            renderDots();

            setTimeout(() => {
              alert("haha you thought it was that easy darling 😂❤️️");
              document.getElementById('dots-stage').style.display = 'none';
              document.getElementById('quiz-stage').classList.remove('hidden');
            }, 300);
          }
        }
      }
    });
  }
});

function checkQuizAnswers() {
  const q1 = document.getElementById('q1').value.trim().toLowerCase();
  const q2 = document.getElementById('q2').value.trim().toLowerCase();
  const q3 = document.getElementById('q3').value.trim().toLowerCase();
  const q4 = document.getElementById('q4').value.trim().toLowerCase();
  const q5 = document.getElementById('q5').value.trim().toLowerCase();

  const feedback = document.getElementById('quizFeedback');

  const isQ1Correct = q1.includes('purple');
  const isQ2Correct = q2.includes('22/10/2025') || q2.includes('22-10-202') || q2.includes('22 October 2025');
  const isQ3Correct = q3.includes('soulmate');
  const isQ4Correct = q4.includes('arms') || q4.includes('hug') || q4.includes('heart');
  const isQ5Correct = q5.includes('back');

  if (isQ1Correct && isQ2Correct && isQ3Correct && isQ4Correct && isQ5Correct) {
    feedback.innerText = "";
    confetti({ particleCount: 120, spread: 80 });

    document.getElementById('quiz-stage').classList.add('hidden');
    document.getElementById('scroll-stage').classList.remove('hidden');
  } else {
    feedback.innerText = "Oops! Some answers are incorrect. Try again, darling! 💕";
  }
}

/* ================= CARD 3: GROWING HEART & VIDEO ================= */
let heartClicks = 0;
const maxClicks = 10;

function resetHeartGame() {
  heartClicks = 0;
  const clickCountDisplay = document.getElementById('clickCount');
  const growingHeart = document.getElementById('growingHeart');
  const heartStage = document.getElementById('heart-stage');
  const videoStage = document.getElementById('video-stage');
  const anniversaryVideo = document.getElementById('anniversaryVideo');

  if (clickCountDisplay) clickCountDisplay.innerText = heartClicks;
  if (growingHeart) growingHeart.style.transform = 'scale(1)';
  if (heartStage) heartStage.style.display = 'block';
  if (videoStage) videoStage.classList.add('hidden');
  if (anniversaryVideo) {
    anniversaryVideo.pause();
    anniversaryVideo.currentTime = 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const growingHeart = document.getElementById('growingHeart');
  const clickCountDisplay = document.getElementById('clickCount');
  const heartStage = document.getElementById('heart-stage');
  const videoStage = document.getElementById('video-stage');
  const anniversaryVideo = document.getElementById('anniversaryVideo');

  if (growingHeart) {
    growingHeart.addEventListener('click', () => {
      heartClicks++;
      clickCountDisplay.innerText = heartClicks;

      let currentScale = 1 + heartClicks * 0.25;
      growingHeart.style.transform = `scale(${currentScale})`;

      if (heartClicks >= maxClicks) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          heartStage.style.display = 'none';
          videoStage.classList.remove('hidden');
          if (anniversaryVideo) {
            anniversaryVideo.play();
          }
        }, 400);
      }
    });
  }
});

/* ================= CARD 4: INTERACTIVE PHOTOBOOTH ================= */
let photosSnapped = 0;

function resetPhotobooth() {
  photosSnapped = 0;
  document.getElementById('photoCountText').innerText = photosSnapped;
  document.getElementById('snapPhotoBtn').disabled = false;
  document.getElementById('cameraCountdown').innerText = '';
  document.getElementById('frame1').classList.add('hidden');
  document.getElementById('frame2').classList.add('hidden');
  document.getElementById('frame3').classList.add('hidden');
  document.getElementById('stripHeader').classList.add('hidden');
  document.getElementById('pb-reward').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const snapBtn = document.getElementById('snapPhotoBtn');
  const countdownEl = document.getElementById('cameraCountdown');
  const flashOverlay = document.getElementById('flashOverlay');

  if (snapBtn) {
    snapBtn.addEventListener('click', () => {
      if (photosSnapped >= 3) return;

      snapBtn.disabled = true;
      let count = 3;
      countdownEl.innerText = `Say Cheese! 📸 ${count}`;

      let timer = setInterval(() => {
        count--;
        if (count > 0) {
          countdownEl.innerText = `Say Cheese! 📸 ${count}`;
        } else {
          clearInterval(timer);
          countdownEl.innerText = "FLASH! ⚡";

          flashOverlay.classList.add('flash');
          setTimeout(() => flashOverlay.classList.remove('flash'), 150);

          photosSnapped++;
          document.getElementById('photoCountText').innerText = photosSnapped;
          document.getElementById(`frame${photosSnapped}`).classList.remove('hidden');

          setTimeout(() => {
            countdownEl.innerText = '';
            if (photosSnapped < 3) {
              snapBtn.disabled = false;
            } else {
              document.getElementById('stripHeader').classList.remove('hidden');
              document.getElementById('pb-reward').classList.remove('hidden');
              confetti({ particleCount: 100, spread: 70 });
            }
          }, 500);
        }
      }, 700);
    });
  }
});

/* ================= CARD 5: CARD MATCHING GAME ================= */
const cardSymbols = ['❤️', '❤️', '💖', '💖', '💍', '💍', '✨', '✨', '🌹', '🌹', '💌', '💌'];
let flippedCards = [];
let matchedCount = 0;

function initMatchingGame() {
  const grid = document.getElementById('matchGrid');
  grid.innerHTML = '';
  flippedCards = [];
  matchedCount = 0;

  document.getElementById('match-deck-stage').style.display = 'block';
  document.getElementById('terminal-stage').classList.add('hidden');
  document.getElementById('flip-photos-stage').classList.add('hidden');
  document.getElementById('terminalText').innerText = '';

  // Unflip all 5 photo cards
  document.querySelectorAll('.flip-card').forEach(card => card.classList.remove('flipped'));

  // Shuffle symbols
  let shuffled = [...cardSymbols].sort(() => Math.random() - 0.5);

  shuffled.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('m-card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerText = '❓';

    card.addEventListener('click', () => handleMatchClick(card));
    grid.appendChild(card);
  });
}

function handleMatchClick(card) {
  if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
    return;
  }

  card.classList.add('flipped');
  card.innerText = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [c1, c2] = flippedCards;

    if (c1.dataset.symbol === c2.dataset.symbol) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      flippedCards = [];
      matchedCount += 2;

      if (matchedCount === cardSymbols.length) {
        // Game Finished!
        setTimeout(startTerminalSequence, 800);
      }
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.innerText = '❓';
        c2.innerText = '❓';
        flippedCards = [];
      }, 800);
    }
  }
}

function startTerminalSequence() {
  document.getElementById('match-deck-stage').style.display = 'none';
  document.getElementById('terminal-stage').classList.remove('hidden');

  const textToType = "one year of loving you Mihir Ramjathan(Darling)";
  const terminalEl = document.getElementById('terminalText');
  terminalEl.innerText = "";
  
  let index = 0;
  let typingTimer = setInterval(() => {
    if (index < textToType.length) {
      terminalEl.innerText += textToType.charAt(index);
      index++;
    } else {
      clearInterval(typingTimer);
      confetti({ particleCount: 100, spread: 70 });

      setTimeout(() => {
        document.getElementById('terminal-stage').classList.add('hidden');
        document.getElementById('flip-photos-stage').classList.remove('hidden');
      }, 2500);
    }
  }, 70);
}