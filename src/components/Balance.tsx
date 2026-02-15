interface BalanceProps {
  value: number;
  loading?: boolean;
}

export default function Balance({ value, loading = false }: BalanceProps) {
  const formatBalance = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="clay-card rounded-2xl p-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-muted-foreground">Your Balance</div>
          <div className="font-semibold text-lg text-muted-foreground animate-pulse-slow">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clay-card rounded-2xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-ring/20 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-accent/0 group-hover:via-primary/20 transition-all duration-500"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-foreground">
          <div className="text-sm font-medium opacity-80 mb-2 flex items-center gap-2">
            
            Your Balance
          </div>
          <div className="text-4xl font-bold">₹ {formatBalance(value)}</div>
        </div>
        
      </div>
    </div>
  );
}
