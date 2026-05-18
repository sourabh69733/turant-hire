import { AuthScreen } from "auth-ui";

export default function App() {
  return (
    <AuthScreen
      audienceLabel="Employer"
      heading="Employer sign in"
      subheading="Sign in first, then post your urgent requirement."
      googleRedirectTo={window.location.origin}
      allowEmailAuth={false}
    />
  );
}
