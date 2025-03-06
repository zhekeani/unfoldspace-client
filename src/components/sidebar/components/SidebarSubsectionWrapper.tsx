import { ReactNode } from "react";

type SidebarSubsectionWrapperProps = {
  heading?: string;
  children: ReactNode;
};

const SideBarSubsectionWrapper = ({
  heading,
  children,
}: SidebarSubsectionWrapperProps) => {
  return (
    <div className="mt-10">
      {heading && <h3 className="mb-6 font-medium">{heading}</h3>}
      {!heading && <div className="mb-6"></div>}
      {children}
    </div>
  );
};

export default SideBarSubsectionWrapper;
