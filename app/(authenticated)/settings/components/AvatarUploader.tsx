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

      const { error: uploadError } = await supabase.storage.from("users").upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("users").getPublicUrl(filePath);
      
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
    <div className="flex items-center gap-4">
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          className="rounded-full object-cover w-20 h-20"
          width={80}
          height={80}
        />
      ) : (
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-sm text-slate-500">No Image</span>
        </div>
      )}
      <div>
        <label
          htmlFor="single"
          className="bg-slate-100 text-slate-800 text-sm font-medium py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
        >
          {uploading ? "Uploading..." : "Change Picture"}
        </label>
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