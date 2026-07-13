import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

// Custom JWT Decoder to avoid external dependencies
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
}

// Generate random floating petal properties
const PETALS = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100, // percentage starting width
  y: -20,
  size: Math.random() * 12 + 8, // size in px
  delay: Math.random() * 10,
  duration: Math.random() * 15 + 10,
  rotate: Math.random() * 360,
}));

export default function Login({ onLoginSuccess }: LoginProps) {
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Poll for Google script initialization
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        setGoogleAvailable(true);
        clearInterval(checkGoogle);
      }
    }, 200);

    return () => clearInterval(checkGoogle);
  }, []);

  // Initialize and render Google button when available
  useEffect(() => {
    if (googleAvailable && clientId) {
      try {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            const payload = decodeJwt(response.credential);
            if (payload) {
              const user: UserProfile = {
                id: payload.sub,
                name: payload.name || payload.given_name || "Petal User",
                email: payload.email,
                picture: payload.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              };
              onLoginSuccess(user);
            }
          },
        });

        const btnElement = document.getElementById("google-signin-btn");
        if (btnElement) {
          // @ts-ignore
          window.google.accounts.id.renderButton(btnElement, {
            theme: "outline",
            size: "large",
            shape: "pill",
            width: 250,
          });
        }
      } catch (err) {
        console.error("Google Sign-In initialization error:", err);
      }
    }
  }, [googleAvailable, clientId, onLoginSuccess]);

  // Demo Login (for local dev without Client ID configured)
  const handleDemoLogin = () => {
    const demoUser: UserProfile = {
      id: "demo-user-123",
      name: "Sakura Bloom",
      email: "sakura@petalpath.example",
      picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", // kawaii girl avatar
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-pink-50 via-rose-50 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-stone-900 overflow-hidden font-sans px-4 py-8">
      {/* Animated Floating Petals background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {PETALS.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ x: `${petal.x}%`, y: -50, rotate: petal.rotate, opacity: 0 }}
            animate={{
              y: "110vh",
              x: [`${petal.x}%`, `${petal.x + (Math.random() * 20 - 10)}%`],
              rotate: [petal.rotate, petal.rotate + 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: "linear",
            }}
            className="absolute rounded-full bg-pink-300/40 dark:bg-pink-500/20 blur-[0.5px]"
            style={{
              width: petal.size,
              height: petal.size * 0.8,
              borderRadius: "50% 10% 50% 50% / 50% 10% 50% 50%", // petal shape
            }}
          />
        ))}
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[420px] z-10"
      >
        <Card className="p-8 rounded-3xl border border-border/40 shadow-2xl bg-card/75 backdrop-blur-md relative overflow-hidden flex flex-col items-center text-center">
          {/* Subtle Sparkle Decorative */}
          <div className="absolute top-4 right-4 text-primary animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>

          {/* Logo / App Name */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center mb-3 shadow-md">
              <span className="text-3xl text-pink-500 animate-bounce">✿</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
              Petal Path
            </h1>
            <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide">
              LUXURY KAWAII PRODUCTIVITY & WELLNESS
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="py-4 px-3 rounded-2xl bg-background/50 border border-border/20 mb-4 text-sm text-foreground/80 leading-relaxed font-medium">
              Welcome back! Step into your cozy oasis. Plan your day, track your wellness, and log your thoughts in comfort.
            </div>

            {/* Auth Buttons Area */}
            <div className="flex flex-col items-center justify-center gap-4 w-full pt-2">
              {clientId ? (
                <>
                  {/* Google Authenticator Widget Target */}
                  <div id="google-signin-btn" className="flex justify-center w-full min-h-[44px]" />
                  <p className="text-[11px] text-muted-foreground">
                    Logs in securely using your Google Account
                  </p>
                </>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  {/* Styled Demo/Mock Auth Button */}
                  <Button
                    onClick={handleDemoLogin}
                    className="w-full py-6 rounded-full bg-linear-to-r from-pink-400 to-rose-500 text-white font-bold shadow-md hover:shadow-lg hover:from-pink-500 hover:to-rose-600 border-none transition-all flex items-center justify-center gap-2 group press-scale cursor-pointer"
                  >
                    <LogIn className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
                    Sign in with Google (Demo Mode)
                  </Button>
                  <p className="text-[11px] text-muted-foreground px-2">
                    Google Sign-In is running in <strong>Demo Mode</strong>. Click above to log in instantly with a mock profile.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Decorative */}
          <div className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground/60 font-semibold uppercase tracking-wider">
            <span>Local First</span>
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
            <span>Cozy Design</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
