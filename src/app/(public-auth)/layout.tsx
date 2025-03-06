import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import PublicAuthPageSkeleton from "../../components/public/skeleton/PublicAuthPageSkeleton";

const PublicAuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-svh h-svh flex flex-col items-center bg-white ">
      {/* <PublicHeader /> */}
      <main className="relative overflow-hidden w-full flex-1 flex items-center justify-center ">
        {/* hero image */}
        <div className="absolute pointer-events-none w-full h-full min-w-[1192px]">
          <div className="w-full h-full relative ">
            <Image
              src="/unfoldspace_hero08.png"
              width={1000}
              height={1000}
              alt="UnfoldSpace Hero"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="w-full max-w-[1192px] mx-0 tablet:mx-12 desktop:mx-16  h-full relative">
          <div
            className={cn(
              "absolute bg-white top-1/2 -translate-y-1/2 desktop:left-0 desktop:-translate-x-0 tablet:left-1/2 tablet:-translate-x-1/2  border-[1px] w-full h-full max-w-full items-center justify-center rounded-md shadow-md",
              "tablet:max-w-[600px] desktop:max-w-[678px] desktop:max-h-[695px]"
            )}
          >
            <Link
              href="/"
              className="flex items-center gap-1 text-sub-text hover:text-main-text p-2 absolute top-3 left-2 transition-colors"
            >
              <ChevronLeft strokeWidth={1} />
              <div className="text-sm">Home</div>
            </Link>
            <div className="h-full flex flex-col justify-center items-center ">
              <Suspense fallback={<PublicAuthPageSkeleton />}>
                {children}
              </Suspense>{" "}
            </div>
          </div>
        </div>
      </main>
      {/* <PublicFooter /> */}
    </div>
  );
};

export default PublicAuthLayout;
