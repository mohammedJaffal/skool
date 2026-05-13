import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AccountSettings } from "@/components/account/account-settings";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <AccountSettings
      role={user.role}
      name={user.name ?? ""}
      email={user.email ?? ""}
      birthDate={user.birthDate?.toISOString().slice(0, 10) ?? ""}
      bio={user.userProfile?.bio ?? ""}
      specialty={user.userProfile?.specialty ?? ""}
      track={user.userProfile?.track ?? ""}
    />
  );
}
