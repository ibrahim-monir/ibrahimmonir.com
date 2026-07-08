'use client';
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Save, Eye, EyeOff, Camera, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type ApiError = AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  client?: { company?: string; phone?: string; avatar?: string };
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Update your photo, personal information and password.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="card p-6 animate-pulse h-40" style={{ opacity: 0.5 }} />)}
        </div>
      ) : (
        <>
          <AvatarForm profile={profile!} />
          <InfoForm profile={profile!} />
          <PasswordForm />
        </>
      )}
    </div>
  );
}

function AvatarForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const avatarPath = profile.client?.avatar;
  const avatarUrl = avatarPath
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "http://localhost:8000"}/storage/${avatarPath}`
    : null;

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setFile(null);
      setPreview(null);
      toast.success("Profile photo updated.");
    },
    onError: (err: ApiError) => {
      const msg = err?.response?.data?.message ?? "Upload failed.";
      toast.error(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    mutation.mutate(formData);
  };

  const displaySrc = preview ?? avatarUrl;
  const initials = profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
          <Camera size={18} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="font-semibold text-lg">Profile Photo</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-white"
            style={{ background: displaySrc ? "transparent" : "var(--primary)" }}>
            {displaySrc ? (
              <Image src={displaySrc} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" unoptimized />
            ) : initials}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--primary)" }}>
            <Camera size={13} className="text-white" />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            JPG, PNG or WebP — max 2MB
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
              style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}>
              <Upload size={14} /> Choose Photo
            </button>
            {file && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={mutation.isPending}
                className="btn-primary px-4 py-2 text-sm">
                {mutation.isPending ? "Uploading..." : <><Save size={14} /> Save Photo</>}
              </button>
            )}
          </div>
          {file && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Selected: {file.name}
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

function InfoForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: profile.name ?? "",
    email: profile.email ?? "",
    company: profile.client?.company ?? "",
    phone: profile.client?.phone ?? "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.put("/profile", data).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], (old: Profile) => ({ ...old, ...updated }));
      useAuthStore.setState({ user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
      toast.success("Profile updated successfully.");
    },
    onError: (err: ApiError) => {
      const msg = err?.response?.data?.errors?.email?.[0] ?? err?.response?.data?.message ?? "Update failed.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type} value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
    </div>
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
          <User size={18} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="font-semibold text-lg">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {field("name", "Full Name")}
          {field("email", "Email Address", "email")}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("company", "Company Name")}
          {field("phone", "Phone Number", "tel")}
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={mutation.isPending} className="btn-primary px-6 py-2.5">
            {mutation.isPending ? "Saving..." : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordForm() {
  const [form, setForm] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [showPass, setShowPass] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.put("/profile/password", data).then((r) => r.data),
    onSuccess: () => {
      toast.success("Password changed successfully.");
      setForm({ current_password: "", password: "", password_confirmation: "" });
    },
    onError: (err: ApiError) => {
      const msg = err?.response?.data?.errors?.current_password?.[0]
        ?? err?.response?.data?.message
        ?? "Password change failed.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("New passwords do not match.");
      return;
    }
    mutation.mutate(form);
  };

  const passField = (key: keyof typeof form, label: string) => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPass ? "text" : "password"} required
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full px-4 py-2.5 pr-11 rounded-lg text-sm outline-none transition-colors"
          style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
          placeholder="••••••••"
        />
        {key === "current_password" && (
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-muted)" }}>
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
          <Lock size={18} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="font-semibold text-lg">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {passField("current_password", "Current Password")}
        <div className="grid sm:grid-cols-2 gap-4">
          {passField("password", "New Password")}
          {passField("password_confirmation", "Confirm New Password")}
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={mutation.isPending} className="btn-primary px-6 py-2.5">
            {mutation.isPending ? "Updating..." : <><Lock size={15} /> Update Password</>}
          </button>
        </div>
      </form>
    </div>
  );
}
