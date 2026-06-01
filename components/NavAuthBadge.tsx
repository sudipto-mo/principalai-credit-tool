import { getVerifiedSessionPayload } from "@/lib/get-session";
import LogoutButton from "@/components/LogoutButton";
import UserSessionAvatar from "@/components/UserSessionAvatar";

export default async function NavAuthBadge() {
  const user = await getVerifiedSessionPayload();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <UserSessionAvatar name={user.name} email={user.email} />
      <LogoutButton />
    </div>
  );
}
