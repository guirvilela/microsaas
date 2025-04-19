"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1>Pagamentos</h1>

      <div className="flex flex-col gap-4 mt-4">
        <button
          className="border rounded-md px-1  cursor-pointer"
          onClick={() => createPaymentStripeCheckout({ testeId: "123" })}
        >
          Pagamento Stripe
        </button>
        <button
          className="border rounded-md px-1 cursor-pointer"
          onClick={() => createSubscriptionStripeCheckout({ testeId: "123" })}
        >
          Criar assinatura
        </button>
        <button
          className="border rounded-md px-1 cursor-pointer"
          onClick={() => handleCreateStripePortal()}
        >
          Portal de pagamento
        </button>
      </div>
    </div>
  );
}
