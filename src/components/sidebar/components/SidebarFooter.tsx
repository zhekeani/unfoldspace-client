import Link from "next/link";
import SideBarSubsectionWrapper from "./SidebarSubsectionWrapper";

const SidebarFooter = () => {
  return (
    <SideBarSubsectionWrapper>
      <div className="flex flex-wrap text-xs text-sub-text gap-2 pb-6">
        <Link href={"/"}>Help</Link>
        <Link href={"/"}>Status</Link>
        <Link href={"/"}>About</Link>
        <Link href={"/"}>Privacy</Link>
        <Link href={"/"}>Terms</Link>
      </div>
    </SideBarSubsectionWrapper>
  );
};

export default SidebarFooter;
