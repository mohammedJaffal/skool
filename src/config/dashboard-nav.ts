export type DashboardRoute = {
  href: string;
  label: string;
  summary: string;
  owner: "P1" | "P2" | "P3";
  visibility: "all" | "admin";
};

export const dashboardRoutes: DashboardRoute[] = [
  {
    href: "/dashboard",
    label: "Overview",
    summary: "Current foundation status and integration entry points.",
    owner: "P3",
    visibility: "all",
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
    summary: "Shared route shell for course list, detail, and lesson work.",
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
    label: "Checkout",
    summary: "Foundation route for the simplified enroll flow.",
    owner: "P1",
    visibility: "all",
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

export function getDashboardRoutes(role: string) {
  const isAdmin = role === "ADMIN";

  return dashboardRoutes.filter((route) => {
    if (route.visibility === "admin" && !isAdmin) {
      return false;
    }

    return true;
  });
}
