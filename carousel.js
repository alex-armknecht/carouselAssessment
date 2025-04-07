const carousel = document.querySelector(".song-list");
const songs = document.querySelectorAll(".song");

const updateCarousel = (animate = true) => {
  const songWidth = updatedSongs[0].offsetWidth + 20;
  const carouselWidth = document.querySelector(".carousel").offsetWidth;
  const offset = (carouselWidth - songWidth) / 2;

  if (!animate) {
    carousel.style.transition = "none";
  } else {
    carousel.style.transition = "transform 0.5s ease";
  }

  carousel.style.transform = `translateX(-${
    currentIndex * songWidth - offset + 200
  }px)`;
  updateIndicators();
};

// making songs loop so need clone
const songList = document.querySelector(".song-list");
const firstClone = songs[0].cloneNode(true);
const lastClone = songs[songs.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

songList.appendChild(firstClone);
songList.insertBefore(lastClone, songs[0]);

const updatedSongs = document.querySelectorAll(".song");
let currentIndex = 1; // start from the first song (not the clone)

let isJumping = false; // to show when we are jumping without animation (needed fix for mobile swipe)

const handleTransitionEnd = () => {
  const songCount = updatedSongs.length;

  if (updatedSongs[currentIndex].classList.contains("clone") && !isJumping) {
    isJumping = true;
    if (currentIndex === 0) {
      // Moved to lastClone -- Jump to real last
      currentIndex = songCount - 2;
    } else if (currentIndex === songCount - 1) {
      // Moved to firstClone -- Jump to real first
      currentIndex = 1;
    }

    requestAnimationFrame(() => {
      //needed to avoid glitch on mobile
      updateCarousel(false); // Jump without animation
      requestAnimationFrame(() => {
        isJumping = false; // allow next normal transition
      });
    });
  }
};

// arrow button functionality
document.querySelector("#prev").addEventListener("click", () => {
  currentIndex--;
  updateCarousel();
});

document.querySelector("#next").addEventListener("click", () => {
  currentIndex++;
  updateCarousel();
});

// swipe functionality
let startX = 0;
let isDragging = false;

const start = (x) => {
  isDragging = true;
  startX = x;
};

const move = (x) => {
  if (!isDragging) return;
  const difference = x - startX;

  if (Math.abs(difference) > 50) {
    currentIndex =
      difference > 0
        ? (currentIndex - 1 + songs.length) % songs.length //user goes right
        : (currentIndex + 1) % songs.length; //user goes left

    updateCarousel();
    isDragging = false;
  }
};

// indicator dots functionality
const indicatorContainer = document.querySelector(".indicators");

updatedSongs.forEach((song, index) => {
  // make one dot per song (no clones)
  if (!song.classList.contains("clone")) {
    const dot = document.createElement("div");
    dot.classList.add("indicator-dot");
    indicatorContainer.appendChild(dot);
  }
});

const updateIndicators = () => {
  const dots = document.querySelectorAll(".indicator-dot");
  const realIndex = (currentIndex - 1 + dots.length) % dots.length;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === realIndex);
  });
};

// for the looping effect
carousel.addEventListener("transitionend", handleTransitionEnd);

// event listeners for mouse and touch events
carousel.addEventListener("mousedown", (e) => start(e.clientX));
carousel.addEventListener("mousemove", (e) => move(e.clientX));
carousel.addEventListener("mouseup", () => (isDragging = false));

carousel.addEventListener("touchstart", (e) => start(e.touches[0].clientX));
carousel.addEventListener("touchmove", (e) => move(e.touches[0].clientX));
carousel.addEventListener("touchend", () => (isDragging = false));
