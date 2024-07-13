import React from 'react';
import { useState, useEffect } from 'react';
import find from '../assets/find.svg';
import snowIcon from '../assets/snowIcon.jpeg';
import clearIcon from '../assets/clearIcon.png';
import cloudIcon from '../assets/cloudIcon.png';
import drizzleIcon from '../assets/drizzleIcon.png';
import rainIcon from '../assets/rainIcon.png';
import img1 from '../assets/img1.png';
import img4 from '../assets/img4.jpeg';
import weather from '../assets/weather.jpg';
import PropTypes from "prop-types";


const WeatherDeatails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="details">
        <div className="temp">{temp}°c</div>
        <div className="location">{city}</div>
        <div className="country">{country}</div>
        <div className="cord">
          <div>
            <span className="lat">
              latitude
            </span>
            <span>{lat}</span>
          </div>
          <div>
            <span className="log">
              longitude
            </span>
            <span>{log}</span>
          </div>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={img1} alt="" className='icon' />
          <div className="data">
            <div className="humidity-percent">
              {humidity}%
            </div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={img4} alt="" className='icon' />
          <div className="data">
            <div className="wind-percent">
              {wind} km/h
            </div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
};

WeatherDeatails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired
}


export default function Weather() {
  const [icon, setIcon] = useState(weather);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let api_key = "ea5c76ea4d256480b79f4b7c752a803c";
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(URL);
      let data = await res.json();
      // console.log(data);
      if (data.cod === "404") {
        // console.error("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred :", error.message);
      setError("An error while fetching weather data");
    } finally {

    }
    setLoading(false);
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, [])


  return (
    <div>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className='cityInput'
            placeholder='search city'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown} />
          <div className="search-icon">
            <img src={find} alt="search" onClick={() => search()} />
          </div>
        </div>

        {loading && <div className="loading-msg">
          Loading...
        </div>}
        {!error && <div className="error-msg">
          {error}
        </div>}
        {cityNotFound && <div className="city-not-found">
          City Not Found
        </div>}

        {!loading && !cityNotFound &&
          <WeatherDeatails icon={icon} temp={temp} city={city}
            country={country} lat={lat} log={log} humidity={humidity}
            wind={wind} />
        }

        <p className='copyright'>
          Designed by <span>MG</span>
        </p>
      </div>
    </div>
  )
}
