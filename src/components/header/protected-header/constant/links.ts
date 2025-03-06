import { BookMarked, ChartColumnBig, ScrollText } from "lucide-react";
import { ElementType } from "react";
import { UrlObject } from "url";

export type DropDownLinkItem = {
  href: string | UrlObject;
  label: string;
  icon: ElementType;
  parentRoute: string;
};

export const userLinks: DropDownLinkItem[] = [
  {
    label: "Library",
    icon: BookMarked,
    href: "/me/lists",
    parentRoute: "/me/lists",
  },
  {
    label: "Stories",
    icon: ScrollText,
    href: "/me/stories/drafts",
    parentRoute: "/me/stories",
  },
  {
    label: "Stats",
    icon: ChartColumnBig,
    href: "",
    parentRoute: "/stats",
  },
];

export const settingLinks: Pick<DropDownLinkItem, "label" | "href">[] = [
  {
    label: "Settings",
    href: "/me/settings",
  },
  {
    label: "Refine recommendations",
    href: "/",
  },
  {
    label: "Manage publications",
    href: "/",
  },
  {
    label: "Help",
    href: "/",
  },
];
