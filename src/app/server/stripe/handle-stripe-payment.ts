import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import Stripe from "stripe";

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === "paid") {
    const metadata = event.data.object.metadata;
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email;
    const userId = metadata?.userId;

    if (!userId || !userEmail) {
      console.log("User not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeCustomerId: event.data.object.customer,
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    });

    const { data, error } = await resend.emails.send({
      from: "Acme <guirvilela@gmail.com>",
      to: [userEmail],
      subject: "Payment successful",
      text: "Pagamento realizado com sucesso",
    });
  }
}
