import { useState } from "react";
import ButtonWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import { authAPI } from "../utils/api";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation (matching backend requirements)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        password,
      });

      if (!response.token) {
        setError("Authentication failed: Token not received");
        return;
      }

      setToken(response.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Signup failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-ring opacity-5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex flex-col justify-center w-full max-w-md relative z-10 animate-fade-in">
        <div className="clay-card rounded-2xl w-full text-center p-8 space-y-6 backdrop-blur-xl">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
          </div>

          <div className="space-y-2">
            <Heading label="Create Account" />
            <SubHeading label="Enter your information to create an account" />
          </div>

          {error && (
            <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-slide-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <InputBox
                label="First Name"
                placeholder="John"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError("");
                }}
                value={firstName}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InputBox
                label="Last Name"
                placeholder="Doe"
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError("");
                }}
                value={lastName}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InputBox
                label="Email"
                placeholder="john.doe@example.com"
                type="email"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                value={username}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <InputBox
                label="Password"
                placeholder="Enter password (min 8 chars, 1 uppercase)"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                value={password}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              label={loading ? "Creating Account..." : "Sign Up"}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>

          <ButtonWarning
            label="Already have an account?"
            buttonText="Sign In"
            to="/signin"
          />
        </div>
      </div>
    </div>
  );
}
