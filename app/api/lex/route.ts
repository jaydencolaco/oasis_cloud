// app/api/lex/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";

const lexClient = new LexRuntimeV2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN, // Optional, if you use temp credentials
  },
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    const command = new RecognizeTextCommand({
      botId: process.env.LEX_BOT_ID!,
      botAliasId: process.env.LEX_BOT_ALIAS_ID!,
      localeId: process.env.LEX_LOCALE_ID!, // Example: "en_US"
      sessionId: "testsession", // You can make this dynamic for multi-user sessions
      text: text,
    });

    const response = await lexClient.send(command);

    const botReply = response.messages?.[0]?.content ?? "No reply";

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Error communicating with Lex:", error);
    return NextResponse.json({ error: "Failed to get response from Lex" }, { status: 500 });
  }
}
