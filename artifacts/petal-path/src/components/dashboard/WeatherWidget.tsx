import { useEffect, useState } from "react";

type WeatherData = { temp: number; code: number };

const getTimeIcon = (hour: number) => {
  if (hour >= 5 && hour < 9) return "🌅";
  if (hour >= 9 && hour < 17) return "☀️";
  if (hour >= 17 && hour < 20) return "🌇";
  if (hour >= 20 && hour < 22) return "🌆";
  return "🌙";
};

const getWeatherEmoji = (code: number) => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
};

export default function WeatherWidget() {
  const hour = new Date().getHours();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const timer = setTimeout(() => {}, 0);
    let cancelled = false;

    const timeout = setTimeout(() => { cancelled = true; }, 4000);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        clearTimeout(timeout);
        if (cancelled) return;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weathercode`
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!cancelled) {
            setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weathercode });
          }
        } catch {
          // silent — fall back to time icon
        }
      },
      () => clearTimeout(timeout),
      { timeout: 4000, maximumAge: 600000 }
    );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(timer);
    };
  }, []);

  if (weather) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-card border border-border/40 px-3 py-1 rounded-full shadow-sm text-foreground/80">
        <span>{getWeatherEmoji(weather.code)}</span>
        <span>{weather.temp}°</span>
      </span>
    );
  }

  return (
    <span className="text-3xl md:text-4xl opacity-70 select-none" title="Today's vibe">
      {getTimeIcon(hour)}
    </span>
  );
}
