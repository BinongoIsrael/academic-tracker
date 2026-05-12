"use client";

import { AvatarUploaderProps } from "@/types";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useState } from "react";

export default function AvatarUploader({ user, url, onUpload }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);


  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert("You must be logged in to upload an avatar.");
      return;
    }

    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      if (!data.publicUrl) {
          throw new Error("Could not get public URL for the uploaded file.");
      }

      onUpload(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-lg ring-1 ring-outline-variant/20 bg-surface-container-high flex items-center justify-center">
            {url ? (
                <Image
                src={url}
                alt="Profile Avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                width={96}
                height={96}
                />
            ) : (
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">person</span>
            )}
        </div>
        {uploading && (
            <div className="absolute inset-0 bg-on-background/40 rounded-full flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        )}
      </div>
      
      <div className="space-y-3 text-center sm:text-left">
        <label
          htmlFor="single"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-bold text-xs uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-sm border border-outline-variant/10"
        >
          <span className="material-symbols-outlined text-base">cloud_upload</span>
          {uploading ? "Uploading..." : "Replace Visual"}
        </label>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight max-w-[180px]">
            JPG or PNG format. <br/>
            Maximum file size: 2MB.
        </p>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}