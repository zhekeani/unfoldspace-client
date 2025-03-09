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

type StoryDeletionAlertDialogProps = {
  isDeleting: boolean;
  handleDelete: () => void;
  children: ReactNode;
  type?: "published" | "draft";
};

const StoryDeletionAlertDialog = ({
  isDeleting,
  handleDelete,
  children,
  type = "published",
}: StoryDeletionAlertDialogProps) => {
  const entity = type === "published" ? "published story" : "draft";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            {entity} and remove your published {entity}&apos;s data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="font-normal transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive font-normal transition-colors"
          >
            {isDeleting
              ? "Deleting.."
              : `Delete ${type === "published" ? "story" : "draft"}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StoryDeletionAlertDialog;
