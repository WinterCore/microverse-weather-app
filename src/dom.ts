import { TemperatureUnit, WeatherData } from "./api";
import { getFormattedDate, getUnitSign } from "./utils";

export const hide = (elem: HTMLElement) => {
    elem.classList.remove("display-block");
    elem.classList.add("display-none");
};

export const show = (elem: HTMLElement) => {
    elem.classList.remove("display-none");
    elem.classList.add("display-block");
};

export const $form        = document.querySelector("#form") as HTMLFormElement;
export const $formError   = $form.querySelector(".error") as HTMLParagraphElement;
export const $searchInput = $form.querySelector("#location") as HTMLInputElement;
export const $data        = document.querySelector("#data") as HTMLElement;
export const $searchIcon  = document.querySelector(".search-icon") as HTMLElement;
export const $logo        = document.querySelector(".header .icon") as HTMLElement;
export const $unitSwitch  = document.querySelector("#unit-switch") as HTMLInputElement;

export const setFormError = (err: string) => {
    $formError.innerHTML = err;
};

export const clearFormError = () => {
    $formError.innerHTML = "";
};

export const switchMode = (mode: "light" | "dark") => {
    if (mode === "light") {
        document.body.classList.remove("dark");
    } else {
        document.body.classList.add("dark");
    }
};

export const getUnitSwitchValue = (): TemperatureUnit => $unitSwitch.checked ? "imperial" : "metric";

export const onUnitSwitchChange = (fn: (val: TemperatureUnit) => void) => {
    $unitSwitch.addEventListener("change", (e) => {
        fn(getUnitSwitchValue());
    });
};

export const setUnitSwitchValue = (val: TemperatureUnit) => {
    if (val === "imperial") $unitSwitch.checked = true;
};


const onSearch = (cb: (value: string) => void) => {
    $form.addEventListener("submit", (e) => {
        e.preventDefault();
        cb($searchInput.value);
    });
};

const startLoading = () => {
    $logo.classList.add("loading");
    $searchInput.disabled = true;
};
const stopLoading = () => {
    $logo.classList.remove("loading");
    $searchInput.disabled = false;
};

const createTextElement = (tag: string, content: string): HTMLElement => {
    const elem = document.createElement(tag);
    elem.innerHTML = content;
    return elem;
};

export const BACKGORUNDS = {
    darkClouds: "img/thunder-clouds.jpg",
    cloudySky: "img/sky-day.jpg",
    dustySky: "img/dusty-sky.jpg",
    mistySky: "img/misty-sky.jpg",
};

export const setBackground = (bg: keyof typeof BACKGORUNDS) => {
    document.body.style.backgroundImage = `url(${BACKGORUNDS[bg]})`;
};

export const setData = (data: WeatherData, unit: TemperatureUnit) => {
    const $location          = $data.querySelector(".location") as HTMLElement,
          $date              = $data.querySelector(".date") as HTMLElement,
          $desc              = $data.querySelector(".desc") as HTMLElement,
          $temperatureNumber = $data.querySelector(".temperature-number") as HTMLElement,
          $temperatureUnit   = $data.querySelector(".temperature-unit") as HTMLElement,
          $extra             = $data.querySelector(".extra") as HTMLElement;
    
    $location.innerHTML = data.name;
    $date.innerHTML = getFormattedDate(data.timezone);
    $temperatureNumber.innerHTML = Math.round(data.main.temp).toString();
    $desc.innerHTML = data.weather[0].description;
    $temperatureUnit.innerHTML = getUnitSign(unit);
    $extra.innerHTML = "";
    $extra.appendChild(createTextElement("div", "Feels like"));
    $extra.appendChild(createTextElement("div", Math.round(data.main.feels_like).toString()));

    $extra.appendChild(createTextElement("div", "Humidity"));
    $extra.appendChild(createTextElement("div", `${data.main.humidity}%`));

    $extra.appendChild(createTextElement("div", "Min"));
    $extra.appendChild(createTextElement("div", Math.round(data.main.temp_min).toString()));

    $extra.appendChild(createTextElement("div", "Max"));
    $extra.appendChild(createTextElement("div", Math.round(data.main.temp_max).toString()));
};


export {
    onSearch,
    startLoading,
    stopLoading,
};