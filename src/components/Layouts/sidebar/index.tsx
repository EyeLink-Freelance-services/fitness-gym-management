"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, ChevronUp } from "../../IconsCollection/icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { getDashboardNav } from "@/utils/dashboard-nav";
import { Logo } from "@/components/logo";
import { sidebarProps } from "@/types/shared";

export function Sidebar({ auth }: sidebarProps) {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navData = getDashboardNav(pathname, auth);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-2 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link href={"/"} onClick={() => isMobile && toggleSidebar()}>
              <div className="flex items-center gap-3 rounded-lg bg-black/25 p-1 text-base font-bold text-dark dark:text-white">
                <div className="relative h-18 w-18 flex-shrink-0">
                  <Logo />
                </div>
                <p className="text-center text-lg font-bold tracking-wide hidden sm:block">
                  Fitness | Coach <br /> Management
                </p>
              </div>
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {navData.map((section) => (
              <div key={section.label} className="mb-6">
                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(({ url }) =>
                                url.includes(pathname),
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname.includes(subItem.url)}
                                      disabled={subItem.disabled}
                                    >
                                      <div className="flex gap-2">
                                        {subItem.icon && (
                                          <subItem.icon
                                            className="size-6 shrink-0"
                                            aria-hidden="true"
                                          />
                                        )}
                                        <span>{subItem.title}</span>
                                      </div>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                  item.title.toLowerCase().split(" ").join("-");
                            const hasNestedSiblingRoutes = section.items.some(
                              (sectionItem) =>
                                "url" in sectionItem &&
                                typeof sectionItem.url === "string" &&
                                sectionItem.url !== href &&
                                sectionItem.url.startsWith(`${href}/`),
                            );
                            const isActive = hasNestedSiblingRoutes
                              ? pathname === href
                              : pathname === href ||
                                pathname.startsWith(`${href}/`);

                            return (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={href}
                                isActive={
                                  href === "/" ? pathname === "/" : isActive
                                }
                                disabled={item.disabled}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{item.title}</span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
