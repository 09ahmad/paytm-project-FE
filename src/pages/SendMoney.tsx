import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { accountAPI } from "../utils/api";
import Appbar from "../components/Appbar";

interface TransferSuccessData {
  fromBalance: number;
  toBalance: number;
  amount: number;
  receiver: {
    name: string;
    username: string;
  };
}

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<TransferSuccessData | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  useEffect(() => {
    if (!id || !name) {
      navigate("/dashboard");
      return;
    }
    fetchBalance();
  }, [id, name, navigate]);

  const fetchBalance = async () => {
    try {
      const response = await accountAPI.getBalance();
      setBalance(response.balance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const handleTransfer = async () => {
    setError("");
    setSuccess(false);
    setSuccessData(null);

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const transferAmount = parseFloat(amount);
    
    if (transferAmount < 0.01) {
      setError("Minimum transfer amount is ₹0.01");
      return;
    }

    if (transferAmount > balance) {
      setError("Insufficient balance");
      return;
    }

    if (!id) {
      setError("Invalid recipient");
      return;
    }

    setLoading(true);
    try {
      const response = await accountAPI.transfer({
        to: id,
        amount: transferAmount,
        description: description.trim() || undefined,
      });

      // Update balance with the response data
      if (response.data) {
        setSuccessData(response.data);
        setBalance(response.data.fromBalance);
      }

      setSuccess(true);
      
      // Refresh balance after a delay
      setTimeout(async () => {
        await fetchBalance();
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }, 3000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { 
            status?: number; 
            data?: { 
              message?: string;
              error?: string;
            } 
          };
        };
        
        const status = axiosError.response?.status;
        const errorMessage = axiosError.response?.data?.message || 
                           axiosError.response?.data?.error ||
                           "Transaction failed. Please try again.";

        if (status === 400) {
          setError(errorMessage);
        } else if (status === 401) {
          setError("Unauthorized. Please sign in again.");
          setTimeout(() => navigate("/signin"), 2000);
        } else if (status === 404) {
          setError(errorMessage || "Receiver not found. Please check the recipient.");
        } else if (status === 407 || status === 400) {
          setError(errorMessage);
        } else {
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!id || !name) {
    return null;
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatAmount = (amt: number): string => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amt);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <Appbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="clay-card rounded-2xl p-8 space-y-6 backdrop-blur-xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2 gradient-text">
                Send Money
              </h2>
              <p className="text-muted-foreground">Transfer funds securely</p>
            </div>

            {success && successData && (
              <div className="bg-primary/20 border border-primary/50 rounded-xl p-6 space-y-4 animate-slide-in">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary p-2">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-primary-foreground">Transaction Successful!</div>
                    <div className="text-sm text-primary-foreground/80">Money transferred successfully</div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-foreground/80">Amount Sent:</span>
                    <span className="font-bold text-primary-foreground">₹{formatAmount(successData.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-foreground/80">To:</span>
                    <span className="font-semibold text-primary-foreground">{successData.receiver.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-foreground/80">Your New Balance:</span>
                    <span className="font-bold text-primary-foreground">₹{formatAmount(successData.fromBalance)}</span>
                  </div>
                </div>
                
                <div className="text-xs text-primary-foreground/70 pt-2">
                  Redirecting to dashboard...
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-xl text-sm animate-slide-in flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">{error}</div>
              </div>
            )}

            {!success && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                  <div className="rounded-xl h-16 w-16 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
                    <span className="text-2xl text-primary-foreground font-semibold">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Amount (₹)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={balance}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-lg"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    disabled={loading || success}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Available balance: ₹{formatAmount(balance)}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Description (Optional)
                  </label>
                  <input
                    id="description"
                    type="text"
                    placeholder="Add a note for this transaction"
                    className="w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setError("");
                    }}
                    disabled={loading || success}
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/100 characters
                  </p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={loading || success}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-primary-foreground transition-all duration-200 ${
                    loading || success
                      ? "bg-muted cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-4 focus:ring-ring/50 active:scale-95 shadow-lg glow-primary"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Transfer...
                    </span>
                  ) : (
                    "Initiate Transfer"
                  )}
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-2 px-4 rounded-xl font-medium text-foreground hover:bg-accent/20 transition-colors border border-border"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
