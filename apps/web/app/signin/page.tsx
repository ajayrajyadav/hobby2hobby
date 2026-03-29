"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../../lib/api";
import { useSession } from "../../components/session-provider";

export default function SignInPage() {
  const router = useRouter();
  const { authenticate, isAuthenticated, profile } = useSession();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setRegisterError(null);
    setIsRegistering(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await registerUser({
        displayName: String(formData.get("displayName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      });

      await authenticate(response);
      router.push("/workspace");
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoginError(null);
    setIsSigningIn(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await loginUser({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      });

      await authenticate(response);
      router.push("/workspace");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <main className="shell">
      <section className="page-header">
        <p className="eyebrow">Authentication</p>
        <h1>Sign in or create your barter profile.</h1>
        <p className="lede">
          The current MVP uses bearer tokens from the gateway. Once signed in, your
          workspace unlocks profile editing, listings, messaging, proposals, and trust actions.
        </p>
      </section>

      {isAuthenticated ? (
        <section className="card banner-card">
          <h2>{profile?.displayName ?? "You are signed in."}</h2>
          <p>Jump back into your workspace to manage listings and active barter threads.</p>
          <div className="actions">
            <button type="button" className="button button-primary" onClick={() => router.push("/workspace")}>
              Open workspace
            </button>
          </div>
        </section>
      ) : null}

      <section className="auth-grid">
        <article className="card form-card">
          <div className="stack-sm">
            <p className="panel-label">New account</p>
            <h2>Register</h2>
            <p>Start with a profile, then add local offers or needs from your workspace.</p>
          </div>

          <form className="stack-md" onSubmit={handleRegister}>
            <label className="field">
              <span>Display name</span>
              <input name="displayName" required minLength={2} placeholder="Ajay" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required placeholder="you@example.com" />
            </label>
            <label className="field">
              <span>Password</span>
              <input name="password" type="password" required minLength={6} />
            </label>

            {registerError ? <p className="form-error">{registerError}</p> : null}

            <button type="submit" className="button button-primary" disabled={isRegistering}>
              {isRegistering ? "Creating account..." : "Create account"}
            </button>
          </form>
        </article>

        <article className="card form-card">
          <div className="stack-sm">
            <p className="panel-label">Existing account</p>
            <h2>Sign in</h2>
            <p>Use your current email and password to reopen your barter workspace.</p>
          </div>

          <form className="stack-md" onSubmit={handleLogin}>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required placeholder="you@example.com" />
            </label>
            <label className="field">
              <span>Password</span>
              <input name="password" type="password" required minLength={6} />
            </label>

            {loginError ? <p className="form-error">{loginError}</p> : null}

            <button type="submit" className="button button-primary" disabled={isSigningIn}>
              {isSigningIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
