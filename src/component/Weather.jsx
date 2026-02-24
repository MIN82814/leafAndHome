import axios from "axios";
import { useEffect, useState } from "react";

import clearDay from "/clearDay.svg";
import partlyCloudyDay from "/partlyCloudyDay.svg";
import rainyDay from "/rainyDay.svg";


function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://papa2415-weather.zeabur.app/api/weather/taipei";

  useEffect(() => {
    const getWeather = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_BASE);
        const forecasts = res.data?.data?.forecasts || [];
        setWeatherData(forecasts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getWeather();
  }, []);

  if (loading) return <div>天氣資料載入中...</div>;
  if (weatherData.length === 0) return <div>目前沒有預報資料</div>;

  // 取得當前時段資料
  const now = new Date();
  const currentForecast =
    weatherData.find((f) => {
      const start = new Date(f.startTime.replace(" ", "T"));
      const end = new Date(f.endTime.replace(" ", "T"));
      return now >= start && now <= end;
    }) || weatherData[0];

  const weather = currentForecast?.weather || "";

  let WeatherIcon;

  if (weather.includes("雨")) {
    WeatherIcon = <img src={rainyDay} alt="雨天" />;
  } else if (weather.includes("雲") || weather.includes("陰")) {
    WeatherIcon = <img src={partlyCloudyDay} alt="陰天" />;
  } else {
    WeatherIcon = <img src={clearDay} alt="晴天" />;
  }

  return (
    <>
      <section className="weather-widget-container d-flex flex-column align-items-start">
        <div className="glass-circle">
          <div className="weather-icon">{WeatherIcon}</div>
        </div>
      </section>
    </>
  );
}

export default Weather;
