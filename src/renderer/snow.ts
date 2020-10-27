import * as utils from "../utils";

let PARTICLES_COUNT = 500;

let particles: SnowParticle[] = [];

const canvas = document.querySelector("#snow-canvas") as HTMLCanvasElement;

let angle = 0;

class SnowParticle {
    x: number;
    y: number;
    r: number = utils.randomFloat(1, 4);
    d: number = utils.randomFloat(5, 50);

    constructor(width: number, height: number) {
        this.x = utils.randomInt(0, width);
        this.y = utils.randomInt(0, height);
    }
}


const draw = ({ ctx, canvas }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (let particle of particles) {
        const { x, y, r } = particle;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.fill();
    }
};

const update = ({ canvas, animationMultiplier }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    angle += 0.005 * animationMultiplier;
    for (let particle of particles) {
        particle.y += Math.cos(angle + particle.d) + 1 * animationMultiplier + (particle.r / 4 * animationMultiplier);
        particle.x += Math.sin(angle) * 2;

        if(particle.x > width + 5 || particle.x < -5 || particle.y > height) {
            if (utils.randomInt(0, 10) > 3) {
                particle.x = utils.randomInt(0, width);
                particle.y = -10;
            } else {
                if (Math.sin(angle) > 0) {
                    particle.x = -5;
                    particle.y = utils.randomInt(0, height);
                } else {
                    particle.x = width + 5;
                    particle.y = utils.randomInt(0, height);
                }
            }
        }
    }
};

const render: utils.CanvasRenderer = (rendererArg) => {
    update(rendererArg);
    draw(rendererArg);
};

const init: utils.CanvasInitializer = (canvas) => {
    const { width, height } = canvas;

    for (let i = 0; i < PARTICLES_COUNT; i += 1) {
        particles[i] = new SnowParticle(width, height);
    }
};

let stopFn: () => void;

type SnowConfig = {
    particlesCount: number;
};

const start = (arg: SnowConfig) => {
    PARTICLES_COUNT = arg.particlesCount;

    stopFn = utils.initCanvas(canvas, init, render);
};

const stop = () => {
    if (stopFn) stopFn();
};

export { start, stop };