"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import {
  AtSignIcon,
  ChevronDownIcon,
  DashboardIcon,
  InboxIcon,
  MailIcon,
  MegaphoneIcon,
} from "./icons";
import styles from "../admin.module.css";

type NavItem = { href: string; label: string; icon: ReactNode; badge?: ReactNode };

type Props = { contactBadge: ReactNode };

// The URL is only known at request time, so the nav prerenders without a
// highlighted item and fills it in once the path is available.
export function SidebarNav(props: Props) {
  return (
    <Suspense fallback={<NavLinks {...props} pathname={null} />}>
      <CurrentNavLinks {...props} />
    </Suspense>
  );
}

function CurrentNavLinks(props: Props) {
  return <NavLinks {...props} pathname={usePathname()} />;
}

type NavGroup = { label: string; icon: ReactNode; badge?: ReactNode; items: NavItem[] };

function NavLinks({ contactBadge, pathname }: Props & { pathname: string | null }) {
  // Groups the admin has opened or closed by hand. Untouched groups are open
  // only while they contain the current page.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname === href || !!pathname?.startsWith(`${href}/`);

  const groups: NavGroup[] = [
    {
      label: "Marketing",
      icon: <MegaphoneIcon />,
      items: [{ href: "/admin/email-list", label: "Email List", icon: <AtSignIcon /> }],
    },
    {
      label: "Contact",
      icon: <InboxIcon />,
      badge: contactBadge,
      items: [
        { href: "/admin/contact", label: "Contact Form", icon: <MailIcon />, badge: contactBadge },
      ],
    },
  ];

  const renderLink = (item: NavItem) => (
    <Link
      href={item.href}
      className={styles.navLink}
      aria-current={isActive(item.href) ? "page" : undefined}
    >
      {item.icon}
      <span className={styles.navLabel}>{item.label}</span>
      {item.badge}
    </Link>
  );

  return (
    <nav className={styles.nav} aria-label="Admin">
      <ul className={styles.navList}>
        <li>{renderLink({ href: "/admin", label: "Dashboard", icon: <DashboardIcon /> })}</li>
        {groups.map((group) => {
          const hasActive = group.items.some((item) => isActive(item.href));
          const open = toggled[group.label] ?? hasActive;
          const listId = `nav-${group.label.toLowerCase()}`;

          return (
            <li key={group.label} className={styles.navGroup}>
              <button
                type="button"
                className={styles.navGroupToggle}
                aria-expanded={open}
                aria-controls={listId}
                data-active={hasActive || undefined}
                onClick={() => setToggled((prev) => ({ ...prev, [group.label]: !open }))}
              >
                {group.icon}
                <span className={styles.navLabel}>{group.label}</span>
                {/* Keep unread counts visible while the group is collapsed. */}
                {!open && group.badge}
                <span className={styles.chevron}>
                  <ChevronDownIcon />
                </span>
              </button>
              <ul id={listId} className={styles.navSubList} hidden={!open}>
                {group.items.map((item) => (
                  <li key={item.href}>{renderLink(item)}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
