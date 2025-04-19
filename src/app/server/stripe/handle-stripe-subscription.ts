import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import Stripe from "stripe";

export async function handleStripeSubscription(
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
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    });

    const { data, error } = await resend.emails.send({
      from: "Acme <guirvilela@gmail.com>",
      to: [userEmail],
      subject: "Subscription successful",
      text: "Subscription realizada com sucesso",
    });
  }
}
