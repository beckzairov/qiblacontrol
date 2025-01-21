import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Simple Monitoring System",
  description: "A web app for monitoring systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bitcoin.ico" />
      </head>
      <body className="min-h-screen flex">
        <AuthProvider>
          <Sidebar />
          <main className="flex-grow p-8 overflow-y-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
