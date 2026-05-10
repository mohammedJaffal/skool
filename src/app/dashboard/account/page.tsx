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
      teacherProfile: true,
      learnerProfile: true,
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
      bio={user.teacherProfile?.bio ?? user.learnerProfile?.bio ?? ""}
      specialty={user.teacherProfile?.specialty ?? ""}
      track={user.learnerProfile?.track ?? ""}
    />
  );
}

