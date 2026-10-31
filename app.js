/**
 * ============================================================================
 * RACING BEAST HUB (@racingbeast8754) - JAVASCRIPT CONTROLLER
 * ============================================================================
 * 
 * TO ADD YOUR OWN VIDEOS:
 * 1. You can add them directly through the website by clicking "ADD VIDEO"
 *    (They will be saved to your browser automatically!)
 * 2. OR add/edit the video entries below in the `DEFAULT_VIDEOS` list:
 *    Just put your YouTube Video ID (the 11 letters/numbers after v= or youtu.be/)
 */

const CHANNEL_HANDLE = '@racingbeast8754';
const CHANNEL_URL = 'https://www.youtube.com/@racingbeast8754';
const SUBSCRIBE_URL = 'https://www.youtube.com/@racingbeast8754?sub_confirmation=1';

// Initial preloaded fleet of racing transmissions
// Replace or add your own YouTube Video IDs here:
const DEFAULT_VIDEOS = [
  {
    id: "J3t3QoA8w_Y",
    title: "Asphalt 8: High Speed Nitro Run & Max Velocity Drift",
    category: "asphalt",
    duration: "04:18",
    views: "1.4K views",
    desc: "Pushing the boundaries of pure nitro speed in Asphalt 8. Clean drift curves and max boost execution.",
    thumbnail: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "g7w7rX4p0lQ",
    title: "Hypercar Velocity Test | Asphalt 8 Airborne Season Finale",
    category: "asphalt",
    duration: "06:45",
    views: "2.8K views",
    desc: "Unleashing the ultimate beast on the Tokyo track. Barrel rolls, perfect landings, and top-tier lap times.",
    thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "8Z1eMy2FoX4",
    title: "Top Speed Speedrun: Breaking the 450 KM/H Barrier",
    category: "speed",
    duration: "03:52",
    views: "3.5K views",
    desc: "Pure acceleration and overdrive telemetry. Can we break the all-time speed barrier?",
    thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "dQw4w9WgXcQ", // Replace with your actual shorts/videos
    title: "INSANE Drift Recovery #Shorts - Beast Mode Reflexes",
    category: "shorts",
    duration: "00:45",
    views: "5.1K views",
    desc: "Near-miss crash turned into a flawless 360 spin drift recovery! Don't blink.",
    thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "kXYiU_JCYtU",
    title: "Multiplayer Showdown: Racing Beast vs Pro Lobby",
    category: "speed",
    duration: "08:12",
    views: "4.2K views",
    desc: "Climbing the competitive tier leaderboards. High-stakes multiplayer racing with zero mistakes allowed.",
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "L_LUpnjgPso",
    title: "Nitro Boost Timing Mastery & Barrel Roll Secrets",
    category: "asphalt",
    duration: "05:30",
    views: "2.1K views",
    desc: "Complete guide to timing triple boost and flat spins for maximum air time and zero speed bleed.",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  }
];

// State
let videos = [];
let activeVideoId = null;
let currentFilter = 'all';
let sfxEnabled = true;

// DOM Elements
const videoGrid = document.getElementById('videoGrid');
const mainPlayer = document.getElementById('mainPlayer');
const currentTitle = document.getElementById('currentTitle');
const currentDesc = document.getElementById('currentDesc');
const currentCategory = document.getElementById('currentCategory');
const watchOnYtBtn = document.getElementById('watchOnYtBtn');
const shareVideoBtn = document.getElementById('shareVideoBtn');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const filterTabs = document.getElementById('filterTabs');
const emptyState = document.getElementById('emptyState');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const hudClock = document.getElementById('hudClock');
const rpmValue = document.getElementById('rpmValue');
const sfxToggle = document.getElementById('sfxToggle');
const toastHub = document.getElementById('toastHub');
const theaterStage = document.getElementById('theaterStage');
const theaterModeBtn = document.getElementById('theaterModeBtn');

// Modal Elements
const addVideoModal = document.getElementById('addVideoModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addVideoForm = document.getElementById('addVideoForm');

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function initApp() {
  loadStoredVideos();
  initCanvasAnimation();
  initClockAndTelemetry();
  initAudioSynthesizer();
  bindEvents();
  renderVideos();

  // Load first video by default
  if (videos.length > 0) {
    selectVideo(videos[0].id, false);
  }
}

/* ==========================================================================
   VIDEO DATA MANAGEMENT & LOCAL STORAGE
   ========================================================================== */
function loadStoredVideos() {
  try {
    const saved = localStorage.getItem('racingbeast_videos');
    if (saved) {
      videos = JSON.parse(saved);
    } else {
      videos = [...DEFAULT_VIDEOS];
      saveVideos();
    }
  } catch (e) {
    videos = [...DEFAULT_VIDEOS];
  }
}

function saveVideos() {
  try {
    localStorage.setItem('racingbeast_videos', JSON.stringify(videos));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();
  // If already an 11 char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  // Standard or short YouTube URL
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/* ==========================================================================
   RENDER & GALLERY LOGIC
   ========================================================================== */
function renderVideos() {
  const query = searchInput.value.trim().toLowerCase();
  
  // Filter by category and search
  const filtered = videos.filter(video => {
    const matchesCategory = (currentFilter === 'all') || (video.category === currentFilter);
    const matchesSearch = !query || 
      video.title.toLowerCase().includes(query) || 
      video.desc.toLowerCase().includes(query) ||
      video.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  updateCounts();

  if (filtered.length === 0) {
    videoGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  videoGrid.innerHTML = filtered.map(video => {
    const isPlaying = video.id === activeVideoId;
    const thumbUrl = video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    
    return `
      <article class="video-card ${isPlaying ? 'playing' : ''}" data-id="${video.id}">
        <div class="thumbnail-wrap">
          <img src="${thumbUrl}" alt="${video.title}" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${video.id}/hqdefault.jpg'">
          <div class="play-hover-overlay">
            <i class="fa-solid fa-circle-play"></i>
          </div>
          <span class="duration-pill"><i class="fa-regular fa-clock"></i> ${video.duration || '04:00'}</span>
        </div>

        <div class="card-content">
          <div class="card-meta-top">
            <span class="card-cat">// ${video.category.toUpperCase()}</span>
            <span class="card-view-count">${video.views || 'Active Mission'}</span>
          </div>
          <h4 class="card-title">${video.title}</h4>
          <p class="card-desc">${video.desc || 'High-octane racing transmission from @racingbeast8754'}</p>
          
          <div class="card-footer">
            <span class="card-channel-tag"><i class="fa-brands fa-youtube"></i> ${CHANNEL_HANDLE}</span>
            <span class="card-play-action">
              ${isPlaying ? '<i class="fa-solid fa-volume-high"></i> PLAYING' : '<i class="fa-solid fa-play"></i> LAUNCH'}
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Add click listeners to cards
  videoGrid.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const vidId = card.getAttribute('data-id');
      selectVideo(vidId, true);
    });
    card.addEventListener('mouseenter', () => playSfx('hover'));
  });
}

function updateCounts() {
  document.getElementById('countAll').textContent = videos.length;
  document.getElementById('countAsphalt').textContent = videos.filter(v => v.category === 'asphalt').length;
  document.getElementById('countSpeed').textContent = videos.filter(v => v.category === 'speed').length;
  document.getElementById('countShorts').textContent = videos.filter(v => v.category === 'shorts').length;
}

function selectVideo(id, autoPlay = true) {
  const target = videos.find(v => v.id === id);
  if (!target) return;

  activeVideoId = id;
  
  // Set Main Player
  const autoplayParam = autoPlay ? 1 : 0;
  mainPlayer.src = `https://www.youtube.com/embed/${id}?autoplay=${autoplayParam}&rel=0&modestbranding=1&color=white`;

  // Update Meta
  currentTitle.textContent = target.title;
  currentDesc.textContent = target.desc || 'Racing gameplay and top-tier runs from @racingbeast8754.';
  currentCategory.textContent = target.category.toUpperCase() + ' MISSION';
  watchOnYtBtn.href = `https://www.youtube.com/watch?v=${id}`;

  // Ambient backdrop color shift
  const ambientGlow = document.getElementById('ambientGlow');
  if (target.category === 'speed') {
    ambientGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 60, 0.25) 0%, rgba(0, 240, 255, 0.1) 60%, transparent 80%)';
  } else if (target.category === 'asphalt') {
    ambientGlow.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(168, 85, 247, 0.12) 60%, transparent 80%)';
  } else {
    ambientGlow.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0, 240, 255, 0.1) 60%, transparent 80%)';
  }

  // Audio & Haptic Feedback
  if (autoPlay) {
    playSfx('launch');
    theaterStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`LAUNCHED TRANSMISSION: ${target.title.substring(0, 28)}...`);
  }

  // Update cards playing state
  document.querySelectorAll('.video-card').forEach(c => {
    if (c.getAttribute('data-id') === id) {
      c.classList.add('playing');
    } else {
      c.classList.remove('playing');
    }
  });
}

/* ==========================================================================
   WEB AUDIO API - SYNTHESIZER SOUND EFFECTS (NO EXTERNAL FILES)
   ========================================================================== */
let audioCtx = null;

function initAudioSynthesizer() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    audioCtx = new AudioContext();
  }
}

function playSfx(type) {
  if (!sfxEnabled || !audioCtx) return;

  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      // High-tech subtle cyber tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      // Robotic cyber acknowledge
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'launch') {
      // Futuristic hyperdrive warp chirp
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.18);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'sub') {
      // Overdrive boost sound
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

/* ==========================================================================
   CANVAS WARP SPEED SPEEDRUN PARTICLES
   ========================================================================== */
function initCanvasAnimation() {
  const canvas = document.getElementById('warpCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numStars = 140;
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
      color: Math.random() > 0.4 ? '#00f0ff' : '#ff003c'
    });
  }

  function renderStars() {
    ctx.fillStyle = 'rgba(5, 7, 13, 0.4)';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];
      star.z -= 4; // Velocity

      if (star.z <= 0) {
        star.z = width;
        star.x = (Math.random() - 0.5) * width;
        star.y = (Math.random() - 0.5) * height;
      }

      const k = 250 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const size = (1 - star.z / width) * 2.8;
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        // Speed streak line
        const prevK = 250 / (star.z + 18);
        const prevPx = star.x * prevK + cx;
        const prevPy = star.y * prevK + cy;

        ctx.beginPath();
        ctx.strokeStyle = star.color;
        ctx.lineWidth = size * 0.8;
        ctx.globalAlpha = 0.5;
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* ==========================================================================
   HUD TELEMETRY CLOCK & RPM FLUCTUATION
   ========================================================================== */
function initClockAndTelemetry() {
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (hudClock) hudClock.textContent = `${h}:${m}:${s} UTC`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Fluctuating racing RPM
  setInterval(() => {
    if (rpmValue) {
      const base = 9000;
      const flux = Math.floor(Math.random() * 850);
      rpmValue.textContent = `${(base + flux).toLocaleString()} RPM`;
    }
  }, 1200);
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'cyber-toast';
  toast.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color:var(--neon-cyan)"></i> <span>${msg}</span>`;
  toastHub.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   EVENT HANDLERS & BINDINGS
   ========================================================================== */
function bindEvents() {
  // SFX Toggle
  sfxToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    sfxToggle.innerHTML = sfxEnabled 
      ? '<i class="fa-solid fa-volume-high"></i> <span>SFX: ON</span>' 
      : '<i class="fa-solid fa-volume-xmark"></i> <span>SFX: OFF</span>';
    sfxToggle.style.borderColor = sfxEnabled ? 'var(--neon-cyan)' : 'var(--text-dim)';
    if (sfxEnabled) playSfx('click');
    showToast(sfxEnabled ? 'CYBER AUDIO ONLINE' : 'AUDIO MUTED');
  });

  // Subscribe Button Boost Sound
  const subBtn = document.getElementById('subBtn');
  subBtn.addEventListener('mouseenter', () => playSfx('sub'));
  subBtn.addEventListener('click', () => {
    playSfx('sub');
    showToast('FORWARDING TO YT CONFIRMATION: @racingbeast8754');
  });

  // Filter Tabs
  filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      playSfx('click');
      renderVideos();
    });
    tab.addEventListener('mouseenter', () => playSfx('hover'));
  });

  // Search Input
  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    renderVideos();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    playSfx('click');
    renderVideos();
    searchInput.focus();
  });

  resetFilterBtn.addEventListener('click', () => {
    currentFilter = 'all';
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterTabs.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-filter') === 'all');
    });
    playSfx('click');
    renderVideos();
  });

  // Theater Focus Toggle
  theaterModeBtn.addEventListener('click', () => {
    theaterStage.classList.toggle('theater-fullscreen-active');
    playSfx('click');
    showToast('THEATER DISPLAY ENGAGED');
  });

  // Share Video Action
  shareVideoBtn.addEventListener('click', async () => {
    playSfx('click');
    const shareUrl = activeVideoId ? `https://www.youtube.com/watch?v=${activeVideoId}` : CHANNEL_URL;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Racing Beast - ${currentTitle.textContent}`,
          text: `Check out this high-speed video from @racingbeast8754:`,
          url: shareUrl
        });
        showToast('TRANSMISSION SHARED');
      } catch (e) {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  });

  // Add Video Modal
  openAddModalBtn.addEventListener('click', () => {
    playSfx('click');
    addVideoModal.classList.add('open');
    document.getElementById('videoUrlInput').focus();
  });

  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  addVideoModal.addEventListener('click', (e) => {
    if (e.target === addVideoModal) closeModal();
  });

  // Add Video Form Submit
  addVideoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlOrId = document.getElementById('videoUrlInput').value;
    const title = document.getElementById('videoTitleInput').value.trim();
    const category = document.getElementById('videoCategorySelect').value;
    const duration = document.getElementById('videoDurationInput').value.trim() || '04:00';
    const desc = document.getElementById('videoDescInput').value.trim();

    const videoId = extractYouTubeId(urlOrId);
    if (!videoId) {
      alert('Could not parse a valid YouTube Video ID or URL. Please verify the link!');
      return;
    }

    const newVideo = {
      id: videoId,
      title: title || 'New Transmission',
      category: category,
      duration: duration,
      views: 'Recent Mission',
      desc: desc || `High-speed run from ${CHANNEL_HANDLE}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };

    // Prepend new video so it appears first
    videos.unshift(newVideo);
    saveVideos();
    closeModal();
    playSfx('launch');
    renderVideos();
    selectVideo(videoId, true);
    showToast(`ADDED: ${newVideo.title.substring(0, 24)}...`);
  });
}

function closeModal() {
  playSfx('click');
  addVideoModal.classList.remove('open');
  addVideoForm.reset();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('TRANSMISSION LINK COPIED TO CLIPBOARD');
  }).catch(() => {
    showToast('COULD NOT AUTO-COPY: ' + text);
  });
}

// Boot up
document.addEventListener('DOMContentLoaded', initApp);
