import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";
import Header from "./header";

function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider>
      <div className="max-w-lg m-auto" style={{ height: "90vh" }}>{children}</div>
    </MiniKitProvider>
  );
}
