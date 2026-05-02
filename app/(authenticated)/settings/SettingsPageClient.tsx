"use client";

import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Toast from "../components/Toast";
import AvatarUploader from "./components/AvatarUploader";

export default function SettingsPageClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const getProfile = useCallback(async (user: User) => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("users")
        .select(`full_name, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      setToast({ message: "Error loading user data!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setUser(user);
        getProfile(user);
      }
    };
    checkUser();
  }, [router, getProfile]);

  async function updateProfile() {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      <main className="max-w-[1200px] mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <header>
            <h1 className="text-dashboard-title text-on-surface mb-2">Settings</h1>
            <p className="text-body-large text-on-surface-variant font-medium">
                Manage your profile information and account preferences.
            </p>
          </header>

          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)] space-y-10">
            <section className="space-y-8">
                <div className="space-y-6">
                    <AvatarUploader
                        user={user}
                        url={avatar_url}
                        onUpload={(url) => {
                            setAvatarUrl(url);
                        }}
                    />

                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant ml-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            className="w-full bg-surface border-outline-variant/30 rounded p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold transition-all"
                            value={fullName || ""}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>

                    <div className="space-y-2 opacity-60">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            disabled
                            className="w-full bg-surface-container-low border-outline-variant/20 rounded p-4 text-sm font-semibold cursor-not-allowed"
                            value={user?.email || ""}
                        />
                    </div>
                </div>
            </section>

            <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
              <button
                onClick={updateProfile}
                disabled={loading}
                className="w-full sm:w-auto bg-primary text-on-primary font-bold py-4 px-10 rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 active:translate-y-[2px] disabled:opacity-50"
              >
                {loading ? "Saving..." : (
                    <>
                    SAVE CHANGES
                    <span className="material-symbols-outlined text-lg">save</span>
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
