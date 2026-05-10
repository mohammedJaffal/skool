"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type AccountSettingsProps = {
  role: string;
  name: string;
  email: string;
  bio: string;
  specialty: string;
  track: string;
};

export function AccountSettings({
  role,
  name: initialName,
  email,
  bio: initialBio,
  specialty: initialSpecialty,
  track: initialTrack,
}: AccountSettingsProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [track, setTrack] = useState(initialTrack);
  const [status, setStatus] = useState("");

  async function saveProfile() {
    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, specialty, track }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not save profile.");
      return;
    }

    setStatus("Profile updated.");
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Delete this account? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/me", { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not delete account.");
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Account
          </p>
          <h1 className="mt-1 text-2xl font-bold">Profile settings</h1>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input
            value={email}
            readOnly
            className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--muted)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Bio</span>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
        </label>

        {role === "TEACHER" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium">Specialty</span>
            <input
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
            />
          </label>
        ) : null}

        {role === "LEARNER" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium">Track</span>
            <input
              value={track}
              onChange={(event) => setTrack(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
            />
          </label>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveProfile}
            className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={deleteAccount}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
          >
            Delete account
          </button>
        </div>

        {status ? (
          <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
            {status}
          </div>
        ) : null}
      </div>

      <aside className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Role
          </p>
          <h2 className="mt-1 text-xl font-semibold">{role}</h2>
        </div>
        <p className="text-sm leading-6 text-[color:var(--muted)]">
          Account actions here map directly to the authenticated database user.
          This page is the base for future profile editing and ownership-safe
          account removal.
        </p>
      </aside>
    </section>
  );
}
