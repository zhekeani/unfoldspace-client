import MeListsSecondarySubheader from "@/components/header/protected-header/MeListsSecondarySubheader";
import { ReactNode } from "react";

const MeListsSecondaryLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MeListsSecondarySubheader />
      {children}
    </>
  );
};

export default MeListsSecondaryLayout;
