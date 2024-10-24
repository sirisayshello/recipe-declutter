import { redirect } from "next/navigation";

export default function Home() {
  redirect("/welcome");
  // or rename this route to "start", "landing" or similar
}
