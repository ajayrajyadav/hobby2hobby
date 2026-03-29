"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "./session-provider";

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, profile, signOut } = useSession();

  return (
    <header className="site-header-wrap">
      <div className="site-header shell">
        <div className="brand-lockup">
          <Link href="/" className="brand-mark">
            hobby2hobby
          </Link>
          <p className="brand-note">Local barter, not a pricing game.</p>
        </div>

        <nav className="primary-nav" aria-label="Primary">
          <Link
            href="/explore"
            className={isCurrent(pathname, "/explore") ? "nav-link nav-link-active" : "nav-link"}
          >
            Explore
          </Link>
          <Link
            href="/workspace"
            className={isCurrent(pathname, "/workspace") ? "nav-link nav-link-active" : "nav-link"}
          >
            Workspace
          </Link>
        </nav>

        <div className="session-bar">
          {isAuthenticated ? (
            <>
              <div className="session-chip">
                <span className="session-name">{profile?.displayName ?? "Signed in"}</span>
                <span className="session-plan">{profile?.planType ?? "free"} plan</span>
              </div>
              <button type="button" className="button button-secondary button-small" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="button button-primary button-small">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
