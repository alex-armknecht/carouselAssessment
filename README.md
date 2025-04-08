#README

##Running the Project
You can view the project live at: [Spotify's Top 5 Carousel](https://alex-armknecht.github.io/carouselAssessment/). To run it locally:

Install Yarn: Run npm install -g yarn (if you don’t have it installed).

Start the development server: yarn dev.

To access the local server on a mobile device (on the same Wi-Fi), run: yarn dev --host.

##Libraries and Tools
This project doesn’t use any external libraries, but I did use:

Google Font: "Boldonse" for the typography.

Images: Album images from Spotify and the "record" image from pngimg.com.

For some parts of the project, I revisited W3Schools and checked Stack Overflow for solutions, especially for mobile design and handling JavaScript nodes, since it's been a while since I last built a website.

##Thought Process

The goal was to create a carousel that displays Spotify’s top 5 songs with a clean, jukebox-inspired design. I focused on keeping the HTML and CSS simple but responsive. The JavaScript handles smooth transitions between songs with infinite looping by cloning the first and last songs. It also supports both arrow button navigation and swipe functionality on mobile and desktop. Indicator dots show the current song, and event listeners are used for both mouse and touch interactions. For extra credit, I implemented auto-advance using setInterval to automatically move the carousel every 5 seconds, and added a spinning "record" button using CSS keyframe animations.

##Challenges and Solutions
Looping Songs: I had to refresh my knowledge of nodes and NodeLists in JavaScript to properly loop the songs. The main challenge was managing the position of the cloned songs, ensuring the carousel displayed correctly when looping.

Partial Songs on the Sides: Initially, the carousel displayed uneven partial songs on the sides. To fix this, I created a variable "movementDistance" that calculates the window's width and adjusts the movement for each transition, ensuring the songs fit properly.

Swipe Bug on Mobile: The swipe functionality on mobile did not work even though it did on Deskop, and I spent a lot of time trying to fix it. Eventually, I realized I was complicating the logic, and further changes started to break the original swipe behavior, especially causing issues when trying to swipe backward. My approach to fixing this included:

First attempt: I tried to make the carousel follow the user’s swipe directly, but it didn't work as expected.

Second attempt: I adjusted the event listeners to register swipe left or right and trigger updateCarousel().

Third attempt: I implemented an endSwipe() function to reset startX, but it still didn’t resolve the issue.

Fourth attempt: I used flags to check whether a swipe was in progress and refined the event listeners. Despite these improvements, the touchmove event still fired even after the swipe ended, which caused issues.

At this point, the mobile swipe worked only once. In all honesty I even used ChatGPT for debugging, but still couldn't fix the issue due to time constraints. However, this experience taught me how to run a local host and view the console on my iPhone, which was helpful for testing mobile functionality.
