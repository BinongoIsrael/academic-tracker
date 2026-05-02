"use client";

import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Toast from "../components/Toast";
import AvatarUploader from "./components/AvatarUploader";

export default function SettingsPage() {
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
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-4 sm:p-8 pt-8 sm:pt-8 pb-24 ml-0 lg:ml-[325px]">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">Profile Settings</h1>

          <div className="bg-white border-2 border-black rounded-[45px] p-6 sm:p-8 shadow-[0_5px_0_#191A23] space-y-8">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Picture
              </label>
              <AvatarUploader
                user={user}
                url={avatar_url}
                onUpload={(url) => {
                  setAvatarUrl(url);
                }}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                />
              </div>
            </div>

            <div>
              <button
                onClick={updateProfile}
                disabled={loading}
                className="w-full bg-green-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : "Update Profile"}
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