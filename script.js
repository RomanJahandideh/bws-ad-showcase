const carouselPost = {
  likes: "2,946 likes",
  caption:
    "How much protein do you actually need to maximize muscle growth? This 3-slide carousel turns the brief into a polished Built With Science-style post: hook, research insight, and practical takeaway.",
  hashtags: "#BuiltWithScience #Protein #Hypertrophy #NutritionScience",
  slides: [
    {
      image: "./assets/slide-1.jpg",
      alt: "How much protein to maximize muscle growth, Built With Science hook slide",
    },
    {
      image: "./assets/slide-2.jpg",
      alt: "1.6 grams per kilogram is enough, Built With Science research insight slide",
    },
    {
      image: "./assets/slide-3.png",
      alt: "At least 1.6 grams per kilogram daily, Built With Science practical takeaway slide",
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

function renderSlides() {
  track.innerHTML = carouselPost.slides.map((slide, index) => `
    <article class="slide image-slide">
      <img src="${slide.image}" alt="${slide.alt}" draggable="false" />
      <span class="image-count">${index + 1}/3</span>
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
