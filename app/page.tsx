import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function IndexPage() {
  const accept = headers().get("accept-language") ?? "";
  redirect(accept.toLowerCase().includes("ko") ? "/ko" : "/en");
}
