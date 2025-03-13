import Link from "next/link";
import SidebarFooter from "./components/SidebarFooter";
import SideBarSubsectionWrapper from "./components/SidebarSubsectionWrapper";

const suggestedArticles: { title: string; linkUrl: string }[] = [
  {
    title: "Sign in or sign up to UnfoldSpace",
    linkUrl: "/",
  },
  {
    title: "Your profile page",
    linkUrl: "/",
  },
  {
    title: "Writing and publishing your first story",
    linkUrl: "/",
  },
  {
    title: "About UnfoldSpace's distribution system",
    linkUrl: "/",
  },
];

const SettingsSidebar = () => {
  return (
    <div className="w-[303px] flex flex-col justify-between">
      <div>
        <SideBarSubsectionWrapper heading="Suggested help articles">
          <div className="flex flex-col gap-4">
            {suggestedArticles.map((article, index) => (
              <Link
                key={index}
                href={article.linkUrl}
                className="text-sm text-main-text"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </SideBarSubsectionWrapper>
      </div>

      <SidebarFooter />
    </div>
  );
};

export default SettingsSidebar;
