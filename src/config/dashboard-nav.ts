export type DashboardRoute = {
  href: string;
  label: string;
  summary: string;
  owner: "P1" | "P2" | "P3";
  visibility: "all" | "signedIn" | "teacher" | "admin";
};

export const dashboardRoutes: DashboardRoute[] = [
  {
    href: "/dashboard",
    label: "Overview",
    summary: "Main product hub and route entry points.",
    owner: "P3",
    visibility: "all",
  },
  {
    href: "/dashboard/courses",
    label: "Classroom",
    summary: "Lessons, folders, and read-side learning flow.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/community",
    label: "Community",
    summary: "Shared route shell for feed, post creation, and later comments.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/checkout",
    label: "Join",
    summary: "Membership and enrollment action surface.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/teach",
    label: "Teach",
    summary: "Teacher workspace for courses, lessons, and announcements.",
    owner: "P1",
    visibility: "teacher",
  },
  {
    href: "/dashboard/invitations",
    label: "Invitations",
    summary: "Invitation inbox and join-request tracking.",
    owner: "P1",
    visibility: "signedIn",
  },
  {
    href: "/dashboard/progress",
    label: "Progress",
    summary: "Learner progress, evaluations, and teacher visibility.",
    owner: "P1",
    visibility: "signedIn",
  },
  {
    href: "/dashboard/account",
    label: "Account",
    summary: "Profile, role details, and account actions.",
    owner: "P3",
    visibility: "signedIn",
  },
  {
    href: "/dashboard/admin",
    label: "Admin Panel",
    summary: "Role-protected integration surface for course management.",
    owner: "P3",
    visibility: "admin",
  },
  {
    href: "/dashboard/deploy",
    label: "Deploy + Git",
    summary: "Review rules, merge gate, and deployment checklist.",
    owner: "P3",
    visibility: "all",
  },
];

export function getDashboardRoutes(role: string, signedIn = false) {
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER" || role === "ADMIN";

  return dashboardRoutes.filter((route) => {
    if (route.visibility === "signedIn" && !signedIn) {
      return false;
    }

    if (route.visibility === "teacher" && !isTeacher) {
      return false;
    }

    if (route.visibility === "admin" && !isAdmin) {
      return false;
    }

    return true;
  });
}
