# 🏎️ RACING BEAST (@racingbeast8754) | Official Channel Hub

An ultra-futuristic, high-octane gaming website custom built for YouTube creator **[@racingbeast8754](https://www.youtube.com/@racingbeast8754)**.

Designed with a cybernetic racing HUD aesthetic, hyperdrive speed starfield background, interactive Web Audio synthesizer SFX, live telemetry counters, and a dedicated video transmission player for **only your channel's videos**.

---

## ✨ Features

- 🔴 **High-Voltage Subscribe Button:**
  - Pulsing neon red button configured with the YouTube auto-subscribe confirmation prompt (`https://www.youtube.com/@racingbeast8754?sub_confirmation=1`).
  - Secondary subscribe badges and footer links throughout the page.

- 🎮 **Theater Main Stage:**
  - Embedded 16:9 responsive YouTube player with scanline CRT effects and HUD corner brackets.
  - Category tags, video titles, descriptions, and one-click "Watch on YouTube" and "Share" options.
  - "Theater Focus" expand toggle.

- 📂 **Transmissions Archive ("Only My Videos"):**
  - Displays exclusive racing gameplay from `@racingbeast8754` (Asphalt 8, speedruns, drift highlights, and shorts).
  - Real-time search filter to find videos by title or tags.
  - Category filters: `ALL VIDEOS`, `ASPHALT RUNS`, `HIGH SPEED`, `SHORTS & CLIPS`.

- ⚡ **Interactive Add-Video Deck:**
  - Click the **`+ Add Video`** button in the website header to paste any YouTube link or video ID from your channel.
  - Automatically fetches the high-res thumbnail and saves it to your browser's `localStorage` instantly!

- 🌌 **Futuristic Cyberpunk / Racing Aesthetics:**
  - Interactive canvas speed streaks simulating hyperdrive racing at 340+ km/h.
  - RPM telemetry boost gauge and live UTC clock.
  - Built-in Web Audio API sound synthesizer with futuristic robot beeps, laser confirmation sound, and warp boost audio on buttons (includes SFX ON/OFF mute button).

---

## 🚀 How to Run the Website

### Option 1: Open Locally (Easiest)
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Brave, or any modern web browser.

### Option 2: Host for Free Online
You can host this website completely free with a custom link:
1. **GitHub Pages**: Upload these files (`index.html`, `styles.css`, `app.js`) to a GitHub repository, enable **GitHub Pages** in Settings > Pages.
2. **Netlify or Vercel**: Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop) or Vercel.

---

## 🛠️ How to Add Your Videos Permanently in Code

Open [`app.js`](./app.js) in any text editor. Near line 17, you will see the `DEFAULT_VIDEOS` list:

```javascript
const DEFAULT_VIDEOS = [
  {
    id: "YOUR_YOUTUBE_VIDEO_ID", // The 11 characters after v= in your YouTube URL
    title: "Your Video Title",
    category: "asphalt", // "asphalt", "speed", or "shorts"
    duration: "04:18",
    views: "1.4K views",
    desc: "Description of your run...",
    thumbnail: "https://i.ytimg.com/vi/YOUR_YOUTUBE_VIDEO_ID/hqdefault.jpg"
  },
  // Add as many videos as you want!
];
```

---

## 🛡️ Tech Stack
- **HTML5**: Semantic, accessible cyber HUD structure.
- **CSS3**: Custom properties, neon box-shadow glows, glassmorphism, responsive grid & flexbox.
- **JavaScript (Vanilla ES6+)**: Interactive DOM manipulation, HTML5 Canvas animation, native Web Audio API synthesizer (zero heavy dependencies).
- **Fonts & Icons**: Orbitron, Rajdhani, Share Tech Mono & FontAwesome 6.
