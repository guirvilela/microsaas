import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Microsaas",
  description: "Landing Page",
};

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1>hello world</h1>

      <Link href="/login">Login</Link>
    </div>
  );
}
