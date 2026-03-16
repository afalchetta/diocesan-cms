import React, { useState } from "react";
import { updatePassword } from "../../firestore/firestoreService";

export default function ProfileContent({ profile }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      await updatePassword(password);
      setStatus({ type: "success", message: "✅ Password updated successfully." });
      setPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setStatus({
          type: "error",
          message: "⚠️ Please log out and log back in before changing your password.",
        });
      } else if (error.code === "auth/weak-password") {
        setStatus({
          type: "error",
          message: "⚠️ Password should be at least 6 characters.",
        });
      } else {
        setStatus({
          type: "error",
          message: "❌ Something went wrong. Please try again.",
        });
      }
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-name">{profile.username}</h2>
      <p className="profile-email">Email: {profile.email}</p>

      <div className="profile-section">
        <button
          className="profile-btn secondary"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? "Cancel" : "Change Password"}
        </button>
      </div>

      {showPasswordForm && (
        <form className="password-form" onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="profile-btn primary">
            Update Password
          </button>
        </form>
      )}

      {status.message && (
        <div className={`profile-message ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
