import { ReactNode } from "react";
import MeListsSecondarySubheader from "../../../../../../components/header/protected-header/MeListsSecondarySubheader";

const MeListsSecondaryLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MeListsSecondarySubheader />
      {children}
    </>
  );
};

export default MeListsSecondaryLayout;
