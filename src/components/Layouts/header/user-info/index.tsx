"use client";

import {
  ChevronUpIcon,
  LogOutIcon,
  Users,
} from "@/components/IconsCollection/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/constants/route";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { signOut } from "next-auth/react";
import { getUserDetails } from "@/lib/auth/user-details";

export function UserInfo() {
  const auth = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await signOut({ redirect: false });

    setIsOpen(false);

    router.push(ROUTES.LOGIN);
    router.refresh();
  };

  const { firstName, displayName, role, profilePic } = getUserDetails(auth);

  const displayAvatar = () => {
    return profilePic ? (
      <Image
        src={profilePic}
        alt={`Picture Picture of ${displayName}`}
        width={48}
        height={48}
        className="size-12 rounded-full object-cover"
      />
    ) : (
      <Users className="size-12 text-gray-500" />
    );
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded-xl bg-[#374151] align-middle outline-none">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-1">
          {displayAvatar()}
          <figcaption className="flex items-center gap-1 font-medium max-[1024px]:sr-only">
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "mr-2 rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          {displayAvatar()}
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {firstName}
            </div>

            <div className="leading-none text-gray-6">{role}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        {/* <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/account-settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div> */}

        {/* <hr className="border-[#E8E8E8] dark:border-dark-3" /> */}

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={logout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
