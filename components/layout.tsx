import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider>
      <div className="h-screen max-h-screen max-w-lg m-auto">{children}</div>
    </MiniKitProvider>
  );
}
