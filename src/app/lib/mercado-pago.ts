import crypto from "crypto";
import { MercadoPagoConfig } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export function validateMercadoPago(req: NextRequest) {
  const xSignture = req.headers.get("x-signture") as string;
  const xRequestId = req.headers.get("x-request-id") as string;

  if (!xSignture || !xRequestId) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const signatureParts = xSignture.split(",");
  let ts = "";
  let v1 = "";
  signatureParts.map((part) => {
    const [key, value] = part.split("=");
    if (key.trim() === "ts") {
      ts = value.trim();
    } else if (key.trim() === "v1") {
      v1 = value.trim();
    }
  });

  if (!ts || !v1) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") as string;

  let manifest = "";
  if (dataId) {
    manifest += `id:${dataId}`;
  }
  if (xRequestId) {
    manifest += `x-request-id:${xRequestId}`;
  }

  manifest += `ts:${ts}`;

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET as string;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const generatedHash = hmac.digest("hex");

  if (generatedHash !== "v1") {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
