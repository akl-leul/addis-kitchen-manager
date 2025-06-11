import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const DEMO_EMAIL = "admin@restaurant.com";
const DEMO_PASSWORD = "admin123";

const AdminLogin = () => {
  const { user, signIn: originalSignIn, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLogging, setIsLogging] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);

  // Custom signIn to allow demo credentials
  const signIn = async (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setDemoUser({ email });
      return { error: null, user: { email } };
    }
    return await originalSignIn(email, password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const { error } = await signIn(credentials.email, credentials.password);
      if (error) {
        toast.error("Login failed: " + error.message);
      } else {
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLogging(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated (real or demo)
  if (user || demoUser) {
    return <Navigate to="/admindashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <p className="text-gray-600">Access the restaurant management panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isLogging}
              >
                {isLogging ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Demo Credentials:</p>
              <p className="text-sm font-mono">Email: {DEMO_EMAIL}</p>
              <p className="text-sm font-mono">Password: {DEMO_PASSWORD}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;