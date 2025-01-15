"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
      {user ? <p>Your email: {user.email}</p> : <p>Loading...</p>}
    </div>
  );
}
