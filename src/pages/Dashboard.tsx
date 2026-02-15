import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import UserProfile from "../components/UserProfile";
import TransactionHistory from "../components/TransactionHistory";
import { accountAPI } from "../utils/api";

export function Dashboard() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  // Refresh data when page becomes visible (e.g., returning from SendMoney)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchBalance();
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await accountAPI.getBalance();
      setBalance(response.balance);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message || "Failed to fetch balance"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-ring opacity-3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <Appbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-xl animate-slide-in">
            {error}
          </div>
        )}

        {/* Hero Section with User Profile and Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-fade-in">
            <Balance value={balance} loading={loading} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <UserProfile refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Users Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Users />
        </div>

        {/* Transaction History */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TransactionHistory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
