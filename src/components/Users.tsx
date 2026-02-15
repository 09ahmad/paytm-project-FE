import { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { userAPI, User } from "../utils/api";

interface UsersProps {
  onTransferSuccess?: () => void;
}

export default function Users({}: UsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(getData);
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userAPI.getBulkUsers(filter);
      setUsers(response.user || []);
    } catch (err: unknown) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clay-card rounded-2xl p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl text-foreground flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Users
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search users by name..."
          className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          value={filter}
        />
      </div>

      {error && (
        <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-lg text-sm animate-slide-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      )}

      {!loading && users.length === 0 && filter && (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No users found matching "{filter}"</p>
        </div>
      )}

      {!loading && users.length === 0 && !filter && (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Start typing to search for users</p>
        </div>
      )}

      <div className="space-y-3">
        {users.map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface UserCardProps {
  user: User;
  index: number;
}

function UserCard({ user, index }: UserCardProps) {
  const navigate = useNavigate();
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div 
      className="flex justify-between items-center p-4 border border-border rounded-xl hover:bg-accent/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fade-in clay-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-4">
        <div className="rounded-xl h-14 w-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md transition-transform hover:scale-110">
          <div className="flex flex-col justify-center h-full text-primary-foreground font-semibold text-lg">
            {initials}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-foreground text-lg">{fullName}</div>
          <div className="text-sm text-muted-foreground">{user.username}</div>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          label="Send Money"
          onClick={() => {
            navigate(
              `/send?id=${user._id}&name=${encodeURIComponent(fullName)}`
            );
          }}
        />
      </div>
    </div>
  );
}
