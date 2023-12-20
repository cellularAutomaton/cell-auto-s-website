let letters = [];
let name = "Lincoln Domina";
let canvasParent = document.getElementById('tuning-diagram');
let parentWidth = canvasParent.offsetWidth;
let fontSize = 60; // Updated size
let spacing = 2; // Adjusted space between letters
let audio_path = "audio/";
let audioFiles = {};
let audioStarted = false;

// Load audio files and initialize the letters
function preload() {
    let uniqueChars = new Set(name.toLowerCase().replace(/\s+/g, ''));

    uniqueChars.forEach(char => {
        audioFiles[char] = loadSound(audio_path + char + ".wav");
    });
}

function setup() {
    let canvas = createCanvas(parentWidth, fontSize * 2); // Adjusted height
    canvas.parent('tuning-diagram');
    textFont('Cormorant Garamond');
    textSize(fontSize);

    initializeLetters();
    userStartAudio().then(function() {
      // hide the html element "(click to start audio)"
      audioStarted = true;
      document.getElementById('click-for-sound').style.display = 'none';
    });
}

function draw() {
    background(255);

    for (let letter of letters) {
        letter.display();
        letter.checkHover(mouseX, mouseY);
    }
    
}

function windowResized() {
    parentWidth = canvasParent.offsetWidth;
    resizeCanvas(parentWidth, fontSize * 2); // Adjusted height
    initializeLetters();
}

function initializeLetters() {
    letters = [];
    let totalWidth = 0;

    for (let i = 0; i < name.length; i++) {
        totalWidth += textWidth(name[i]) + spacing;
    }

    let startX = (width - totalWidth) / 2; // Centering the text

    for (let i = 0; i < name.length; i++) {
        let charWidth = textWidth(name[i]);
        if (name[i] !== " ") { console.log(name[i]); letters.push(new Letter(startX, fontSize * 1.5, name[i], charWidth)); } // Adjusted y-coordinate
        startX += charWidth + spacing;
    }
}

class Letter {
    constructor(x, y, char, width) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.width = width;
        this.isHovered = false;
        this.defaultColor = color(0);
        this.hoverColor = color(204, 153, 255);
        this.audio = audioFiles[char.toLowerCase()];
    }

    display() {
        fill(this.isHovered ? this.hoverColor : this.defaultColor);
        noStroke();
        text(this.char, this.x, this.y);
    }
    
    startedHovering() {
    	// called when the mouse initially goes over the letter
        if (this.audio.isPlaying()) {
            this.audio.stop();
            this.audio.currentTime(0); // Reset the playback position to the start
        }
        if (audioStarted) {
            this.audio.play();
        }
    }
    
    checkHover(mx, my) {
        if (mx > this.x && mx < this.x + this.width && my > this.y - fontSize && my < this.y) {
            // if here, we're hovering this frame
            if (!this.isHovered) {
                // was not hovering last frame
                this.startedHovering();
            }
            this.isHovered = true;
        } else {
            // not hovering over this letter
            this.isHovered = false;
        }
    }
}

