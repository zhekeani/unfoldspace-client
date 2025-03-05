import Link from "next/link";

const PublicFooter = () => {
  return (
    <footer className="fixed bottom-0 z-50 bg-white w-full h-[68px] border-t-[1px] border-t-complement-light-gray flex flex-shrink-0 justify-center shadow-md">
      <nav className="h-full mx-6 flex items-center gap-4 text-xs text-sub-text">
        <Link href={"/"}>Help</Link>
        <Link href={"/"}>Status</Link>
        <Link href={"/"}>About</Link>
        <Link href={"/"}>Privacy</Link>
        <Link href={"/"}>Terms</Link>
      </nav>
    </footer>
  );
};

export default PublicFooter;
