// The midi notes of a scale
let notes = [60, 62, 64, 65, 67, 69, 71];

// For automatically playing the song
let index = 0;
let song = [
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 200, display: "G" },
  { note: 1, duration: 200, display: "A" },
  { note: 2, duration: 200, display: "B" },
  { note: 3, duration: 200, display: "C" },
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 400, display: "G" },
  { note: 0, duration: 400, display: "G" }
];
let trigger = 0;
let autoplay = false;
let osc;

this.setup = function () {
  this.createCanvas(720, 400);
  let div = this.createDiv("Click to play notes or ")
  div.id("instructions");
  let button = this.createButton("play song automatically.");
  button.parent("instructions");
  // Trigger automatically playing
  button.mousePressed(function () {
    if (!autoplay) {
      index = 0;
      autoplay = true;
    }
  });

  // A triangle oscillator
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);
}

// A function to play a note
this.playNote = function (note, duration) {
  osc.freq(this.midiToFreq(note));
  // Fade it in
  osc.fade(0.5, 0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function () {
      osc.fade(0, 0.2);
    }, duration - 50);
  }
}

this.draw = function () {

  // If we are autoplaying and it's time for the next note
  if (autoplay && this.millis() > trigger) {
    this.playNote(notes[song[index].note], song[index].duration);
    trigger = this.millis() + song[index].duration;
    // Move to the next note
    index++;
    // We're at the end, stop autoplaying.
  } else if (index >= song.length) {
    autoplay = false;
  }


  // Draw a keyboard

  // The width for each key
  let w = this.width / notes.length;
  for (let i = 0; i < notes.length; i++) {
    let x = i * w;
    // If the mouse is over the key
    if (this.mouseX > x && this.mouseX < x + w && this.mouseY < this.height) {
      // If we're clicking
      if (this.mouseIsPressed) {
        this.fill(100, 255, 200);
        // Or just rolling over
      } else {
        this.fill(127);
      }
    } else {
      this.fill(200);
    }

    // Or if we're playing the song, let's highlight it too
    if (autoplay && i === song[index - 1].note) {
      this.fill(100, 255, 200);
    }

    // Draw the key
    this.rect(x, 0, w - 1, this.height - 1);
  }
}

// When we click
this.mousePressed = function (event) {
  if (event.button == 0 && event.clientX < this.width && event.clientY < this.height) {
    // Map mouse to the key index
    let key = this.floor(this.map(this.mouseX, 0, this.width, 0, notes.length));
    this.playNote(notes[key]);
  }
}

// Fade it out when we release
this.mouseReleased = function () {
  osc.fade(0, 0.5);
}
