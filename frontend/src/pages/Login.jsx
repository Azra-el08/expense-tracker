import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import useAuth from "../hooks/useAuth";

function Login() {
  const { user, login, loginAsDemo } = useAuth();
  const location = useLocation();
  const from = location.state?.from ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already logged in? Go straight to the app (also runs right after a successful login)
  if (user) return <Navigate to={from} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const result = await login(form);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up right where you left off."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="input"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="message message-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Checking..." : "Log in"}
        </button>
      </form>

      <div className="auth-divider">or</div>

      <button type="button" className="btn btn-block" onClick={loginAsDemo}>
        Try the demo account
      </button>
      <p className="muted small auth-note">
        The demo comes with sample transactions, categories and budgets.
      </p>
    </AuthLayout>
  );
}

export default Login;
