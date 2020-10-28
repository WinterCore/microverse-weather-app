import * as renderer from "./renderer/index";
import { getData, TemperatureUnit } from "./api";
import * as dom from "./dom";

let q = window.localStorage.getItem("location");
let unit: TemperatureUnit = window.localStorage.getItem("unit") as TemperatureUnit || "metric";
let loading = false;

dom.setUnitSwitchValue(unit);
renderer.init();

if (q) {
    search(q).catch(console.log);
} else {
    dom.switchMode("dark");
    dom.show(dom.$form);
}

dom.onSearch((val) => search(val).catch(console.log));

dom.onUnitSwitchChange((val) => {
    unit = val;
    window.localStorage.setItem("unit", val);
    if (q) search(q);
});

dom.$searchIcon.addEventListener("click", () => {
    dom.hide(dom.$data);
    dom.show(dom.$form);
    q = null;
});


async function search(val: string) {
    if (loading) return;
    dom.startLoading();
    dom.clearFormError();
    loading = true;
    const unit = dom.getUnitSwitchValue();
    try {
        const data = await getData(val, unit);
        loading = false;
        dom.stopLoading();
        if (data.cod === "404") {
            dom.setFormError("Country/City was not found.");
            return;
        }

        window.localStorage.setItem("location", val);
        q = val;

        renderer.init(data.weather[0].id);
        dom.setData(data, unit);
        dom.hide(dom.$form);
        dom.show(dom.$data);
    } catch (e) {
        dom.stopLoading();
        loading = false;
        dom.setFormError("Network error.");
        console.log(e);
    }
}