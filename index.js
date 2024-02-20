const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrn = [...carousel.children];

let isDragging = false;
let startX;
let startSrolllLeft;
let timeOutId;

// !get the number of cards that can fit into the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// ! Insert copies of the last few cards to beginning of  carousel for infinite scrolling
carouselChildrn
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// ! Insert copies of the last few cards to the end  of  the  carousel for infinite scrolling
carouselChildrn.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

//! Events Listeners for left and right buttons
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(firstCardWidth);
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
});
function dragStart(e) {
  isDragging = true;
  carousel.classList.add("dragging");

  // ! Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startSrolllLeft = carousel.scrollLeft;
}
function dragging(e) {
  if (!isDragging) return;
  // ! updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startSrolllLeft - (e.pageX - startX);
}

function dragEnd() {
  isDragging = false;
  carousel.classList.remove("dragging");
}

function autoPlay() {
  if (window.innerWidth < 800) return; // ! no need to autoplay on mobile devices
  timeOutId = setInterval(() => (carousel.scrollLeft += firstCardWidth), 2000);
}
autoPlay();
function infiniteScroll() {
  // ! if the carousel is at the beginning scroll to the end
  if (carousel.scrollLeft === 0) {
    // ! console.log("left end reached");
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // ! If the carousel is at the end scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    //  ! console.log("right end reached");
    carousel.classList.add("no-transition");

    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  clearTimeout(timeOutId);
  if (!wrapper.matches(":hover")) autoPlay();
}
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragEnd);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeOutId));

wrapper.addEventListener("mouseleave", autoPlay);
