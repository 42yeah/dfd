function reject(reason) {
    const submits = document.querySelectorAll(".submit");
    submits.forEach(submit => {
        submit.classList.add("inactive");
        submit.innerHTML = reason;
        submit.href = "javascript:void(0)";
    });
}

function toggle(header) {
    const body = header.nextElementSibling;
    const acch = header.querySelector(".acch");
    
    if (body.classList.contains("collapsed")) {
        header.classList.add("active");
        body.classList.remove("collapsed");
        acch.classList.add("rot90");
        scrollTo(0, header.getBoundingClientRect().y
            + window.innerHeight / 2.0);
    } else {
        header.classList.remove("active");
        body.classList.add("collapsed");
        acch.classList.remove("rot90");
    }
}

const balls = [];
const maxBalls = 100;
let canvas, ctx;
let lastInstant = 0.0;

function randomSgn() {
    return Math.random() < 0.5 ? -1 : 1;
}

function drawRandomBalls(thisInstant) {
    function max(a, b) {
        return a > b ? a : b;
    }

    function min(a, b) {
        return a < b ? a : b;
    }

    function updateBalls() {
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            ball.x += ball.dx * deltaTime;
            ball.y += ball.dy * deltaTime;
            ball.a += ball.ra * deltaTime;
            if (ball.a > 2.0 && ball.ra > 0) { ball.ra = -ball.ra; }
            if (ball.a < 0.0) {
                balls.splice(i, 1);
                i--;
                continue;
            }
            ball.rx = canvas.width * ball.x;
            ball.ry = canvas.height * ball.y;
            ball.rr = max(canvas.width, canvas.height) * ball.r;
        }
    }

    function renderBalls() {
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            ctx.beginPath();
            ctx.fillStyle = "rgba(96, 184, 24, " + min(0.3, ball.a) + ")";
            ctx.arc(ball.rx, ball.ry, ball.rr, 0, 2.0 * Math.PI, false);
            ctx.fill();
        }
    }

    requestAnimationFrame(drawRandomBalls);

    const deltaTime = (thisInstant - lastInstant) / 1000.0;
    lastInstant = thisInstant;

    canvas.width = window.innerWidth * 2.0;
    canvas.height = window.innerHeight * 2.0;

    let spawnBalls = (maxBalls - balls.length) / maxBalls;
    if (Math.random() < spawnBalls * 0.1) {
        const ball = {
            x: Math.random(),
            y: Math.random(),
            dx: randomSgn() * Math.random() * 0.01,
            dy: randomSgn() * Math.random() * 0.01,
            r: Math.random() * 0.1,
            a: 0.0,
            ra: Math.random() * 1.0
        };
        balls.push(ball);
    }

    updateBalls();
    renderBalls();
}

function prize(e) {
    for (let i = 0; i < 30; i++) {
        const ball = {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
            dx: randomSgn() * Math.random() * 0.3,
            dy: randomSgn() * Math.random() * 0.3,
            r: 0.01,
            a: Math.random() * 0.7,
            ra: -0.7
        };
        balls.push(ball);
    }
}

function main() {
    document.querySelectorAll(".accordion-header").forEach(elem => {
        elem.addEventListener("click", () => {
            toggle(elem);
        });
    });

    canvas = document.querySelector(".background");
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawRandomBalls);

    window.onscroll = () => {
        canvas.setAttribute("style", "top: " + window.scrollY + "px"); // Force sticky
    };

    document.querySelectorAll(".prize-item").forEach(p => {
        p.addEventListener("click", prize);
    });
}

window.addEventListener("load", main);

const start = new Date("2020/4/25");
const end = new Date("2020/4/30");

if (end - new Date() < 0) {
    reject("提交已经结束");
} else if (start - new Date() > 0) {
    reject("尚未开始接受提交");
}
