import { mpClient, validateMercadoPago } from "@/app/lib/mercado-pago";
import { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    validateMercadoPago(req);

    const body = await req.json();

    const { type, data } = body;

    switch (type) {
      case "payment":
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });

        if (
          paymentData.status === "approved" ||
          paymentData.date_approved !== null
        ) {
          await handleMercadoPagoPayment(paymentData);
        }

        break;
      // case 'subscription_preapproval':
      // break;
      default:
        console.log("Unknown webhook type:", type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Mercado Pago Webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  throw new Error("Function not implemented.");
}
