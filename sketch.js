// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDrawing = false; // 用於判斷是否繪製軌跡
let prevX, prevY; // 儲存上一個位置

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;

  // Set background once to avoid clearing it in draw()
  background(255);
}

function draw() {
  // Draw the video feed
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw keypoints
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if keypoint[8] (index finger tip) is touching the circle
        let indexFinger = hand.keypoints[8];
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Move the circle to the index finger's position
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // Start drawing the trajectory
          if (!isDrawing) {
            isDrawing = true;
            prevX = indexFinger.x;
            prevY = indexFinger.y;
          } else {
            // Draw the trajectory line
            stroke(255, 0, 0); // Red color for the trajectory
            strokeWeight(2);
            line(prevX, prevY, indexFinger.x, indexFinger.y);
            prevX = indexFinger.x;
            prevY = indexFinger.y;
          }
        } else {
          // Stop drawing when the finger leaves the circle
          isDrawing = true;
        }
      }
    }
  }
}
