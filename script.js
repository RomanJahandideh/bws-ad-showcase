const options = {
  protein: {
    likes: "2,946 likes",
    caption:
      "A one-page interactive space for the Built With Science brief. Option 1 turns the protein requirement into a 3-slide Instagram carousel: scroll-stopping hook, simple science visual, and practical takeaway.",
    hashtags: "#BuiltWithScience #Protein #Hypertrophy #DesignSample",
    slides: [
      {
        type: "hero",
        kicker: "Swipe 1 - Hook",
        headline: 'How much <span class="blue">protein</span> to maximize muscle growth?',
        copy: "A bold, clean opening slide built for quick comprehension before the user ever reads the caption.",
        bg: "linear-gradient(135deg, #ffffff 0%, #eef3ff 56%, #ffffff 100%)",
      },
      {
        type: "science",
        kicker: "Swipe 2 - Scientific insight",
        headline: 'More is not always <span class="gold">more</span>.',
        copy: "The visual story: research suggests 1.6 g/kg can be enough for muscle growth, while 2.2 g/kg is likely beyond what most people need.",
        bg: "linear-gradient(135deg, #ffffff 0%, #f8fbff 48%, #fff7df 100%)",
      },
      {
        type: "takeaway",
        kicker: "Swipe 3 - Practical takeaway",
        headline: 'Make it simple. Hit the useful range.',
        copy: "The final slide gives the audience an action they can remember and apply immediately.",
        bg: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
      },
    ],
  },
  platform: {
    likes: "1,608 likes",
    caption:
      "Option 2 presents the platform itself: an interactive review space where the company can see the requirement, swipe through the planned content, and later review the generated final images in the same Instagram-style template.",
    hashtags: "#InteractiveBrief #SocialMediaDesign #BWSSubmission #CarouselDemo",
    slides: [
      {
        type: "platform",
        kicker: "Option 2 - Purpose",
        headline: 'An interactive space to showcase the <span class="blue">requirement</span>.',
        copy: "This one-page presentation lets reviewers inspect the creative direction exactly where the final assets will live: inside a social post frame.",
        bg: "linear-gradient(135deg, #ffffff 0%, #edf2ff 58%, #ffffff 100%)",
      },
      {
        type: "upload",
        kicker: "Option 2 - Image slots",
        headline: 'Ready for the final generated images.',
        copy: "When the finished images are available, each slide can be replaced without changing the Instagram window, caption structure, or interaction.",
        bg: "linear-gradient(135deg, #ffffff 0%, #fff8e5 100%)",
      },
      {
        type: "platform",
        kicker: "Option 2 - Review flow",
        headline: 'Brief, carousel, caption, and feedback in one place.',
        copy: "A polished handoff page for showing design thinking, content clarity, and how the submission answers the brief.",
        bg: "linear-gradient(135deg, #ffffff 0%, #eef3ff 46%, #ffffff 100%)",
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

let activeOption = "protein";
let activeSlide = 0;
let dragStart = 0;
let dragOffset = 0;
let dragging = false;

function renderVisual(slide) {
  if (slide.type === "hero") {
    return `
      <div class="hero-equation">
        <div class="number-card"><div><strong>1.6</strong><span>g/kg daily target</span></div></div>
        <div class="versus">VS</div>
        <div class="number-card"><div><strong>2.2</strong><span>g/kg upper comparison</span></div></div>
      </div>
    `;
  }

  if (slide.type === "science") {
    const dots = [
      ["12%", "24%"], ["18%", "44%"], ["25%", "34%"], ["31%", "58%"], ["38%", "47%"],
      ["49%", "55%"], ["55%", "42%"], ["62%", "61%"], ["70%", "49%"], ["79%", "57%"],
      ["86%", "44%"],
    ];
    return `
      <div class="scatter-card">
        <div class="chart">
          <span class="range-band"></span>
          ${dots.map(([x, y]) => `<span class="dot" style="--x:${x}; --y:${y}"></span>`).join("")}
        </div>
        <div class="chart-label"><span>lower protein intake</span><span>higher protein intake</span></div>
      </div>
    `;
  }

  if (slide.type === "takeaway") {
    return `
      <div class="takeaway-grid">
        <div class="takeaway-card"><strong>At least 1.6 g/kg</strong><span>Use this as the simple daily minimum for most lifters.</span></div>
        <div class="takeaway-card"><strong>Spread it out</strong><span>Make protein easier to hit across meals instead of saving it all for one sitting.</span></div>
        <div class="takeaway-card"><strong>Quality sources</strong><span>Prioritize high-quality foods when total intake is closer to the lower end.</span></div>
      </div>
    `;
  }

  if (slide.type === "upload") {
    return `
      <div class="upload-frame">
        <div>
          <strong>3 final images go here</strong>
          <span>Drop in the generated carousel art later while keeping the same swipe behavior.</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="platform-grid">
      <div class="platform-card"><strong>Brief</strong><span>Clear requirements from the PDF are translated into slide goals.</span></div>
      <div class="platform-card"><strong>Design</strong><span>Brand fonts, colors, and clean science-first visuals guide the presentation.</span></div>
      <div class="platform-card"><strong>Review</strong><span>The company can swipe, compare options, and understand the intended final asset flow.</span></div>
    </div>
  `;
}

function renderSlides() {
  const option = options[activeOption];
  track.innerHTML = option.slides.map((slide) => `
    <article class="slide" style="--slide-bg: ${slide.bg}">
      <div class="slide-content">
        <div>
          <div class="slide-kicker">${slide.kicker}</div>
          <h1 class="headline">${slide.headline}</h1>
          <p class="support-copy">${slide.copy}</p>
        </div>
        <div class="visual-stage">${renderVisual(slide)}</div>
        <div class="chart-label"><span>Built With Science style</span><span>Swipe ${option.slides.indexOf(slide) + 1}/3</span></div>
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
