const carousel = document.querySelector(".song-list");
const songs = document.querySelectorAll(".song");

const updateCarousel = (animate = true) => {
  const songWidth = updatedSongs[0].offsetWidth + 20;
  const carouselWidth = document.querySelector(".carousel").offsetWidth;
  const offset = (carouselWidth - songWidth) / 2;

  // transition distance based of screen width
  const isScreenSmall =  window.innerWidth <= 800;
  console.log(isScreenSmall);
  const movementDistance = isScreenSmall
    ? window.innerWidth * 0.12
    : window.innerWidth * 0.17;

  if (!animate) {
    carousel.style.transition = "none";
  } else {
    carousel.style.transition = "transform 0.5s ease";
  }

  carousel.style.transform = `translateX(-${
    currentIndex * songWidth - offset + movementDistance
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

const start = (x) => {
  isDragging = true;
  startX = x;
};

const move = (x) => {
  if (!isDragging) return;
  const difference = x - startX;

  if (Math.abs(difference) > 50) {
    if (difference > 0) {
      currentIndex--; // swipe right
    } else {
      currentIndex++; // swipe left
    }
    updateCarousel();
    endSwipe();
  }
};

const endSwipe = () => {
  isDragging = false;
  startX = 0;
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

// auto advance every 5 seconds -- extra credit
let autoAdvanceInterval;
let isAutoAdvancing = false;

const startAutoAdvance = () => {
  autoAdvanceInterval = setInterval(() => {
    currentIndex++;
    updateCarousel();
  }, 1000); // 5000 milliseconds = 5 seconds
  isAutoAdvancing = true;
  document.getElementById("auto-advance-btn").textContent =
    "Pause Auto-Advance"; // Change button text to "Pause"
};

// let user stop the auto-advance
const stopAutoAdvance = () => {
  clearInterval(autoAdvanceInterval);
  isAutoAdvancing = false;
  document.getElementById("auto-advance-btn").textContent =
    "Start Auto-Advance"; // Change button text to "Start"
};

// listen for the button click
document.getElementById("auto-advance-btn").addEventListener("click", () => {
  if (isAutoAdvancing) {
    stopAutoAdvance();
  } else {
    startAutoAdvance();
  }
});



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
  e.preventDefault();
  start(e.touches[0].clientX);
});

carousel.addEventListener("touchmove", (e) => move(e.touches[0].clientX));
carousel.addEventListener("touchend", endSwipe);
