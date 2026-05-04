export type Owner = "P1" | "P2" | "P3";
export type Visibility = "all" | "admin";

export type DashboardRoute = {
  href: string;
  label: string;
  summary: string;
  owner: Owner;
  visibility: Visibility;
};

const DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    href: "/dashboard",
    label: "Overview",
    summary: "Foundation status and shared routes overview.",
    owner: "P3",
    visibility: "all",
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
    summary: "Browse the course catalog and manage content.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/community",
    label: "Community",
    summary: "Post feed and social features for members.",
    owner: "P2",
    visibility: "all",
  },
  {
    href: "/dashboard/checkout",
    label: "Checkout",
    summary: "Course enrollment flow and billing demo.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/admin",
    label: "Admin Panel",
    summary: "Role-protected management — ADMIN only.",
    owner: "P3",
    visibility: "admin",
  },
  {
    href: "/dashboard/deploy",
    label: "Deploy + Git",
    summary: "Branch status and deployment pipeline.",
    owner: "P3",
    visibility: "all",
  },
];

export function getDashboardRoutes(role: string): DashboardRoute[] {
  return DASHBOARD_ROUTES.filter(
    (r) => r.visibility === "all" || role === "ADMIN",
  );
}
