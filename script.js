const carouselPost = {
  likes: "2,946 likes",
  caption:
    "How much protein do you actually need to maximize muscle growth? This carousel keeps the message simple: start with the hook, show the science visually, then give a practical daily target people can use.",
  hashtags: "#BuiltWithScience #Protein #Hypertrophy #NutritionScience",
  slides: [
    {
      type: "hook",
      kicker: "Swipe 1 - Hook",
      headline: 'How much <span>protein</span> do you really need?',
      copy: "The scroll-stopper: clear question, bold hierarchy, and a visual target that tells the story before the caption.",
      bg: "linear-gradient(145deg, #ffffff 0%, #f4f7ff 58%, #ffffff 100%)",
    },
    {
      type: "science",
      kicker: "Swipe 2 - Science",
      headline: 'The benefit seems to level off around <span>1.6 g/kg</span>.',
      copy: "A simple chart shows the practical point: higher protein can help, but more is not automatically better for hypertrophy.",
      bg: "linear-gradient(145deg, #ffffff 0%, #f8fbff 52%, #fff8e8 100%)",
    },
    {
      type: "takeaway",
      kicker: "Swipe 3 - Takeaway",
      headline: 'Aim for the useful range. Then make it consistent.',
      copy: "This turns the research into an easy action: hit at least 1.6 g/kg, spread it through the day, and choose quality sources.",
      bg: "linear-gradient(145deg, #ffffff 0%, #eef3ff 100%)",
    },
  ],
};

const track = document.getElementById("track");
const carousel = document.getElementById("carousel");
const indicators = document.getElementById("slideIndicators");
const captionText = document.getElementById("captionText");
const hashtags = document.getElementById("hashtags");
const likes = document.getElementById("likes");

let activeSlide = 0;
let dragStart = 0;
let dragOffset = 0;
let dragging = false;

function renderHookVisual() {
  return `
    <div class="target-visual">
      <div class="plate">
        <span class="food steak"></span>
        <span class="food egg"></span>
        <span class="food greens"></span>
      </div>
      <div class="protein-meter" aria-label="Protein target illustration">
        <div class="meter-copy">
          <strong>1.6</strong>
          <span>g/kg</span>
        </div>
        <div class="meter-line"></div>
        <p>daily target for most lifters</p>
      </div>
    </div>
  `;
}

function renderScienceVisual() {
  const dots = [
    ["9%", "22%"], ["15%", "38%"], ["22%", "46%"], ["29%", "55%"], ["36%", "58%"],
    ["45%", "61%"], ["54%", "59%"], ["63%", "62%"], ["72%", "60%"], ["82%", "61%"],
  ];

  return `
    <div class="science-visual">
      <div class="axis-chart">
        <span class="sweet-spot"></span>
        <svg viewBox="0 0 500 230" aria-hidden="true">
          <path d="M20 190 C120 100, 190 72, 265 70 S390 72, 470 68" />
        </svg>
        ${dots.map(([x, y]) => `<span class="plot-dot" style="--x:${x}; --y:${y}"></span>`).join("")}
      </div>
      <div class="chart-note">
        <strong>Little added growth</strong>
        <span>after the useful range</span>
      </div>
    </div>
  `;
}

function renderTakeawayVisual() {
  return `
    <div class="takeaway-list">
      <div class="takeaway-row">
        <strong>01</strong>
        <span>Start with at least <b>1.6 g/kg</b> body weight daily.</span>
      </div>
      <div class="takeaway-row">
        <strong>02</strong>
        <span>Spread protein across meals for easier consistency.</span>
      </div>
      <div class="takeaway-row">
        <strong>03</strong>
        <span>Use high-quality sources when total intake is lower.</span>
      </div>
    </div>
  `;
}

function renderVisual(slide) {
  if (slide.type === "hook") return renderHookVisual();
  if (slide.type === "science") return renderScienceVisual();
  return renderTakeawayVisual();
}

function renderSlides() {
  track.innerHTML = carouselPost.slides.map((slide, index) => `
    <article class="slide ${slide.type}-slide" style="--slide-bg: ${slide.bg}">
      <div class="slide-content">
        <div class="slide-topline">
          <div class="slide-kicker">${slide.kicker}</div>
          <div class="slide-count">${index + 1}/3</div>
        </div>
        <div class="slide-main">
          <div>
            <h1 class="headline">${slide.headline}</h1>
            <p class="support-copy">${slide.copy}</p>
          </div>
          <div class="visual-stage">${renderVisual(slide)}</div>
        </div>
        <div class="footer-strip">
          <span>Built With Science</span>
          <span>PMID: 29414855</span>
        </div>
      </div>
    </article>
  `).join("");

  indicators.innerHTML = carouselPost.slides
    .map((_, index) => `<button aria-label="Go to image ${index + 1}" data-slide="${index}"></button>`)
    .join("");
  indicators.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => goToSlide(Number(button.dataset.slide)));
  });

  captionText.textContent = carouselPost.caption;
  hashtags.textContent = carouselPost.hashtags;
  likes.textContent = carouselPost.likes;
  updateTrack();
}

function updateTrack() {
  track.style.transform = `translateX(calc(${-activeSlide * 100}% + ${dragOffset}px))`;
  indicators.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", index === activeSlide);
  });
}

function goToSlide(index) {
  activeSlide = Math.max(0, Math.min(index, carouselPost.slides.length - 1));
  dragOffset = 0;
  track.style.transition = "transform 320ms ease";
  updateTrack();
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
