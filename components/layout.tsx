import Header from "./header";
import Footer from "./footer";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen max-h-screen max-w-lg m-auto">
      {children}
    </div>
  );
}
