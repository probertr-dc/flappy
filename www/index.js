class DrawArea {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.background = "#03f8fc";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
class Bird {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    draw() {
        drawArea.context.fillStyle = "yellow";
        drawArea.context.beginPath();
        drawArea.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        drawArea.context.fill();
        drawArea.context.stroke();
    }
}
class PipePair {
    constructor(gapTop) {
        this.yTop = 0;
        this.hTop = gapTop;
        this.yBottom = gapTop + (5/12) * document.body.height;
        this.hBottom = document.body.height - gapTop - ((23 / 72) * document.body.height);
        this.x = document.body.width;
        this.w = (7/64) * document.body.width;
    }
    draw() {
        drawArea.context.fillStyle = "#06bd3a";
        drawArea.context.fillRect(this.x, this.yTop, this.w, this.hTop);
        drawArea.context.fillRect(this.x, this.yBottom, this.w, this.hBottom);
    }
    update() {
        this.x -= 5;
    }
}
function MainLoop() {
    drawArea.clear();
    bird.draw();
    for (i = 0; i < pipes.length; i++) {
        pipes[i].draw();
        pipes[i].update();
        if (Colliding(bird.x - bird.r, bird.y - bird.r, bird.r * 2, bird.r * 2, pipes[i].x, pipes[i].yTop, pipes[i].w, pipes[i].hTop) ||
            Colliding(bird.x - bird.r, bird.y - bird.r, bird.r * 2, bird.r * 2, pipes[i].x, pipes[i].yBottom, pipes[i].w, pipes[i].hBottom)) {
            GameOver();
        }
    }
    bird.y += 5;
    if (jumpCounter > 0) {
        bird.y -= jumpCounter;
        jumpCounter--;
    }
    if (bird.y - bird.r >= document.body.height) {
        GameOver();
    }
    else if (bird.y - bird.r < 0) {
        bird.y = bird.r;
    }
    if (frames % 80 == 0 && frames != 0) {
        pipes.push(new PipePair(Math.floor(Math.random() * (251/720) * document.body.height) + (5/36) * document.body.height));
    }
    while (pipes[0].x + pipes[0].w <= 0) {
        pipes.shift();
    }
    frames++;
}
function Colliding(ax, ay, aw, ah, bx, by, bw, bh) {
    if (ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by) {
        return true;
    }
    else {
        return false;
    }
}
function Flap() {
    jumpCounter = 20;
}
function Start() {
    interval = setInterval(MainLoop, 20);
    drawArea.canvas.onclick = Flap;
}
function GameOver() {
    clearInterval(interval);
    drawArea.clear();
    bird.draw();
    for (i = 0; i < pipes.length; i++) {
        pipes[i].draw();
        pipes[i].update();
    }
    drawArea.context.fillStyle = "rgba(143,143,143,0.7)";
    drawArea.context.fillRect(0, 0, document.body.width, document.body.height);
    drawArea.context.fillStyle = "black";
    drawArea.context.font = "70px Arial";
    drawArea.context.fillText("Game Over", (25/64) * document.body.width, (19/36) * document.body.height);
}
var drawArea = new DrawArea(document.body.width, document.body.height);
var bird = new Bird(70, 30, 20);
var pipes = [new PipePair((document.body.height / 3) - (document.body.height / 6))];
drawArea.canvas.onclick = Start;
var jumpCounter = 0;
var frames = 0;
var interval;