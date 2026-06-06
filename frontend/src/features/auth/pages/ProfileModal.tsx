import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

type Tab = "profile" | "password" | "danger";

export const ProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { user, setUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  const [username, setUsername] = useState(user?.username ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateProfile({ username });
      setUser(data.user);
      toast.success("Username updated successfully");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account and all data.",
      )
    )
      return;
    setLoading(true);
    try {
      await deleteAccount();
      await handleLogout();
      navigate({ to: "/login" });
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-md relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground text-lg"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold">Account Settings</h2>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {(["profile", "password", "danger"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "danger"
                ? "Delete Account"
                : t === "password"
                  ? "Password"
                  : "Profile"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="label">EMAIL</label>
              <input
                className="input opacity-60"
                value={user?.email ?? ""}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label">USERNAME</label>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? <div className="loader mx-auto" /> : "Save Changes"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="label">CURRENT PASSWORD</label>
              <input
                className="input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label">NEW PASSWORD</label>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? <div className="loader mx-auto" /> : "Change Password"}
            </button>
          </form>
        )}

        {/* Danger Tab */}
        {tab === "danger" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Permanently deletes your account, all resumes, jobs, and reports.
              This cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-red-500 hover:bg-red-600
  transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="loader mx-auto" />
              ) : (
                "Delete My Account"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
