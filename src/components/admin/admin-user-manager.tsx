"use client";

import { useCallback, useEffect, useState } from "react";

type UserSummary = {
  id: string;
  name: string | null;
  email: string | null;
  role: "MEMBER" | "OWNER" | "ADMIN";
  birthDate?: string | null;
};

type UserDetail = UserSummary & {
  userProfile?: {
    specialty: string | null;
    track: string | null;
    bio: string | null;
  } | null;
  _count: {
    ownedCommunities: number;
    communityMemberships: number;
    receivedInvitations: number;
  };
};

function identityLabel(user: UserSummary) {
  return user.name ?? user.email ?? user.id;
}

export function AdminUserManager() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("");

  const searchUsers = useCallback(async (nextQuery = query) => {
    setLoadingResults(true);
    setStatus("");

    const response = await fetch(
      `/api/admin/users?query=${encodeURIComponent(nextQuery)}`,
    );
    const payload = (await response.json().catch(() => null)) as
      | { users?: UserSummary[]; error?: string }
      | null;

    if (!response.ok) {
      setUsers([]);
      setStatus(payload?.error ?? "Could not search users.");
      setLoadingResults(false);
      return;
    }

    const nextUsers = payload?.users ?? [];
    setUsers(nextUsers);
    setLoadingResults(false);

    if (!nextUsers.length) {
      setSelectedUser(null);
      setStatus("This user does not exist.");
    }
  }, [query]);

  async function inspectUser(userId: string) {
    setLoadingDetails(true);
    setStatus("");

    const response = await fetch(`/api/admin/users/${userId}`);
    const payload = (await response.json().catch(() => null)) as
      | { user?: UserDetail; error?: string }
      | null;

    if (!response.ok || !payload?.user) {
      setSelectedUser(null);
      setStatus(payload?.error ?? "Could not load this user.");
      setLoadingDetails(false);
      return;
    }

    setSelectedUser(payload.user);
    setLoadingDetails(false);
  }

  async function deleteUser() {
    if (!selectedUser) {
      return;
    }

    if (
      !window.confirm(`Delete ${identityLabel(selectedUser)} from the platform?`)
    ) {
      return;
    }

    setDeleting(true);
    setStatus("");

    const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
      method: "DELETE",
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not delete this user.");
      setDeleting(false);
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== selectedUser.id));
    setStatus("User deleted successfully.");
    setSelectedUser(null);
    setDeleting(false);
  }

  useEffect(() => {
    void searchUsers("");
  }, [searchUsers]);

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Consult User
          </p>
          <h2 className="text-xl font-semibold">Search platform users</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Search by name or email, inspect the user record, then delete if
            needed.
          </p>
        </div>

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void searchUsers();
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="User name or email"
            className="w-full rounded-xl border border-[color:var(--line)] px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-[color:var(--brand)] px-4 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        <div className="space-y-3">
          {loadingResults ? (
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
              Loading users...
            </div>
          ) : null}
          {!loadingResults && users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
              No matching users found.
            </div>
          ) : null}
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => void inspectUser(user.id)}
              className={`w-full rounded-2xl border p-4 text-left ${
                selectedUser?.id === user.id
                  ? "border-[color:var(--foreground)] bg-[color:var(--surface-soft)]"
                  : "border-[color:var(--line)] bg-white"
              }`}
            >
              <p className="font-semibold">{identityLabel(user)}</p>
              <p className="text-sm text-[color:var(--muted)]">{user.email}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                {user.role}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            User Details
          </p>
          <h2 className="text-xl font-semibold">Consult and delete</h2>
        </div>

        {status ? (
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
            {status}
          </div>
        ) : null}

        {loadingDetails ? (
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
            Loading selected user...
          </div>
        ) : null}

        {!loadingDetails && selectedUser ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
              <p className="font-semibold">{identityLabel(selectedUser)}</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {selectedUser.email}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    Role
                  </p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    Birth date
                  </p>
                  <p className="font-medium">
                    {selectedUser.birthDate
                      ? new Date(selectedUser.birthDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    Communities owned
                  </p>
                  <p className="font-medium">{selectedUser._count.ownedCommunities}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    Memberships
                  </p>
                  <p className="font-medium">
                    {selectedUser._count.communityMemberships}
                  </p>
                </div>
              </div>
            </div>

            {selectedUser.userProfile ? (
              <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                <p className="font-semibold">User profile</p>
                {selectedUser.userProfile.specialty ? (
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Specialty: {selectedUser.userProfile.specialty}
                  </p>
                ) : null}
                {selectedUser.userProfile.track ? (
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Track: {selectedUser.userProfile.track}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {selectedUser.userProfile.bio ?? "No bio provided."}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void deleteUser()}
              disabled={deleting}
              className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete user"}
            </button>
          </div>
        ) : null}

        {!loadingDetails && !selectedUser ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
            Select a user to inspect the full record and apply deletion from
            the admin panel.
          </div>
        ) : null}
      </section>
    </div>
  );
}
