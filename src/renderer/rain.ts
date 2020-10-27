import * as utils from "../utils";

let DROPLETS_COUNT = 300;
let DROPLET_COLOR  = "rgba(174,194,224,0.5)";

let TROUGHS_COUNT = 300;
let TROUGH_SPEED = 25;

const canvas = document.querySelector("#rain-canvas") as HTMLCanvasElement;

let droplets: RainDroplet[] = [];
let troughs: RainTrough[] = [];

class RainTrough {
    x: number;
    y: number;

    l      : number = utils.randomInt(1, 830);
    opacity: number = utils.randomFloat(0, 0.2);
    xs     : number = utils.randomFloat(-2, 2);
    ys     : number = utils.randomFloat(10, 20);

    constructor(width: number, height: number) {
        this.x = utils.randomInt(0, width);
        this.y = utils.randomInt(0, height);
    }
}

class RainDroplet {
    x : number;
    y : number;

    l  : number = utils.randomFloat(0, 1);
    xs : number = utils.randomFloat(-2, 2);
    ys : number = utils.randomFloat(10, 20);

    constructor(width: number, height: number) {
        this.x = utils.randomInt(0, width);
        this.y = utils.randomInt(0, height);
    }
}


const draw = ({ ctx, canvas }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    for (let droplet of droplets) {
        ctx.beginPath();
        ctx.moveTo(droplet.x, droplet.y);
        ctx.lineTo(droplet.x + droplet.l * droplet.xs, droplet.y + droplet.l * droplet.ys);
        ctx.strokeStyle = DROPLET_COLOR;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
    }

    for (let trough of troughs) {
        ctx.beginPath();
        const grd = ctx.createLinearGradient(0, trough.y, 0, trough.y + trough.l);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255," + trough.opacity + ")");

        ctx.fillStyle = grd;
        ctx.fillRect(trough.x, trough.y, 1, trough.l);
        ctx.fill();
    }
};

const update = ({ canvas, animationMultiplier }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    for (let droplet of droplets) {
        droplet.x += droplet.xs * animationMultiplier;
        droplet.y += droplet.ys * animationMultiplier;
        if (droplet.x > width || droplet.y > height) {
            droplet.x = utils.randomInt(0, width);
            droplet.y = -20;
        }
    }
    for (let trough of troughs) {
        trough.y += TROUGH_SPEED * animationMultiplier;
        if (trough.y >= height) {
            trough.y = height - trough.y - trough.l * 5;
        }
    }
};

const render: utils.CanvasRenderer = (rendererArg) => {
    update(rendererArg);
    draw(rendererArg);
};



const init: utils.CanvasInitializer = (canvas) => {
    const { width, height } = canvas;

    for (let i = 0; i < DROPLETS_COUNT; i += 1) {
        droplets[i] = new RainDroplet(width, height);
    }

    for (let i = 0; i < TROUGHS_COUNT; i += 1) {
        troughs[i] = new RainTrough(width, height);
    }
};

let stopFn: () => void;

type RainConfig = {
    dropletsCount : number;
    troughsCount  : number;
};

const start = (arg: RainConfig) => {
    DROPLETS_COUNT = arg.dropletsCount;
    TROUGHS_COUNT  = arg.troughsCount;
    canvas.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    stopFn = utils.initCanvas(canvas, init, render);
};

const stop = () => {
    if (stopFn) stopFn();
    canvas.style.backgroundColor = "transparent";
};

export { start, stop };