import { MiniKit } from "@worldcoin/minikit-js"
import Layout from "../components/layout"
import { useEffect, useState } from "react"

export default function IndexPage() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled())
  }, [])

  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://next-auth.js.org">NextAuth.js</a> with {" "}
        <a href ="https://worldcoin.org/world-id">World ID</a> for authentication.
      </p>
      MINIKIT: { isInstalled ? "YES" : "NO"}
    </Layout>
  )
}
