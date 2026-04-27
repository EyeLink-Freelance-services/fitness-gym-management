import { IPermission } from "@/types/auth/auth-context";

export const getPermissionStringTable = (data: IPermission[]) => {
	const permissions =
	data.flatMap((p: any) => {
		const perms: string[] = [];

		if (p.can_read) perms.push(`${p.module}.view`);
		if (p.can_write) perms.push(`${p.module}.edit`);
		if (p.can_delete) perms.push(`${p.module}.delete`);

		return perms;
	}) ?? [];

	return permissions;
}