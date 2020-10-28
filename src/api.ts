const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "1e5b60249223eb25245ce5722c4fdc18";

export type WeatherData = {
    weather: {
        id          : number;
        main        : string;
        description : string;
        icon        : string;
    }[];

    main: {
        temp       : number;
        feels_like : number;
        temp_min   : number;
        temp_max   : number;
        humidity   : number;
    };

    timezone : number;
    name     : string;

    cod ?: string;
};

export type TemperatureUnit = "metric" | "imperial";

const getData = async (q: string, units: TemperatureUnit): Promise<WeatherData> => {
    return (await fetch(`${API_URL}?${new URLSearchParams({
        appid: API_KEY,
        units,
        q
    })}`)).json();
};



export { getData };