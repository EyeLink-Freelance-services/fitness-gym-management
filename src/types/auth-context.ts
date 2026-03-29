import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface IAuthContext {
  userId: string;
  profile: IProfile,
  companyId: string | null;
  company: ICompany;
  isOwner: boolean;
  roles: string[];
  permissions: string[];
};

export interface ICompanyUser {
  id: string,
  company_id: string,
  is_owner: boolean,
  joined_at: Timestamp,
  user_id: string
}


export interface IProfile {
  id: string,
  first_name: string,
  last_name: string,
  picture_url: string,
  active_company_id: string,
  is_super_admin: boolean;
}

export interface IRole {
  id: string,
  name: string,
}

export interface IPermission {
  id?: string,
  role_id?: string,
  role_name?: string
  module: string,
  can_read: boolean,
  can_write: boolean,
  can_delete: boolean
}

export interface ICompany {
  id: string;
  name: string;
  mode: string;
}

// {
//   userId: "uuid",
//   profile: {
//     id: "uuid",
//     first_name: "Diary",
//     last_name: "Rakotoarisoa"
//   },

//   companyId: "uuid",

//   company: {
//     id: "uuid",
//     name: "My Gym",
//     mode: "company"
//   },

//   isOwner: true,

//   roles: ["admin"],

//   permissions: [
//     "members.view",
//     "members.edit",
//     "plans.view",
//     "payments.view"
//   ]
// }