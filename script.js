const options = {
  pro: {
    likes: "28,614 likes",
    caption:
      "iPhone 17 Pro in an Instagram-style carousel: performance, battery life, and the bold Pro camera story. Swipe left and right to move through the three images.",
    hashtags: "#iPhone17Pro #Apple #MobileDesign #Carousel",
    slides: [
      {
        eyebrow: "Option 1 / Slide 1",
        headline: "iPhone 17 Pro. Built for power.",
        bg: "linear-gradient(135deg, #f5f5f7 0%, #dfe7f5 50%, #f9eee4 100%)",
        screen: "linear-gradient(145deg, #14243f, #ff8a45)",
        app: "linear-gradient(145deg, #ff7a3d, #fff0d8)",
        specs: [["A19 Pro", "speed"], ["8x", "optical-quality zoom"], ["Pro", "camera system"]],
        phones: ["wide", ""],
      },
      {
        eyebrow: "Option 1 / Slide 2",
        headline: "Cosmic Orange makes the post pop.",
        bg: "radial-gradient(circle at 28% 30%, #ffd2ad 0 20%, transparent 21%), linear-gradient(135deg, #fff8ef, #f2f2f4)",
        screen: "linear-gradient(145deg, #101114, #f9732c)",
        app: "linear-gradient(145deg, #f9732c, #1f2937)",
        specs: [["Ceramic", "Shield 2"], ["Dolby", "Vision video"], ["Apple", "Intelligence"]],
        phones: ["", "slim"],
      },
      {
        eyebrow: "Option 1 / Slide 3",
        headline: "A pro page, framed like a feed post.",
        bg: "linear-gradient(160deg, #f5f5f7 0 44%, #d9dde7 45% 100%)",
        screen: "linear-gradient(145deg, #05070a, #3466ff)",
        app: "linear-gradient(145deg, #2f6bff, #a6f0ff)",
        specs: [["All-day", "battery"], ["Fusion", "camera"], ["iOS", "26 ready"]],
        phones: ["wide", "slim"],
      },
    ],
  },
  air: {
    likes: "19,806 likes",
    caption:
      "iPhone Air option: thin, light, and clean. The option button swaps in this second 3-image set, then the user can swipe through it again.",
    hashtags: "#iPhoneAir #AppleMobile #ThinDesign #InstagramTemplate",
    slides: [
      {
        eyebrow: "Option 2 / Slide 1",
        headline: "iPhone Air. Thin by design.",
        bg: "linear-gradient(135deg, #f7fbff, #e6f4ff 52%, #fff8df)",
        screen: "linear-gradient(145deg, #daf2ff, #2e8bdc)",
        app: "linear-gradient(145deg, #5bbcff, #ffffff)",
        specs: [["Air", "profile"], ["Sky Blue", "finish"], ["Pro", "inside"]],
        phones: ["slim", ""],
      },
      {
        eyebrow: "Option 2 / Slide 2",
        headline: "Light Gold, cloud clean.",
        bg: "radial-gradient(circle at 74% 26%, #ffe8a5 0 18%, transparent 19%), linear-gradient(145deg, #fffdf6, #edf3f8)",
        screen: "linear-gradient(145deg, #fff3bd, #15191f)",
        app: "linear-gradient(145deg, #ffe28a, #ffffff)",
        specs: [["Titanium", "feel"], ["Fusion", "camera"], ["Fast", "chip"]],
        phones: ["", "slim"],
      },
      {
        eyebrow: "Option 2 / Slide 3",
        headline: "A minimal carousel for the thinnest iPhone.",
        bg: "linear-gradient(150deg, #fbfbfd 0 55%, #dce7f2 56% 100%)",
        screen: "linear-gradient(145deg, #10141b, #f6f6f6)",
        app: "linear-gradient(145deg, #111827, #f8fafc)",
        specs: [["Cloud", "White"], ["Space", "Black"], ["Swipe", "ready"]],
        phones: ["slim", "slim"],
      },
    ],
  },
};

const track = document.getElementById("track");
const carousel = document.getElementById("carousel");
const indicators = document.getElementById("slideIndicators");
const captionText = document.getElementById("captionText");
const hashtags = document.getElementById("hashtags");
const likes = document.getElementById("likes");
const optionButtons = document.querySelectorAll("[data-option]");

let activeOption = "pro";
let activeSlide = 0;
let dragStart = 0;
let dragOffset = 0;
let dragging = false;

function phoneMarkup(className, slide) {
  return `
    <div class="phone ${className}">
      <div class="screen" style="--screen: ${slide.screen}; --app: ${slide.app}">
        <div class="screen-grid">${Array.from({ length: 12 }, () => '<span class="app"></span>').join("")}</div>
        <span class="camera-bar"></span>
        <span class="camera-lens one"></span>
        <span class="camera-lens two"></span>
      </div>
    </div>
  `;
}

function renderSlides() {
  const option = options[activeOption];
  track.innerHTML = option.slides.map((slide) => `
    <article class="slide" style="--slide-bg: ${slide.bg}">
      <div class="slide-content">
        <div>
          <div class="eyebrow">${slide.eyebrow}</div>
          <h1 class="headline">${slide.headline}</h1>
        </div>
        <div class="phone-stage">${slide.phones.map((phone) => phoneMarkup(phone, slide)).join("")}</div>
        <div class="spec-strip">${slide.specs.map(([top, bottom]) => `<div class="spec"><strong>${top}</strong><span>${bottom}</span></div>`).join("")}</div>
      </div>
    </article>
  `).join("");

  indicators.innerHTML = option.slides.map((_, index) => `<button aria-label="Go to image ${index + 1}" data-slide="${index}"></button>`).join("");
  indicators.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => goToSlide(Number(button.dataset.slide))));
  captionText.textContent = option.caption;
  hashtags.textContent = option.hashtags;
  likes.textContent = option.likes;
  updateTrack();
}

function updateTrack() {
  track.style.transform = `translateX(calc(${-activeSlide * 100}% + ${dragOffset}px))`;
  indicators.querySelectorAll("button").forEach((button, index) => button.classList.toggle("active", index === activeSlide));
}

function goToSlide(index) {
  const max = options[activeOption].slides.length - 1;
  activeSlide = Math.max(0, Math.min(index, max));
  dragOffset = 0;
  track.style.transition = "transform 320ms ease";
  updateTrack();
}

function changeOption(optionKey) {
  activeOption = optionKey;
  activeSlide = 0;
  optionButtons.forEach((button) => {
    const active = button.dataset.option === optionKey;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderSlides();
}

function beginDrag(clientX) {
  dragging = true;
  dragStart = clientX;
  dragOffset = 0;
  track.style.transition = "none";
  carousel.classList.add("dragging");
}

function moveDrag(clientX) {
  if (!dragging) return;
  dragOffset = clientX - dragStart;
  updateTrack();
}

function endDrag() {
  if (!dragging) return;
  const threshold = carousel.clientWidth * 0.16;
  if (dragOffset < -threshold) goToSlide(activeSlide + 1);
  else if (dragOffset > threshold) goToSlide(activeSlide - 1);
  else goToSlide(activeSlide);
  dragging = false;
  carousel.classList.remove("dragging");
}

optionButtons.forEach((button) => button.addEventListener("click", () => changeOption(button.dataset.option)));
document.getElementById("prevSlide").addEventListener("click", () => goToSlide(activeSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(activeSlide + 1));

carousel.addEventListener("pointerdown", (event) => {
  carousel.setPointerCapture(event.pointerId);
  beginDrag(event.clientX);
});
carousel.addEventListener("pointermove", (event) => moveDrag(event.clientX));
carousel.addEventListener("pointerup", endDrag);
carousel.addEventListener("pointercancel", endDrag);
carousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goToSlide(activeSlide - 1);
  if (event.key === "ArrowRight") goToSlide(activeSlide + 1);
});

renderSlides();
