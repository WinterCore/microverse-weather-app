import * as renderer from "./renderer/index";
import { getData } from "./api";
import * as dom from "./dom";

const q = window.localStorage.getItem("location");

if (q) {
    search(q);
} else {
    renderer.init();

    dom.show(dom.$form);

    dom.onSearch(search);
}


async function search(val: string) {
    dom.startLoading();
    dom.clearFormError();
    try {
        const data = await getData(val, "metric");
        dom.stopLoading();
        if (data.cod === "404") {
            dom.setFormError("Country/City was not found.");
            return;
        }

        window.localStorage.setItem("location", val);

        renderer.init(data.weather[0].id);
        dom.setData(data, "metric");
        dom.hide(dom.$form);
        dom.show(dom.$data);
    } catch (e) {
        dom.stopLoading();
        dom.setFormError("Network error.");
        console.log(e);
    }
}