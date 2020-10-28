export const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number): number => Math.floor(randomFloat(min, max));

export const updateFps = (times: number[]) => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    return times.length;
};

export type CanvasRendererArg = {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    animationMultiplier: number;
};

export type CanvasRenderer = (args: CanvasRendererArg) => void;

export type CanvasInitializer = (canvas: HTMLCanvasElement) => void;

export const initCanvas = (canvas: HTMLCanvasElement, init: CanvasInitializer, render: CanvasRenderer) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let requestAnimationId = 0;

    let fps = 0;
    let animationMultiplier = 1;
    let fpsTracker: number[] = [];


    const customRender = () => {
        fps = updateFps(fpsTracker);
        animationMultiplier = 60 / fps;

        render({ canvas, ctx, animationMultiplier });
        requestAnimationId = window.requestAnimationFrame(customRender);
    };

    const cleanup = () => {
        window.cancelAnimationFrame(requestAnimationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(canvas);
    requestAnimationId = window.requestAnimationFrame(customRender);

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(canvas);
    });

    return cleanup;
};

export const getUnitSign = (unit: string) => unit === "imperial" ? "F" : "C";

export const getOrdinalSuffix = (n: number): string => {
    const j = n % 10,
          k = n % 100;
    if (j === 1 && k !== 11) {
        return "st";
    }
    if (j === 2 && k !== 12) {
        return "nd";
    }
    if (j === 3 && k !== 13) {
        return "rd";
    }
    return "th";
};

export const getFormattedDate = (secondsOffset: number): string => {
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date();

    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    const d = new Date(utc + secondsOffset * 1000);

    return `${DAYS[d.getDay()]}, ${d.getDate()}<sup>${getOrdinalSuffix(d.getDate())}</sup> of ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};