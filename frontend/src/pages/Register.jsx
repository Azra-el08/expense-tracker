import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import useAuth from "../hooks/useAuth";

function Register() {
  const { user, register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);
    setError("");
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Open your chest"
      subtitle="Create an account to start tracking."
      footer={
        <>
          Already have one? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

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
            autoComplete="new-password"
            className="input"
            value={form.password}
            onChange={handleChange}
          />
          <p className="muted small field-hint">At least 8 characters.</p>
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            className="input"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        {error && <p className="message message-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="muted small auth-note">
        For now your account is saved in this browser only. Real, server-side accounts come with
        the PHP backend.
      </p>
    </AuthLayout>
  );
}

export default Register;
