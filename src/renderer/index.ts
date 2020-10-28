import * as rain from "./rain";
import * as lightning from "./lightning";
import * as clouds from "./clouds";
import * as snow from "./snow";
import { randomInt } from "../utils";
import { switchMode, setBackground } from "../dom";

const handleThunderstorm = (id: number) => {
    setBackground("darkClouds");
    switchMode("dark");
    lightning.start();

    switch (id) {
        case 200:
        case 230:
            rain.start({ troughsCount: 20, dropletsCount: 100 });
            break;
        case 201:
        case 231:
            rain.start({ troughsCount: 80, dropletsCount: 300 });
            break;
        case 202:
        case 232:
            rain.start({ troughsCount: 200, dropletsCount: 500 });
            break;
        default:
            rain.start({ troughsCount: 30, dropletsCount: 150 });
            break;
    }
};

const handleDrizzle = (id: number) => {
    setBackground("darkClouds");
    switchMode("dark");

    switch (id) {
        case 300:
        case 310:
            rain.start({ troughsCount: 0, dropletsCount: 70 });
            break;
        case 301:
        case 311:
            rain.start({ troughsCount: 0, dropletsCount: 150 });
            break;
        case 302:
        case 312:
            rain.start({ troughsCount: 20, dropletsCount: 100 });
            break;
        case 314:
            rain.start({ troughsCount: 50, dropletsCount: 200 });
            break;
        default:
            rain.start({ troughsCount: 10, dropletsCount: 150 });
            break;
    }
};

const handleRain = (id: number) => {
    setBackground("darkClouds");
    switchMode("dark");

    switch (id) {
        case 500:
        case 520:
            rain.start({ troughsCount: 10, dropletsCount: 100 });
            break;
        case 501:
            rain.start({ troughsCount: 30, dropletsCount: 150 });
            break;
        case 502:
        case 503:
            rain.start({ troughsCount: 50, dropletsCount: 300 });
            break;
        case 504:
            rain.start({ troughsCount: 50, dropletsCount: 400 });
            break;
        case 511:
            rain.start({ troughsCount: 100, dropletsCount: 500 });
            break;
        default:
            rain.start({ troughsCount: 50, dropletsCount: 300 });
            break;
    }
};

const handleSnow = (id: number) => {
    setBackground("darkClouds");
    switchMode("dark");

    switch (id) {
        case 600:
        case 611:
            snow.start({ particlesCount: 150 });
            break;
        case 601:
            snow.start({ particlesCount: 320 });
            break;
        case 602:
            snow.start({ particlesCount: 450 });
            break;
        case 612:
        case 613:
            snow.start({ particlesCount: 150 });
            rain.start({ troughsCount: 10, dropletsCount: 50 });
            break;
        case 615:
        case 616:
            snow.start({ particlesCount: 150 });
            rain.start({ troughsCount: 10, dropletsCount: 100 });
            break;
        case 620:
        case 621:
            snow.start({ particlesCount: 350 });
            rain.start({ troughsCount: 30, dropletsCount: 100 });
            break;
        case 622:
            snow.start({ particlesCount: 500 });
            rain.start({ troughsCount: 30, dropletsCount: 200 });
            break;
        default:
            snow.start({ particlesCount: 50 });
            break;
    }
};

const handleOthers = (id: number) => {
    switch (id) {
        case 701:
        case 711:
        case 721:
        case 741:
            switchMode("light");
            setBackground("mistySky");
            break;
        case 731:
        case 751:
        case 761:
        case 762:
            switchMode("dark");
            setBackground("dustySky");
            break;
        default:
            switchMode("light");
            setBackground("cloudySky");
            break;
    }
};

const handleClouds = (id: number) => {
    switchMode("light");
    setBackground("cloudySky");

    switch (id) {
        case 801:
            clouds.start({ count: 10 });
            break;
        case 802:
            clouds.start({ count: 20 });
            break;
        case 803:
            clouds.start({ count: 30 });
            break;
        case 804:
            clouds.start({ count: 40 });
            break;
        default:
            clouds.start({ count: 15 });
            break;
    }
};

const init = (id ?: number) => {
    // Stop all animations
    [rain, lightning, clouds, snow].forEach(item => item.stop());

    if (id === undefined) {
        init(randomInt(300, 900));
        return;
    }

    // Weather condition id handling.
    // For more info refer to: https://openweathermap.org/weather-conditions

    if (id < 300) { // Thunderstorm
        handleThunderstorm(id);
    } else if (id < 400) { // Drizzle
        handleDrizzle(id);
    } else if (id < 600) { // Rain
        handleRain(id);
    } else if (id < 700) { // Snow
        handleSnow(id);
    } else if (id > 801) {
        handleClouds(id);
    } else { // others
        handleOthers(id);
    }
}

export { init };