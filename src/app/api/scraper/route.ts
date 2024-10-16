import { NextResponse } from "next/server"
import { getScrapedRecipe, getErrorMessage } from "@/lib/functions"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 })
    }

    const data = await getScrapedRecipe(url)

    if ("message" in data) {
      return NextResponse.json(data, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return NextResponse.json({ message: errorMessage }, { status: 400 })
  }
}
