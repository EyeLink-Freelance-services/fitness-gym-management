"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { Notification } from "./notification";
import { UserInfo } from "./user-info";
import { MenuIcon } from "@/components/IconsCollection/icons";
import { useAuth } from "@/app/context/auth-context";
import { getRoleFromAuthContext } from "@/config/routes.config";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const auth = useAuth();
  const role = getRoleFromAuthContext(auth);
  const showNotifications = role !== "super-admin" && role !== "company";

  return (
    <header className="sticky top-0 z-[30] flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )}

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* <ThemeToggleSwitch /> */}
        {showNotifications ? <Notification /> : null}

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
