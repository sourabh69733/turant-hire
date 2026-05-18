import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "./supabaseClient";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="auth-google-icon" viewBox="0 0 24 24">
      <path
        d="M21.805 12.041c0-.82-.067-1.418-.211-2.039H12.2v3.71h5.514c-.111.922-.71 2.31-2.041 3.243l-.019.124 3.031 2.348.21.021c1.93-1.785 3.044-4.417 3.044-7.407Z"
        fill="#4285F4"
      />
      <path
        d="M12.2 21.818c2.7 0 4.973-.887 6.63-2.418l-3.159-2.451c-.844.588-1.974 1-3.471 1-2.643 0-4.883-1.785-5.682-4.253l-.117.01-3.151 2.439-.04.111c1.646 3.273 5.029 5.562 8.99 5.562Z"
        fill="#34A853"
      />
      <path
        d="M6.518 13.696a5.914 5.914 0 0 1-.333-1.955c0-.677.122-1.332.322-1.954l-.006-.131-3.19-2.478-.104.05A9.605 9.605 0 0 0 2.186 11.74c0 1.734.422 3.373 1.021 4.512l3.311-2.556Z"
        fill="#FBBC05"
      />
      <path
        d="M12.2 5.532c1.885 0 3.16.811 3.882 1.49l2.832-2.765C17.162 2.523 14.9 1.664 12.2 1.664c-3.96 0-7.343 2.288-8.99 5.561l3.3 2.559c.81-2.469 3.05-4.252 5.692-4.252Z"
        fill="#EB4335"
      />
    </svg>
  );
}

export function AuthScreen({
  audienceLabel,
  heading,
  subheading,
  googleRedirectTo,
  allowEmailAuth = false,
}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");

  const client = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    let isMounted = true;

    client.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }
      setSessionEmail(data.session?.user?.email ?? "");
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email ?? "");
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  async function handleEmailAuth(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const payload = { email, password };
    const response =
      mode === "signup"
        ? await client.auth.signUp(payload)
        : await client.auth.signInWithPassword(payload);

    if (response.error) {
      setMessage(response.error.message);
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup") {
      setMessage("Signup successful. Check your email if confirmation is enabled.");
    } else {
      setMessage("Login successful.");
    }

    setIsSubmitting(false);
  }

  async function handleGoogleLogin() {
    setIsSubmitting(true);
    setMessage("");

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: googleRedirectTo,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    await client.auth.signOut();
    setMessage("Signed out.");
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="auth-eyebrow">{audienceLabel}</span>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>

        {sessionEmail ? (
          <div className="auth-session">
            <strong>Signed in as</strong>
            <span>{sessionEmail}</span>
            <button className="auth-button auth-button-secondary" onClick={handleSignOut} type="button">
              Sign out
            </button>
          </div>
        ) : (
          <>
            {allowEmailAuth ? (
              <>
                <div className="auth-switch">
                  <button
                    className={mode === "login" ? "is-active" : ""}
                    onClick={() => setMode("login")}
                    type="button"
                  >
                    Login
                  </button>
                  <button
                    className={mode === "signup" ? "is-active" : ""}
                    onClick={() => setMode("signup")}
                    type="button"
                  >
                    Sign up
                  </button>
                </div>

                <form className="auth-form" onSubmit={handleEmailAuth}>
                  <label>
                    Email
                    <input
                      autoComplete="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                    />
                  </label>

                  <label>
                    Password
                    <input
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      type="password"
                      value={password}
                    />
                  </label>

                  <button className="auth-button" disabled={isSubmitting} type="submit">
                    {mode === "signup" ? "Create account" : "Login"}
                  </button>
                </form>

                <div className="auth-divider">or</div>
              </>
            ) : (
              <div className="auth-single-mode">
                <span className="auth-pill">Google only for now</span>
              </div>
            )}

            <button className="auth-google-button" disabled={isSubmitting} onClick={handleGoogleLogin} type="button">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {message ? <p className="auth-message">{message}</p> : null}
      </div>
    </div>
  );
}
