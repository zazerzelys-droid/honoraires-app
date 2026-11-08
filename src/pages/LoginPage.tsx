import { useState } from "react";
import { login } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
const iconSrc = "/icon-512.png";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 animate-slide-up">
        <div className="flex flex-col items-center gap-4">
          <img src={iconSrc} alt="Honoraires" width={80} height={80} className="rounded-2xl shadow-lg" />
          <h1 className="text-2xl font-bold font-heading text-foreground">Honoraires Cliniques</h1>
          <p className="text-muted-foreground text-center text-sm">
            Gestionnaire d'honoraires médicaux
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 touch-target text-base"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-destructive text-sm text-center animate-slide-up">
              Mot de passe incorrect
            </p>
          )}
          <Button type="submit" className="w-full touch-target text-base font-semibold">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
