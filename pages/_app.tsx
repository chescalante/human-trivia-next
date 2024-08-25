import { SessionProvider } from "next-auth/react"
import "./styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import { MiniKit } from "@worldcoin/minikit-js/build";
import { ReactNode, useEffect } from "react";

function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <MiniKitProvider>
        <Component {...pageProps} />
      </MiniKitProvider>
    </SessionProvider>
  )
}
