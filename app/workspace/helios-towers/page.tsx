import { redirect } from "next/navigation";

/** Legacy path; canonical gate is /research/helios-towers */
export default function HeliosTowersWorkspaceLegacyRedirect() {
  redirect("/research/helios-towers");
}
