import Image from "next/image";
import Link from "next/link";
import PublicFooter from "@/components/public/footer/PublicFooter";
import PublicHeader from "@/components/public/header/PublicHeader";

export default function Home() {
  return (
    <div className="w-full min-h-svh h-svh flex flex-col items-center bg-white ">
      <PublicHeader />
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
        <div className="w-full max-w-[1192px] mx-6 tablet:mx-12 desktop:mx-16">
          <h1 className="font-gt-super text-6xl tablet:text-8xl tracking-tighter mb-8 tablet:mb-12 tablet:leading-[4.7rem]">
            Human <br /> stories & ideas
          </h1>
          <p className="text-xl table:text-2xl mb-12">
            A place to read, write, and deepen your understanding
          </p>
          <Link
            href="/signup-options"
            className="px-4 py-2 rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            Start reading
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
