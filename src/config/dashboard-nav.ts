export type DashboardRoute = {
  href: string;
  label: string;
  summary: string;
  owner: "P1" | "P2" | "P3";
  visibility: "all" | "signedIn" | "owner" | "admin";
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
    href: "/dashboard/communities",
    label: "Communities",
    summary: "Browse joined communities, classroom resources, and protected member spaces.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/community",
    label: "Community",
    summary: "Shared feed surface for posts, discussion, and community activity.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/checkout",
    label: "Access",
    summary: "Community join and access-management surface.",
    owner: "P1",
    visibility: "all",
  },
  {
    href: "/dashboard/teach",
    label: "Owned Communities",
    summary: "Owner workspace for communities, classroom items, and member access.",
    owner: "P1",
    visibility: "owner",
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
    summary: "Member progress, owner visibility, and classroom completion tracking.",
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
    summary: "Role-protected platform governance surface for users and communities.",
    owner: "P3",
    visibility: "admin",
  },
];

export function getDashboardRoutes(role: string, signedIn = false) {
  const isAdmin = role === "ADMIN";
  const isOwner = role === "OWNER" || role === "ADMIN";

  return dashboardRoutes.filter((route) => {
    if (route.visibility === "signedIn" && !signedIn) {
      return false;
    }

    if (route.visibility === "owner" && !isOwner) {
      return false;
    }

    if (route.visibility === "admin" && !isAdmin) {
      return false;
    }

    return true;
  });
}
