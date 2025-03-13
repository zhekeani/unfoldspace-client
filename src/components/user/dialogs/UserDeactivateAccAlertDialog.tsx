import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import SettingsDialogContentContainer from "./components/SettingsDialogCotentContainer";

type AlertDialogProps = {
  children: ReactNode;
};

const UserDeactivateAccAlertDialog = ({ children }: AlertDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <SettingsDialogContentContainer heading="Deactivate account">
        <div>
          <p className="text-sm text-gray-800">
            Deactivating your account will remove it from UnfoldSpace within a
            few minutes. You can sign back in anytime to reactivate your account
            and restore its content.
          </p>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="rounded-full border-destructive text-destructive"
            >
              Cancel
            </Button>
            <Button
              disabled={true}
              type="button"
              className="rounded-full bg-destructive"
            >
              Deactivate account
            </Button>
          </div>
        </div>
      </SettingsDialogContentContainer>
    </Dialog>
  );
};

export default UserDeactivateAccAlertDialog;
