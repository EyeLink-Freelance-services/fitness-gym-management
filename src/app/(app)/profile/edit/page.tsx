"use client";

import {
  ProfileUpdateFormValues,
  ProfileUpdateSchema,
} from "@/lib/validation/schemas/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

export default function EditPage() {
  //const [profile, setProfile] = useState<ProfileUpdateFormValues>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(ProfileUpdateSchema),
  });

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch("/api/profile", {
        method: "GET",
        cache: "no-store",
      });

      const json = await res.json();

      if (!json.ok) {
        setErrorMsg(json.message);
      } else {
        const data = json.data;
        //setProfile(data);
        reset(data);
      }
    };

    getProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileUpdateFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.ok) {
      setErrorMsg(json.message);
    } else {
      setSuccessMsg("Profile updated successfully");
    }
  };

  if (errorMsg) {
    return <div className="p-4 text-red-500">{errorMsg}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            {...register("first_name")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            {...register("last_name")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
						disabled
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">
            Phone (International format)
          </label>
          <input
            {...register("phone")}
            placeholder="+230XXXXXXXX"
            className="w-full border rounded px-3 py-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

       {/* Picture */}
				<div>
					<label className="block mb-1 font-medium">Profile Picture</label>

					<input
						type="file"
						accept="image/*"
						{...register("picture")}
						className="w-full border rounded px-3 py-2"
					/>

					{errors.picture && (
						<p className="text-red-500 text-sm mt-1">
							{errors.picture.message as string}
						</p>
					)}
				</div>

        {/* Success */}
        {successMsg && (
          <div className="text-green-600 text-sm">{successMsg}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}