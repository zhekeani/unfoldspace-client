import { ReactNode } from "react";

const StoryDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="left-content">{children}</div>
    </div>
  );
};

export default StoryDetailLayout;
