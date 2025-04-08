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
let currentIndex = 0;

const handleTransitionEnd = () => {
  const songCount = updatedSongs.length;

  if (updatedSongs[currentIndex].classList.contains("clone")) {
    if (currentIndex === 0) {
      // Moved to lastClone -- Jump to real last
      currentIndex = songCount - 2;
    } else if (currentIndex === songCount - 1) {
      // Moved to firstClone -- Jump to real first
      currentIndex = 1;
    }
    updateCarousel(false); // No animation
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
let swipeInProgress = false;  // New flag to prevent multiple swipe actions

const start = (x) => {
  if (swipeInProgress) return; // Prevent starting a new swipe if one is already in progress
  console.log("Swipe started");  // Debugging start of swipe
  isDragging = true;
  startX = x;
  swipeInProgress = true; // Mark swipe as in progress
};

const move = (x) => {
  if (!isDragging || !swipeInProgress) return; // Stop if no swipe in progress
  console.log("Swipe moving...");  // Debugging move function
  const difference = x - startX;

  if (Math.abs(difference) > 50) {
    if (difference > 0) {
      currentIndex--; // swipe right
    } else {
      currentIndex++; // swipe left
    }
    updateCarousel();
    endSwipe(); // End swipe immediately after moving
  }
};

const endSwipe = () => {
  if (!swipeInProgress) return; // Prevent multiple executions of endSwipe
  console.log("Swipe ended");  // Debugging end of swipe
  isDragging = false;
  startX = 0;
  swipeInProgress = false; // Reset swipe in progress flag
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

// event listeners for mouse events
carousel.addEventListener("mousedown", (e) => {
  e.preventDefault(); //stop text/image drag
  start(e.clientX);
});

carousel.addEventListener("mousemove", (e) => move(e.clientX));
carousel.addEventListener("mouseup", endSwipe);
carousel.addEventListener("mouseleave", endSwipe);

// event listeners for touch events
carousel.addEventListener("touchstart", (e) => {
  console.log("touchstart");
  e.preventDefault();
  start(e.touches[0].clientX);
});

carousel.addEventListener("touchmove", (e) => {
  if (!swipeInProgress) return; // Ignore move if swipe is not in progress
  console.log("touchmove");
  move(e.touches[0].clientX);
});

carousel.addEventListener("touchend", () => {
  console.log("touchend");
  endSwipe(); // End the swipe when touch ends
});

carousel.addEventListener("touchcancel", () => {
  console.log("touchcancel");
  endSwipe(); // Reset if touch is canceled
});
