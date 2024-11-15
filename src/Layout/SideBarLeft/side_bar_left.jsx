import React, { useEffect, useState } from "react";
import "./side_bar_left.scss";
import { FaTemperatureLow } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { IoMdCloudOutline } from "react-icons/io";
import { WiHumidity } from "react-icons/wi";
import { IoRainyOutline } from "react-icons/io5";
import { getDataInfoCountry, getDataWeatherCurrent, getDataWeatherForecast } from "../../services/fetch_api";
import ArticleLoader from "../../skeleton/article_loader";


function SideBarLeft() {
    let days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const [weatherCurrent, setWeatherCurrent] = useState({});
    const [weatherForecast, setWeatherForecast] = useState({});
    const [infoCountry, setInfoCountry] = useState({});
    const [loaderWeather, setLoaderWeather] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const currentWeather = await getDataWeatherCurrent();
                setWeatherCurrent(currentWeather);
                const forecastWeather = await getDataWeatherForecast();
                setWeatherForecast(forecastWeather);
                if (currentWeather.cod === 200 && forecastWeather.cod === '200') {
                    const countryName = currentWeather.sys.country;
                    const countryInfo = await getDataInfoCountry(countryName);
                    if (countryInfo.length > 0) {
                        setLoaderWeather(true);
                        setInfoCountry(countryInfo);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchWeatherData();
    }, []);

    return (
        <React.Fragment>
            <div id="sidebar-left--container">
                <span className="sidebar-left--span">

                    <div className="template-container">
                        <div className="template-wrap">
                            {
                                loaderWeather === true ? (
                                    <React.Fragment>
                                        <div className="info-address">
                                            <h5>{infoCountry[0]?.altSpellings[2]}</h5>
                                            <img src={infoCountry[0]?.flags["png"]} alt="" />
                                            <p>Dân số: <b>{infoCountry[0]?.population.toLocaleString()} người</b></p>
                                        </div>


                                        <h5>NHIỆT ĐỘ HIỆN TẠI</h5>
                                        <div className="current-w">

                                                <div className="address-w">
                                                    <h3 className="address">{weatherCurrent.name}, {weatherCurrent.sys && weatherCurrent.sys.country}</h3>
                                                    <p className="date">Hôm nay: {new Date().toLocaleDateString()}</p>
                                                </div>

                                                <div className="temp-w">
                                                    <h3 className="temp">{weatherCurrent.main && weatherCurrent.main.temp} °C</h3>
                                                    <p className="status">{weatherCurrent.weather && weatherCurrent.weather[0] && weatherCurrent.weather[0].description}</p>
                                                </div>
                                            <div className="icon-w">
                                                {weatherCurrent.weather && weatherCurrent.weather[0] && (
                                                    <img src={`http://openweathermap.org/img/wn/${weatherCurrent.weather[0].icon}@2x.png`} alt="" />
                                                )}
                                            </div>
                                        </div>
                                        <h5>CHẤT LƯỢNG KHÔNG KHÍ</h5>
                                        <div className="air-condidate--w">
                                            <div className="real-feel--w air-condidate--item">
                                                <p className="icon-air"><FaTemperatureLow />Cảm giác</p>
                                                <h3 className="value">{weatherCurrent.main && weatherCurrent.main.feels_like} °C</h3>
                                            </div>

                                            <div className="wind--w air-condidate--item">
                                                <p className="icon-air"><FaWind />Gió</p>
                                                <h3 className="value">{weatherCurrent.wind && weatherCurrent.wind.speed} m/s</h3>
                                            </div>
                                            <div className="cloud--w air-condidate--item">
                                                <p className="icon-air"><IoMdCloudOutline />Mây</p>
                                                <h3 className="value">{weatherCurrent.clouds && weatherCurrent.clouds.all} %</h3>
                                            </div>
                                            <div className="humidity--w air-condidate--item">
                                                <p className="icon-air"><WiHumidity />Độ ẩm</p>
                                                <h3 className="value">{weatherCurrent.main && weatherCurrent.main.humidity} %</h3>
                                            </div>
                                        </div>
                                        <h5>DỰ BÁO NGÀY HÔM NAY</h5>
                                        <div className="forecast-in--day">
                                            <b>Các dự báo tiếp theo</b>
                                            <ul className="list-forecast">
                                                {weatherForecast && weatherForecast?.list?.map((weatherHour, index) => {
                                                    // Extract hour from weatherHour.dt_txt
                                                    const forecastHour = new Date(weatherHour.dt_txt).getHours();
                                                    const forecastDate = new Date(weatherHour.dt_txt).getDate();

                                                    // Get the current hour
                                                    const currentHour = new Date().getHours();
                                                    const currentDate = new Date().getDate();

                                                    // Filter for forecasts starting after the current hour and within the next 6 hours
                                                    if (forecastHour >= currentHour && forecastDate === currentDate) {
                                                        return (
                                                            <li key={index} className="forecast-item">
                                                                <p className="time">{forecastHour}:00</p>
                                                                <div className="icon-w">
                                                                    <img src={`http://openweathermap.org/img/wn/${weatherHour.weather[0].icon}@2x.png`} alt="" />
                                                                </div>
                                                                <h3 className="temp-w">{weatherHour.main.temp} °C</h3>
                                                            </li>
                                                        );
                                                    }
                                                })}
                                            </ul>
                                        </div>
                                        <h5>DỰ BÁO HÀNG TUẦN</h5>
                                        <ul className="list-forecast--weeks">
                                            {weatherForecast &&
                                                weatherForecast?.list?.reduce((acc, weatherWeek, index) => {
                                                    const forecastDate = new Date(weatherWeek.dt_txt).getDate(); // Use getDate() for day of the month
                                                    const forecastMonth = new Date(weatherWeek.dt_txt).getMonth(); // Use getMonth() for month
                                                    const forecastYear = new Date(weatherWeek.dt_txt).getFullYear(); // Use getFullYear() for year

                                                    // Check if the date is already in the accumulator
                                                    if (!acc.some(
                                                        item =>
                                                            item.date === forecastDate &&
                                                            item.month === forecastMonth &&
                                                            item.year === forecastYear
                                                    )) {
                                                        acc.push({
                                                            date: forecastDate,
                                                            month: forecastMonth,
                                                            year: forecastYear,
                                                            weather: weatherWeek,
                                                            index: index
                                                        });
                                                    }

                                                    return acc;
                                                }, []).map((item, index) => {
                                                    const forecastDay = new Date(item.weather.dt_txt).getDay();
                                                    // Always display all days
                                                    return (
                                                        <li key={item.index} className="forecast-week--item">
                                                            <div className="row">
                                                                <h3 className="analyst">{days[forecastDay]}</h3>
                                                                <div className="analyst">
                                                                    <FaTemperatureLow />
                                                                    {item.weather.main.temp} °C
                                                                </div>
                                                                <div className="analyst">
                                                                    <FaWind />
                                                                    {item.weather.wind.speed} m/s
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="analyst">
                                                                    <img src={`http://openweathermap.org/img/wn/${item.weather.weather[0].icon}@2x.png`} alt="" />
                                                                    <b>{item.weather.weather[0].description}</b>
                                                                </div>
                                                                <div className="analyst">
                                                                    <IoRainyOutline />
                                                                    {item.weather.rain ? Object.values(item.weather.rain)[0] : 0} mm/3h
                                                                </div>
                                                                <div className="analyst">
                                                                    <WiHumidity />
                                                                    {item.weather.main.humidity} %
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}

                                        </ul>
                                    </React.Fragment>
                                ) :
                                    (<div className="loading-skeleton">
                                        <ArticleLoader />
                                    </div>)
                            }
                        </div>
                    </div>
                </span>
            </div>
        </React.Fragment >
    );
}

export default SideBarLeft;