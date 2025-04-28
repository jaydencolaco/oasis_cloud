import { NextRequest, NextResponse } from "next/server";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";

const lexClient = new LexRuntimeV2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    let localeId = "en_US"; // Default to English
    if (language === "hindi") { // ✅ Match "hindi" exactly
      localeId = "hi_IN";
    }

    const command = new RecognizeTextCommand({
      botId: process.env.LEX_BOT_ID!,
      botAliasId: process.env.LEX_BOT_ALIAS_ID!,
      localeId: localeId,
      sessionId: "testsession",
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
