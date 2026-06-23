import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if ((session.user as any)?.role === "ADMIN") redirect("/admin");
  redirect("/dashboard");
}