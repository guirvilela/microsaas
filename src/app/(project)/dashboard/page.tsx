import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Microsaas Dashboard",
  description: "Dashboard",
};

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1>Dashboard</h1>

      {session?.user?.email && (
        <form action={handleAuth}>
          <button
            type="submit"
            className="border rounded-md px-2 cursor-pointer"
          >
            Logout
          </button>
        </form>
      )}

      <Link href="/pagamentos">Pagamentos</Link>
    </div>
  );
}
