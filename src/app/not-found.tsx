import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[680px]">
        <div className="mx-6">
          <div className="mt-[80px] text-center">
            <p className="text-main-text font-light text-xs-sm">
              PAGE NOT FOUND
            </p>
            <div className="mt-2">
              <h2 className="text-8xl text-sub-text font-gt-super">404</h2>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl text-main-text font-gt-super">
                Out of nothing, something.
              </h3>
            </div>
            <div className="mt-5">
              <p className="font-sohne font-light text-main-text">
                You can find (just about) anything on UnfoldSpace -- apparently
                even a page that doesn&apos;t exist.
              </p>
            </div>
            <div className="mt-2 font-sohne font-light underline text-main-text">
              <Link href={"/"}>Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
