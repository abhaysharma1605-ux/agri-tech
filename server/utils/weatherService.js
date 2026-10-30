const axios = require('axios');
const WeatherData = require('../models/WeatherData');

const CACHE_MINUTES = 30;

// Fetch forecast from Open-Meteo (free, no API key)
async function fetchFromProvider(lat, lon) {
  const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: 7,
    },
    timeout: 10000,
  });

  const d = data.daily;
  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
    },
    daily: d.time.map((date, i) => ({
      date,
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      rainMm: d.precipitation_sum[i],
      rainProbability: d.precipitation_probability_max[i],
      windMax: d.wind_speed_10m_max[i],
      weatherCode: d.weather_code[i],
    })),
  };
}

// Returns cached forecast for the farm if fresh, otherwise refreshes it
async function getWeatherForFarm(farm) {
  const cutoff = new Date(Date.now() - CACHE_MINUTES * 60 * 1000);
  const cached = await WeatherData.findOne({ farm: farm._id, fetchedAt: { $gte: cutoff } }).sort('-fetchedAt');
  if (cached) return cached;

  const fresh = await fetchFromProvider(farm.location.latitude, farm.location.longitude);
  return WeatherData.create({ farm: farm._id, ...fresh });
}

// Turn a forecast into actionable farm advisories
function buildAdvisories(weather) {
  const out = [];
  const { current, daily } = weather;
  const rainSoon = daily.slice(0, 3).reduce((s, d) => s + (d.rainMm || 0), 0);

  if (rainSoon >= 30) out.push({ level: 'warning', key: 'heavyRain', message: 'Heavy rain expected in the next 3 days. Delay irrigation and fertilizer application; check drainage.' });
  else if (rainSoon >= 5) out.push({ level: 'info', key: 'rainExpected', message: 'Rain expected soon. You can skip irrigation and delay spraying.' });
  if (daily.some((d) => d.tempMax >= 40)) out.push({ level: 'warning', key: 'heatwave', message: 'Heatwave risk: irrigate in early morning or evening and consider mulching.' });
  if (daily.some((d) => d.tempMin <= 4)) out.push({ level: 'warning', key: 'frost', message: 'Frost risk: protect sensitive crops with covers or light irrigation at night.' });
  if (daily.slice(0, 3).some((d) => d.windMax >= 40)) out.push({ level: 'warning', key: 'wind', message: 'Strong winds expected. Avoid pesticide spraying and stake tall crops.' });
  if (current.humidity >= 85 && current.temperature >= 20 && current.temperature <= 30) out.push({ level: 'info', key: 'fungal', message: 'High humidity and warm temperature favour fungal diseases. Inspect crops for blight and mildew.' });
  if (!out.length) out.push({ level: 'success', key: 'ok', message: 'Weather conditions look favourable for normal farm operations.' });
  return out;
}

module.exports = { getWeatherForFarm, buildAdvisories };
