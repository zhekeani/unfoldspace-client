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

type ListDeletionAlertDialogProps = {
  children: ReactNode;
  isDeleting: boolean;
  handleDelete: () => void;
};

const ReadingListDeletionAlertDialog = ({
  children,
  isDeleting,
  handleDelete,
}: ListDeletionAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your list
            and remove your list&apos;s data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="font-normal transition-colors rounded-full">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive font-normal transition-colors rounded-full"
          >
            {isDeleting ? "Deleting.." : `Delete list`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReadingListDeletionAlertDialog;
