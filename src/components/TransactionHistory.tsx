import { useEffect, useState } from "react";
import { accountAPI, Transaction } from "../utils/api";

interface TransactionHistoryProps {
  refreshTrigger?: number;
}

export default function TransactionHistory({ refreshTrigger }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    fetchTransactions();
  }, [page, filter, refreshTrigger]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await accountAPI.getTransactions(
        page,
        10,
        filter === "all" ? undefined : filter
      );
      setTransactions(response.transactions);
      setTotalPages(response.pagination.pages);
    } catch (err: unknown) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="clay-card rounded-2xl p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl text-foreground flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Transaction History
        </div>
        <div className="flex gap-2">
          {(["all", "sent", "received"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === type
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-accent/20 text-foreground hover:bg-accent/30"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2">Loading transactions...</p>
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No transactions found</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <>
          <div className="space-y-3">
            {transactions.map((transaction, index) => {
              const isSent = transaction.type === "sent";
              const otherUser = isSent ? transaction.toUser : transaction.fromUser;
              const otherUserName = `${otherUser.firstName} ${otherUser.lastName}`;

              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-accent/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg clay-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`rounded-xl h-12 w-12 flex items-center justify-center shadow-md ${
                        isSent
                          ? "bg-gradient-to-br from-destructive/20 to-destructive/30"
                          : "bg-gradient-to-br from-primary/20 to-accent/30"
                      }`}
                    >
                      {isSent ? (
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {isSent ? "Sent to" : "Received from"} {otherUserName}
                      </div>
                      <div className="text-sm text-muted-foreground">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(transaction.timestamp)}</div>
                    </div>
                    <div className={`text-lg font-bold ${isSent ? "text-destructive" : "text-primary"}`}>
                      {isSent ? "-" : "+"}₹{formatAmount(transaction.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-accent/20 text-foreground hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-accent/20 text-foreground hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
