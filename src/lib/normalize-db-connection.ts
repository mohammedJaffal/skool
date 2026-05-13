const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseUrl(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");
    const useLibpqCompat = url.searchParams.get("uselibpqcompat");

    if (
      sslmode &&
      LEGACY_SSL_MODES.has(sslmode) &&
      useLibpqCompat !== "true"
    ) {
      // Preserve current strict verification behavior ahead of pg v9.
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}
