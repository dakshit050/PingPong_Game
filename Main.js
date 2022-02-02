const Ball_SPEED = 0.025;
const SPPED_INC = 0.00001;
const PADDLE_SPEED = 0.02;
class Ball {
	constructor(ballObj) {
		this.ballObj = ballObj;
		this.resetposition();
	}
	get x() {
		return parseFloat(getComputedStyle(this.ballObj).getPropertyValue("--x"));
	}
	get y() {
		return parseFloat(getComputedStyle(this.ballObj).getPropertyValue("--y"));
	}
	set x(val) {
		this.ballObj.style.setProperty("--x", val);
	}
	set y(val) {
		this.ballObj.style.setProperty("--y", val);
	}
	rect() {
		return this.ballObj.getBoundingClientRect();
	}
	resetposition() {
		this.x = 50;
		this.y = 50;
		this.dir = { x: 0 };
		while (Math.abs(this.dir.x) <= 0.2 || Math.abs(this.dir.x) >= 0.9) {
			const heading = randomNumberBetween(0, 2 * Math.PI);
			this.dir = { x: Math.cos(heading), y: Math.sin(heading) };
		}
		this.speed = Ball_SPEED;
	}
	setposition(delta, paddles) {
		this.x += this.dir.x * delta * this.speed;
		this.y += this.dir.y * delta * this.speed;
		this.speed += SPPED_INC * delta;
		if (this.ballObj.getBoundingClientRect().bottom >= window.innerHeight || this.ballObj.getBoundingClientRect().top <= 0) {
			this.dir.y *= -1;
		}
		if (paddles.some((r) => isCollision(r, this.rect()))) {
			this.dir.x *= -1;
		}
	}
}

class Paddle {
	constructor(paddle) {
		this.paddle = paddle;
		this.resetPaddle();
	}
	rect() {
		return this.paddle.getBoundingClientRect();
	}
	get position() {
		return parseFloat(getComputedStyle(this.paddle).getPropertyValue("--position"));
	}
	set position(val) {
		this.paddle.style.setProperty("--position", val);
	}
	resetPaddle() {
		this.position = 50;
	}
	movePaddle(delta, ballpos) {
		this.position += delta * PADDLE_SPEED * (ballpos - this.position);
	}
}
function randomNumberBetween(min, max) {
	return Math.random() * (max - min) + min;
}

const ball = new Ball(document.getElementById("ball"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
let lastTime;
function update(time) {
	if (lastTime != null) {
		const delta = time - lastTime;
		ball.setposition(delta, [playerPaddle.rect(), computerPaddle.rect()]);
		computerPaddle.movePaddle(delta, ball.y);

		if (ball.rect().right >= window.innerWidth || ball.rect().left <= 0) {
			const rect = ball.rect();
			if (rect.right >= window.innerWidth) {
				playerScore.textContent = parseInt(playerScore.textContent) + 1;
			} else {
				computerScore.textContent = parseInt(computerScore.textContent) + 1;
			}
			ball.resetposition();
			computerPaddle.resetPaddle();
		}
	}
	lastTime = time;
	window.requestAnimationFrame(update);
}

function isCollision(rect1, rect2) {
	return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
}
document.addEventListener("mousemove", (e) => {
	playerPaddle.position = (e.y / window.innerHeight) * 100;
	if (playerPaddle.rect().top <= 0) {
		playerPaddle.position = 5.6;
	}
	if (playerPaddle.rect().bottom >= window.innerHeight) {
		playerPaddle.position = window.innerHeight - 573;
	}
});

update();
