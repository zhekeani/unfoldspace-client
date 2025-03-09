import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

type ListToPrivateAlertDialogProps = {
  children: ReactNode;
  isUpdating: boolean;
  handleUpdate: () => void;
};

const ReadingListToPrivateAlertDialog = ({
  children,
  isUpdating,
  handleUpdate,
}: ListToPrivateAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Make List Private
          </AlertDialogTitle>
          <AlertDialogDescription>
            If others saved this list, it will be removed from their library.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="font-normal transition-colors rounded-full">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-main-green font-normal transition-colors rounded-full"
          >
            {isUpdating ? "Updating.." : `Make private`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReadingListToPrivateAlertDialog;
