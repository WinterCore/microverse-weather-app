import * as utils from "../utils";

const canvas = document.querySelector("#lightning-canvas") as HTMLCanvasElement;

let lightning: Lightning;

type Point = {
    x : number;
    y : number;
};

type LightningBolt = {
    id    : number;
    x     : number;
    y     : number;
    path  : Point[];
    stage : number;
    done  : boolean;
};

class Lightning {
    bolts    : LightningBolt[] = [];
    frames   : number          = 0;
    maxFrames: number          = utils.randomInt(500, 700);

    constructor(width: number, height: number) {
        const count = utils.randomInt(2, 5);
        const x     = utils.randomInt(100, width - 100), y = utils.randomInt(0, height / 4);

        for (let i = 0; i < count; i += 1) {
            const pathLimit = utils.randomInt(40, 65),
                  xRange    = utils.randomInt(5, 30),
                  yRange    = utils.randomInt(10, 35);

            let path: Point[] = [{ x, y }];
            for (let i = 0; i < pathLimit - 1; i += 1) {
                const last = path[path.length - 1];
                path.push({
                    x: last.x + utils.randomInt(-xRange / 2, xRange / 2),
                    y: last.y + utils.randomInt(0, yRange)
                });
            }
            path.shift();
            this.bolts.push({
                id: Date.now(),
                x,
                y,
                path,
                stage: 1,
                done: false
            });
        }
    }
}

const update = ({ canvas, animationMultiplier }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;

    for (let i = 0; i < lightning.bolts.length; i += 1) {
        const bolt = lightning.bolts[i];
        if (bolt.done) continue;
        bolt.stage = Math.min(bolt.stage + 1 * animationMultiplier, bolt.path.length);
        if (bolt.stage >= bolt.path.length) {
            bolt.done = true;
            setTimeout(() => {
                lightning.bolts = lightning.bolts.filter(({ id }) => id !== bolt.id);
            }, 200);
        }
    }

    lightning.frames += 1 * animationMultiplier;
    if (lightning.frames >= lightning.maxFrames) {
        lightning = new Lightning(width, height);
    }
};

const draw = ({ ctx, canvas }: utils.CanvasRendererArg) => {
    const { width, height } = canvas;
    // Clear
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0, 0, 0, ${utils.randomInt(1, 30) / 100})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    // Draw
    for (const bolt of lightning.bolts) {
        ctx.strokeStyle = "rgba(255, 255, 255, .15)";
        ctx.lineWidth = 3;
        if (utils.randomInt(0, 15) === 0) ctx.lineWidth = 6;
        if (utils.randomInt(0, 30) === 0) ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.moveTo(bolt.x, bolt.y);
        for (let i = 0; i < bolt.stage; i += 1) {
            const { x, y } = bolt.path[i];
            ctx.lineTo(x, y);
        }

        ctx.lineJoin = "miter";
        ctx.stroke();
    }
}

const render: utils.CanvasRenderer = (rendererArg) => {
    update(rendererArg);
    draw(rendererArg);

};

const init: utils.CanvasInitializer = (canvas) => {
    const { width, height } = canvas;

    lightning = new Lightning(width, height);

    canvas.style.animation = "thunder 6s infinite";
};

let stopFn: () => void;

const start = () => {
    stopFn = utils.initCanvas(canvas, init, render);
};

const stop = () => {
    if (stopFn) stopFn();
};

export { start, stop };
