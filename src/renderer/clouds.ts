import * as utils from "../utils";

const canvas = document.querySelector("#cloud-canvas") as HTMLCanvasElement;

let clouds: Cloud[] = [];

const CLOUDS_COUNT = 30;

class Cloud {
    x : number;
    y : number;

    opacity   : number = utils.randomFloat(0.3, 0.8);
    length    : number = utils.randomInt(30, 100);
    thickness : number = utils.randomFloat(2, 30);
    xs        : number = utils.randomFloat(0.5, 4);

    constructor(width: number, height: number) {
        this.x = utils.randomInt(0, width);
        this.y = utils.randomInt(0, height);
    }
}

const update = ({ canvas, animationMultiplier }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    for (let cloud of clouds) {
        cloud.x += cloud.xs * animationMultiplier;
        if (cloud.x >= width) {
            cloud.x = - cloud.length;
            cloud.y = utils.randomInt(0, height);
        }
    }
};

const draw = ({ ctx, canvas }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    for (let cloud of clouds) {
        ctx.beginPath();
        ctx.lineTo(cloud.x, cloud.y);
        ctx.lineTo(cloud.x + cloud.length, cloud.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        ctx.lineWidth = cloud.thickness;
        ctx.lineCap = "round";
        ctx.stroke();
    }
};

const render: utils.CanvasRenderer = (rendererArg) => {
    update(rendererArg);
    draw(rendererArg);
};


const init: utils.CanvasInitializer = (canvas) => {
    const { width, height } = canvas;

    for (let i = 0; i < CLOUDS_COUNT; i += 1) {
        clouds[i] = new Cloud(width, height);
    }
};

let stopFn: () => void;

const start = () => {
    stopFn = utils.initCanvas(canvas, init, render);
};

const stop = () => {
    if (stopFn) stopFn();
};

export { start, stop };
