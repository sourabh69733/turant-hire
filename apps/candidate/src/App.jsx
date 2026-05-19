import { useEffect, useMemo, useState } from "react";
import { AuthScreen, getSupabaseBrowserClient } from "auth-ui";

import { CandidateDashboard } from "./components/CandidateDashboard";
import { CandidateOnboarding } from "./components/CandidateOnboarding";
import {
  createCandidateProfile,
  getCandidateProfileByAuthUserId,
  updateCandidateAvailability,
  updateCandidateProfile,
} from "./lib/candidateApi";
import { ensureAppUser } from "./lib/userApi";
import "./candidate.css";

export default function App() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isRoleBlocked, setIsRoleBlocked] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      setSession(data.session);
      setIsBooting(false);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null);
        setIsRoleBlocked(false);
        setError("");
        return;
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) {
        return;
      }

      setIsBooting(true);
      setError("");
      setIsRoleBlocked(false);

      try {
        await ensureAppUser({
          auth_user_id: session.user.id,
          email: session.user.email ?? "",
          role: "candidate",
        });
        const nextProfile = await getCandidateProfileByAuthUserId(session.user.id);
        setProfile(nextProfile);
      } catch (nextError) {
        setProfile(null);
        setError(nextError.message);
        setIsRoleBlocked(nextError.message.toLowerCase().includes("already registered as"));
      } finally {
        setIsBooting(false);
      }
    }

    loadProfile();
  }, [session?.user?.id]);

  async function handleCreateProfile(payload) {
    setIsSaving(true);
    setError("");

    try {
      const nextProfile = await createCandidateProfile(payload);
      setProfile(nextProfile);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateProfile(payload) {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const nextProfile = await updateCandidateProfile(profile.id, payload);
      setProfile(nextProfile);
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateAvailability(payload) {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const nextProfile = await updateCandidateAvailability(profile.id, payload);
      setProfile(nextProfile);
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <AuthScreen
        audienceLabel="Candidate"
        heading="Candidate sign in"
        subheading="Sign in fast, then complete your profile and availability."
        googleRedirectTo={window.location.origin}
        allowEmailAuth={false}
      />
    );
  }

  if (isBooting) {
    return (
      <div className="candidate-shell">
        <div className="candidate-panel candidate-hero-panel">
          <div>
            <span className="candidate-kicker">Loading</span>
            <h1>Preparing your candidate workspace.</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="candidate-shell">
          <div className="candidate-banner">{error}</div>
        </div>
      ) : null}

      {profile ? (
        <CandidateDashboard
          isSaving={isSaving}
          onAvailabilitySave={handleUpdateAvailability}
          onProfileSave={handleUpdateProfile}
          onSignOut={handleSignOut}
          profile={profile}
        />
      ) : !isRoleBlocked ? (
        <CandidateOnboarding
          authUserId={session.user.id}
          initialEmail={session.user.email ?? ""}
          isSaving={isSaving}
          onSave={handleCreateProfile}
        />
      ) : (
        <div className="candidate-shell">
          <div className="candidate-panel candidate-hero-panel">
            <div>
              <span className="candidate-kicker">Account role</span>
              <h1>This Google account cannot open the candidate app.</h1>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
