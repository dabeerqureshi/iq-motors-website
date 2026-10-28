import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await login(email.trim(), password);

    if (result.error) {
      setError(result.error);
      // Re-enable the button so the user can retry
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" aria-hidden />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            Sign in to manage your dealership dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@iqmotorslimited.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
                disabled={isLoading}
                aria-invalid={Boolean(error)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading}
                aria-invalid={Boolean(error)}
              />
            </div>

            {error && (
              <p id="admin-login-error" role="alert" className="text-red-600 text-sm">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login to Admin Panel"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            <Link to="/" className="underline hover:text-cardealer-primary">
              Back to the website
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
