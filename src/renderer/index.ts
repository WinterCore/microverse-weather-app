import * as rain from "./rain";
import * as lightning from "./lightning";
import * as clouds from "./clouds";

const init = () => {
    // document.body.style.backgroundImage = "url(img/thunder-clouds.jpg)";
    document.body.style.backgroundImage = "url(img/sky-day.jpg)";
    // initLightningRenderer();
    // rain.start();
    clouds.start();
    // lightning.start();
};

export { init };