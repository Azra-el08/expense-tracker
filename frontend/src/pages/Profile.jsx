import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";
import ConfirmDialog from "../components/ConfirmDialog";
import useAuth from "../hooks/useAuth";
import useTransactions from "../hooks/useTransactions";
import { avatarColors } from "../utils/profile";
import { formatDate } from "../utils/format";

function Profile() {
  const { user, isDemo, updateProfile, changePassword, deleteAccount } = useAuth();
  const { transactions, categories, budgets } = useTransactions();

  // ----- Profile details -----
  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.color);
  const [profileMessage, setProfileMessage] = useState(null); // { type, text } or null

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const result = updateProfile({ name, color });
    setProfileMessage(
      result.ok ? { type: "success", text: "Profile saved." } : { type: "error", text: result.error }
    );
  };

  // ----- Password -----
  const emptyPasswords = { current: "", next: "", confirm: "" };
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordBusy, setPasswordBusy] = useState(false);

  const handlePasswordChange = (e) => {
    const { name: field, value } = e.target;
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.next !== passwords.confirm) {
      setPasswordMessage({ type: "error", text: "The new passwords do not match." });
      return;
    }

    setPasswordBusy(true);
    const result = await changePassword({ current: passwords.current, next: passwords.next });
    setPasswordBusy(false);

    if (result.ok) {
      setPasswords(emptyPasswords);
      setPasswordMessage({ type: "success", text: "Password updated." });
    } else {
      setPasswordMessage({ type: "error", text: result.error });
    }
  };

  // ----- Delete account -----
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <PageHeader title="Your profile" subtitle="How you appear and how you sign in." />

      <div className="profile-grid">
        <section className="card">
          <div className="profile-head">
            <Avatar name={name || user.name} color={color} size={64} />
            <div>
              <h2 className="card-title">{user.name}</h2>
              <p className="muted small">{user.email}</p>
              <p className="muted small">Member since {formatDate(user.joined)}</p>
            </div>
          </div>

          <form className="form" onSubmit={handleProfileSubmit} noValidate>
            <div className="field">
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <span className="field-label" id="swatch-label">Avatar color</span>
              <div className="swatches" role="group" aria-labelledby="swatch-label">
                {avatarColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="swatch"
                    style={{ background: c }}
                    aria-label={`Use color ${c}`}
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            {profileMessage && (
              <p className={"message message-" + profileMessage.type} role="status">
                {profileMessage.text}
              </p>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save profile</button>
            </div>
          </form>
        </section>

        <div className="profile-side">
          <section className="card">
            <h2 className="card-title">Change password</h2>
            {isDemo ? (
              <p className="muted">The demo account has no password to change.</p>
            ) : (
              <form className="form" onSubmit={handlePasswordSubmit} noValidate>
                <div className="field">
                  <label htmlFor="current">Current password</label>
                  <input id="current" name="current" type="password" autoComplete="current-password"
                    className="input" value={passwords.current} onChange={handlePasswordChange} />
                </div>
                <div className="field">
                  <label htmlFor="next">New password</label>
                  <input id="next" name="next" type="password" autoComplete="new-password"
                    className="input" value={passwords.next} onChange={handlePasswordChange} />
                </div>
                <div className="field">
                  <label htmlFor="confirm-new">Confirm new password</label>
                  <input id="confirm-new" name="confirm" type="password" autoComplete="new-password"
                    className="input" value={passwords.confirm} onChange={handlePasswordChange} />
                </div>

                {passwordMessage && (
                  <p className={"message message-" + passwordMessage.type} role="status">
                    {passwordMessage.text}
                  </p>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn" disabled={passwordBusy}>
                    Update password
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="card">
            <h2 className="card-title">Your data</h2>
            <p className="muted">
              {transactions.length} transactions, {categories.length} categories and{" "}
              {budgets.length} budgets are saved under this account.
            </p>
          </section>

          <section className="card danger-zone">
            <h2 className="card-title">Danger zone</h2>
            <p className="muted">
              Deleting your account removes the profile and everything saved under it.
            </p>
            <button
              type="button"
              className="btn btn-danger"
              disabled={isDemo}
              onClick={() => setShowDelete(true)}
            >
              Delete my account
            </button>
            {isDemo && <p className="muted small">The demo account cannot be deleted.</p>}
          </section>
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Delete your account?"
          message="This permanently removes your profile, transactions, categories and budgets. It cannot be undone."
          confirmLabel="Delete my account"
          onConfirm={deleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

export default Profile;
