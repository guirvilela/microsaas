import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CreateMercadoPagoCheckoutProps {
  testeId: string;
  userEmail: string;
}
export function useMercadoPago() {
  const router = useRouter();

  React.useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout({
    testeId,
    userEmail,
  }: CreateMercadoPagoCheckoutProps) {
    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testeId,
          userEmail,
        }),
      });

      const data = await response.json();

      router.push(data.initPoint);
    } catch (error) {
      console.error("Error creating Mercado Pago checkout session:", error);
      throw new Error("Failed to create Mercado Pago checkout session");
    }
  }

  return {
    createMercadoPagoCheckout,
  };
}
