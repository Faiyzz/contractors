import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Replace this with your actual n8n webhook URL
    const N8N_WEBHOOK_URL = "https://ridgeback.app.n8n.cloud/webhook/contact-contractors";

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to n8n");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("n8n webhook error:", err);
    return new NextResponse("n8n webhook failed", { status: 500 });
  }
}
