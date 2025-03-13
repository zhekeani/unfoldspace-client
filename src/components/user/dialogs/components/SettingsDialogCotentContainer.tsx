import { ReactNode } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SettingsDialogContentContainerProps = {
  children: ReactNode;
  heading: string;
};

const SettingsDialogContentContainer = ({
  children,
  heading,
}: SettingsDialogContentContainerProps) => {
  return (
    <DialogContent className="!w-full h-full  max-h-[100%] mobile:max-h-[90%] overflow-y-scroll mobile:h-fit mobile:max-w-[540px] !rounded-none mobile:!rounded-sm px-6 pb-6 mobile:p-8 flex flex-col gap-0">
      <DialogHeader className="mt-[58px] mobile:mt-0">
        <DialogTitle className="font-medium text-xl text-center">
          {heading}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-8">{children}</div>
    </DialogContent>
  );
};

export default SettingsDialogContentContainer;
