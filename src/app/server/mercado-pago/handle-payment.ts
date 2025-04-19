import resend from "@/app/lib/resend";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagePayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata;
  const userEmail = metadata.user_email;
  const userId = metadata.user_id;
  console.log("Pagamento com sucesso", paymentData);

  const { data, error } = await resend.emails.send({
    from: "Acme <guirvilela@gmail.com>",
    to: [userEmail],
    subject: "Payment successful",
    text: "Pagamento realizado com sucesso mercado pago",
  });
}
