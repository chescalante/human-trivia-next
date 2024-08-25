// This is an example of to protect an API route
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    const uuid = crypto.randomUUID().replace(/-/g, "");

    // payment request stored in the db

    return res.send({
        id: uuid
    })
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  })
}
