import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Loader2 } from "lucide-react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`);
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weathercode
          });
        } catch (e) {
          setError(true);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-4 w-4 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="h-4 w-4 text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="h-4 w-4 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4 text-blue-200" />;
    if (code >= 95) return <CloudLightning className="h-4 w-4 text-purple-400" />;
    return <Cloud className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-card border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 bg-card border border-border/50 px-3 py-1.5 rounded-full shadow-sm text-xs text-muted-foreground">
        <Cloud className="h-4 w-4" />
        <span>Weather unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-card border border-border/50 px-3 py-1.5 rounded-full shadow-sm font-medium text-sm">
      {getWeatherIcon(weather.code)}
      <span>{weather.temp}°C</span>
    </div>
  );
}
