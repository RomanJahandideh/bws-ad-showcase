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

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 200);
  }, 1600);
}

async function copyPageLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard");
  } catch {
    showToast(window.location.href);
  }
}

let likeCount = parseInt(carouselPost.likes.replace(/[^0-9]/g, ""), 10);
let liked = false;
const likeBtn = document.getElementById("likeBtn");
const navLike = document.getElementById("navLike");
const likesLabel = document.getElementById("likes");

function setLiked(next) {
  liked = next;
  likeCount += liked ? 1 : -1;
  likeBtn.textContent = liked ? "♥" : "♡";
  likeBtn.classList.toggle("liked", liked);
  navLike.textContent = liked ? "♥" : "♡";
  navLike.classList.toggle("liked", liked);
  likesLabel.textContent = `${likeCount.toLocaleString("en-US")} likes`;
}

likeBtn.addEventListener("click", () => setLiked(!liked));
navLike.addEventListener("click", () => setLiked(!liked));

const saveBtn = document.getElementById("saveBtn");
let saved = false;
saveBtn.addEventListener("click", () => {
  saved = !saved;
  saveBtn.textContent = saved ? "■" : "□";
  saveBtn.classList.toggle("saved", saved);
});

const commentInput = document.getElementById("commentInput");
document.getElementById("commentBtn").addEventListener("click", () => commentInput.focus());
commentInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || !commentInput.value.trim()) return;
  const entry = document.createElement("p");
  entry.className = "comment";
  entry.innerHTML = `<strong>you</strong> ${commentInput.value.trim()}`;
  document.querySelector(".caption-scroll").appendChild(entry);
  commentInput.value = "";
  entry.scrollIntoView({ block: "nearest" });
});

document.getElementById("shareBtn").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url: window.location.href });
      return;
    } catch {
      return;
    }
  }
  copyPageLink();
});

const followBtn = document.getElementById("followBtn");
followBtn.addEventListener("click", () => {
  const following = followBtn.classList.toggle("following");
  followBtn.textContent = following ? "Following" : "Follow";
});

const moreBtn = document.getElementById("moreBtn");
const moreMenu = document.getElementById("moreMenu");
moreBtn.addEventListener("click", () => {
  const open = moreMenu.hasAttribute("hidden");
  if (open) moreMenu.removeAttribute("hidden");
  else moreMenu.setAttribute("hidden", "");
  moreBtn.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  if (!moreMenu.contains(event.target) && event.target !== moreBtn && !moreMenu.hasAttribute("hidden")) {
    moreMenu.setAttribute("hidden", "");
    moreBtn.setAttribute("aria-expanded", "false");
  }
});
document.getElementById("copyLinkBtn").addEventListener("click", () => {
  copyPageLink();
  moreMenu.setAttribute("hidden", "");
  moreBtn.setAttribute("aria-expanded", "false");
});
document.getElementById("viewSourceLink").addEventListener("click", () => {
  moreMenu.setAttribute("hidden", "");
  moreBtn.setAttribute("aria-expanded", "false");
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const open = trigger.getAttribute("aria-expanded") !== "true";
    trigger.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
  });
});

document.getElementById("navLogo").addEventListener("click", () => carousel.scrollIntoView({ behavior: "smooth", block: "start" }));
document.getElementById("navHome").addEventListener("click", () => carousel.scrollIntoView({ behavior: "smooth", block: "start" }));
document.getElementById("navMessages").addEventListener("click", () => document.getElementById("contact-info").scrollIntoView({ behavior: "smooth", block: "start" }));
document.getElementById("navCreate").addEventListener("click", () => document.querySelector(".process-section").scrollIntoView({ behavior: "smooth", block: "start" }));
