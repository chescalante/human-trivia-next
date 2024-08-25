import Header from "./header"
import Footer from "./footer"

import { MiniKit} from "@worldcoin/minikit-js";
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
      <Header />
      <main>{children}</main>
      <Footer />
    </MiniKitProvider>
  )
}
