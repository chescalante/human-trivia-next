import Layout from "../components/layout"

export default function ApiExamplePage() {
  return (
    <Layout>
      <h1>API Example</h1>
      <p>The examples below show responses from the example API endpoints.</p>
      <p>
        <em>You must be signed in to see responses.</em>
      </p>
      <h2>Game.get</h2>
      <p>/api/game/get</p>
      <iframe src="/api/game/get" />
      <h2>Session</h2>
      <p>/api/trivia/get</p>
      <iframe src="/api/trivia/get" />
      <p>/api/question/get</p>
      <iframe src="/api/question/get" />
    </Layout>
  )
}
