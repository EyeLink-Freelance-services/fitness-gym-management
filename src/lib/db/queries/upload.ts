import { createClient } from "@/lib/supabase/client";

export async function uploadPicture(file: File, userId: string) {
	const fileExt = file.name.split(".").pop();
	const filePath = `${userId}.${fileExt}`;

	const supabase = createClient();

	const { error } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, {
				upsert: true,
			});

	if (error) {
		throw error;
	}

	const { data } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

	return data.publicUrl; 
}