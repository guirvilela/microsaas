import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-stripe-cancel-subscription";
import { handleStripePayment } from "@/app/server/stripe/handle-stripe-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-stripe-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const headerList = await headers();

    const signature = headerList.get("stripe-signature");

    if (!signature || !secret) {
      return NextResponse.json({ error: "Unathorized" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }
        break;
      case "checkout.session.expired":
        console.log(
          "Enviar um email para o usuário avisando que o pagamamento expirou"
        );
        break;
      case "checkout.session.async_payment_succeeded":
        console.log(
          "Enviar um email para o usuário avisando que o pagamamento foi realizado"
        );

        break;
      case "checkout.session.async_payment_failed":
        console.log(
          "Enviar um email para o usuário avisando que o pagamamento falhou"
        );

        break;
      case "customer.subscription.created":
        console.log("Mensagem de boas vindas");

        break;
      case "customer.subscription.updated":
        console.log("Enviar um email para troca de plano");

        break;
      case "customer.subscription.deleted":
        await handleStripeCancelSubscription(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type} `);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
