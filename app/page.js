"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome Home!</h1>
      {user ? <p>Your email: {user.email}</p> : <p>Loading...</p>}
    </div>
  );
}
