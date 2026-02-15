import { useEffect, useState } from "react";
import { authAPI, accountAPI, UserProfile as UserProfileType, TransactionStats } from "../utils/api";

interface UserProfileProps {
  refreshTrigger?: number;
}

export default function UserProfile({ refreshTrigger }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [refreshTrigger]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.getProfile();
      setProfile(response.user);
    } catch (err: unknown) {
      setError("Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await accountAPI.getStats();
      setStats(response);
    } catch (err: unknown) {
      console.error("Error fetching stats:", err);
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="clay-card rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="clay-card rounded-2xl p-8">
        <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-xl text-sm">
          {error || "Failed to load profile"}
        </div>
      </div>
    );
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="clay-card rounded-2xl p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl h-20 w-20 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
          <div className="text-3xl font-bold text-primary-foreground">{initials}</div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-foreground">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{profile.username}</div>
          <div className="text-lg font-semibold text-primary mt-2">
            ₹ {formatAmount(profile.balance)}
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="p-4 bg-accent/10 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Total Sent</div>
            <div className="text-xl font-bold text-destructive">₹ {formatAmount(stats.totalSent)}</div>
          </div>
          <div className="p-4 bg-accent/10 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Total Received</div>
            <div className="text-xl font-bold text-primary">₹ {formatAmount(stats.totalReceived)}</div>
          </div>
          <div className="p-4 bg-accent/10 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Transactions</div>
            <div className="text-xl font-bold text-foreground">{stats.transactionCount}</div>
          </div>
          <div className="p-4 bg-accent/10 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Last 30 Days</div>
            <div className="text-xl font-bold text-foreground">{stats.recentCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}
