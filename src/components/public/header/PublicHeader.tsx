"use client";

import Link from "next/link";

const PublicHeader = () => {
  return (
    <header
      style={{ borderBottomWidth: "0.3px", borderBottomStyle: "solid" }}
      className="fixed top-0 z-50 bg-white w-full flex flex-shrink-0 h-[75px] justify-center  border-b-complement-light-gray shadow-none"
    >
      <nav className="h-full w-full max-w-[1192px] mx-6 tablet:mx-12 desktop:mx-16 flex items-center justify-between ">
        <div>
          <Link
            href="/"
            className="font-gt-super text-3xl font-medium tracking-tighter text-main-text"
          >
            UnfoldSpace
          </Link>
        </div>

        <div className="flex flex-row gap-4 text-sm items-center">
          <Link
            href="/signin-options"
            className="px-4 py-2 rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup-options"
            className="px-4 py-2 rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default PublicHeader;
