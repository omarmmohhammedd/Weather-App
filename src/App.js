import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Aos from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import sun from "./assest/full-moon.png";
import cloud from "./assest/clouds.png";
import rain from "./assest/light-rain.png";
import "./App.css";
import humidity from "./assest/humidity.png";
import pressure from "./assest/pressure.png";
import vision from "./assest/vision.png";
import wind from "./assest/wind.png";

const App = () => {
  const [mood, setMood] = useState({});
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState();
  const [data, SetData] = useState({});
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${
    location && location
  }&units=imperial&appid=3b5feb9864a13d6cded76d16f879839b`;
  useEffect(() => {
    Aos.init();
    GetWeatherData();
    theme();
  }, [data]);
  const GetWeatherData = () => {
    if (location) {
      setError("");
      axios
        .get(url)
        .then((res) => {
          if (res) {
            SetData(res.data);
          }
        })
        .catch((e) => {
          setError(e);
        });
    }
  };
  const theme = () => {
    if (data.list) {
      if (data.list[0].weather) {
        if (data.list[0].weather[0].main === "Clouds") {
          setMood({
            theme: "#383d46",
            val: "Cloudy",
            min_color: "#50535e",
            max_color: "#fecc6d",
            img: `${cloud}`,
          });
        }
        if (data.list[0].weather[0].main === "Rain") {
          setMood({
            theme: "#1d2f52",
            val: "Rain",
            min_color: "#50535e",
            max_color: "#fecc6d",
            img: `${rain}`,
          });
        }
        if (data.list[0].weather[0].main === "Clear") {
          setMood({
            theme: "#5b8ce9",
            val: "Clear",
            min_color: "#50535e",
            max_color: "#fecc6d",
            img: `${sun}`,
          });
        }
      }
    }
  };
  const [active, setActive] = useState({ one: true, two: false, three: false });
  const dailyTemp = (i) => {
    const date = new Date();
    date.setHours(date.getHours() + i);
    const time = date.toLocaleTimeString("en-US");
    return date.getHours() + " " + time.slice(-2);
  };
  const weeklyTemp = (i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.getDay();
  };
  return (
    <div className='Container'>
      <div
        className='Warpper'
        style={{ backgroundColor: mood.theme }}
        data-aos='fade-down'>
        <div className='Input_con' data-aos='fade-up'>
          <input
            type='text'
            onChange={(e) =>
              setLocation(e.target.value ? e.target.value : location)
            }
            id='in_Location'
            placeholder='Location...'
          />
          <FontAwesomeIcon
            icon={faArrowRight}
            onClick={() => {
              GetWeatherData();
              theme();
              setSearch(location);
            }}
          />

          {error && error.response && error.response.status === 404 ? (
            <span className='error'>* Enter Valid City *</span>
          ) : null}
        </div>
        {search && data.list && data.list[0].main && (
          <div className='Wrapper-Data'>
            <div className='city-info' data-aos='fade-right'>
              {" "}
              <span className='city-name'>
                {" "}
                {data.city && data.city.name + ","}{" "}
                {data.city && data.city.country}
              </span>
              <div className='time-zone'>
                <span>
                  <span>{days[date.getDay()]}</span>
                  <span> {date.getDate()}</span>
                  <span>{months[date.getMonth()]}</span>
                  <span>{date.getFullYear()}</span>
                </span>
              </div>
              <div>
                {data.list && data.list[0].weather && (
                  <div className='weather-state'>
                    <img src={mood.img} title='sky ' alt='sky ' />

                    <span>{mood.val}</span>
                  </div>
                )}
              </div>
            </div>

            {data.list && (
              <div className='temp' data-aos='fade-left'>
                <span className='current-temp'>
                  {((data.list[0].main.temp - 32) * 0.5556).toFixed()}{" "}
                  <sup>ْC</sup>
                </span>
              </div>
            )}
          </div>
        )}
        {search && data.list && data.list[0].main && (
          <div className='Choices' data-aos='fade-up'>
            <span
              onClick={() => setActive({ one: true, two: false, three: false })}
              className={active.one ? "active_menu" : ""}>
              Hourly
            </span>
            <span
              onClick={() => setActive({ one: false, two: true, three: false })}
              className={active.two ? "active_menu" : ""}>
              Daily
            </span>
            <span
              onClick={() => setActive({ one: false, two: false, three: true })}
              className={active.three ? "active_menu" : ""}>
              Details
            </span>
          </div>
        )}

        <div
          className='day-weather-info'
          id={active.one ? "active_info" : ""}
          data-aos='fade-up'>
          {search &&
            data.list &&
            data.list.map((e, i) => {
              return (
                <>
                  {i < 5 && (
                    <div className='day-temp'>
                      <div className='time'>
                        {i === 0 ? "Now" : dailyTemp(i + i + i)}
                      </div>
                      <div className='day-temp-img'>
                        <img
                          alt='day state'
                          src={
                            e.weather && e.weather[0].main === "Clouds"
                              ? cloud
                              : e.weather[0].main === "Rain"
                              ? rain
                              : e.weather[0].main === "Clear"
                              ? sun
                              : `http://openweathermap.org/img/w/${e.weather[0].icon}.png`
                          }
                        />
                      </div>
                      <div className='time-temp'>
                        {((e.main.temp - 32) * 0.5556).toFixed() + " "}
                        <sup>ْC</sup>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>
        <div
          className='week-weather-info'
          id={active.two ? "active_info" : ""}
          data-aos='fade-up'>
          {data.list &&
            data.list.map((e, i) => {
              return (
                <>
                  {i % 8 === 0 && (
                    <div className='day-temp' key={i}>
                      {" "}
                      {days[i / 8 + date.getDay()] === days[date.getDay()] ? (
                        <div className='day'>Today</div>
                      ) : (
                        <div className='day'>{days[weeklyTemp(i)]}</div>
                      )}
                      <div className='day-temp-img'>
                        <img
                          alt='day state'
                          src={
                            e.weather && e.weather[0].main === "Clouds"
                              ? cloud
                              : e.weather[0].main === "Rain"
                              ? rain
                              : e.weather[0].main === "Clear"
                              ? sun
                              : null
                          }
                        />
                      </div>
                      <div className='day-t'>
                        {((e.main.temp - 32) * 0.5556).toFixed() + " "}
                        <sup>ْC</sup>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>
        <div
          className='Details'
          id={active.three ? "active_info" : ""}
          data-aos='fade-up'>
          {data.list && (
            <>
              <div className='pressure'>
                <span>Pressure</span>
                <img src={pressure} alt='pressure' />
                <span>{data.list[0].main.pressure + " " + "MM"} </span>
              </div>
              <div className='humidity'>
                <span>Humidity</span>
                <img src={humidity} alt='humidity' />
                <span>{data.list[0].main.humidity + " %"}</span>
              </div>
              <div className='wind-speed'>
                <span>Wind</span>
                <img src={wind} alt='wind' />
                <span>{data.list[0].wind.speed + " " + "KM/H"}</span>
              </div>
              <div className='visibility'>
                <span>Visibility</span>
                <img src={vision} alt='vision' />
                <span>{data.list[0].visibility / 1000 + " KM"}</span>
              </div>
              <div className='clouds'>
                <span>Clouds</span>
                <img src={cloud} alt='cloud' />
                <span>{data.list[0].clouds.all + " " + "%"}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
