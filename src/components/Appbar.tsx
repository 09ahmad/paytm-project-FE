import { useEffect, useState } from "react";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { authAPI, UserProfile } from "../utils/api";

export default function Appbar() {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setUserInfo(response.user);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/signin");
  };

  const getInitials = (): string => {
    if (userInfo) {
      return (
        (userInfo.firstName[0] || "") + (userInfo.lastName[0] || "")
      ).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border shadow-lg">
      <div className="h-16 flex justify-between items-center px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="font-bold text-xl text-foreground gradient-text">Saf$pay</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
          ) : userInfo ? (
            <>
              <div className="hidden md:flex flex-col items-end animate-fade-in">
                <div className="text-sm font-medium text-foreground">
                  {userInfo.firstName} {userInfo.lastName}
                </div>
                <div className="text-xs text-muted-foreground">Welcome back!</div>
              </div>
              <div className="rounded-xl h-10 w-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md transition-transform hover:scale-105">
                <div className="flex flex-col justify-center h-full text-primary-foreground font-semibold text-sm">
                  {getInitials()}
                </div>
              </div>
            </>
          ) : null}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 hover:scale-105 border border-border"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
