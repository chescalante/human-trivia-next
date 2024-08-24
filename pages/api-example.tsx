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
      <p>/api/examples/session</p>
      <iframe src="/api/game/get" />
      <h2>Game.finish</h2>
      <p>/api/examples/session</p>
      <iframe src="/api/game/finish" />
      <h2>Game.start</h2>
      <p>/api/examples/session</p>
      <iframe src="/api/game/start" />
      <h2>Session</h2>
      <p>/api/trivia/get</p>
      <iframe src="/api/trivia/get" />
      <h2>Session</h2>
      <p>/api/trivia/join</p>
      <iframe src="/api/trivia/join" />
      <h2>Session</h2>
      <p>/api/question/answer</p>
      <iframe src="/api/question/answer" />
      <p>/api/question/get</p>
      <iframe src="/api/question/get" />
    </Layout>
  )
}
