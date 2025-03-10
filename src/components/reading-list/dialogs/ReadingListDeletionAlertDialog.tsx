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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";
import { deleteReadingList } from "../../../actions/reading-list/deleteReadingList";
import { ExtendedReadingList } from "../ReadingListItem";

type ListDeletionAlertDialogProps = {
  children: ReactNode;
  listsQueryKey: string[];
  listId: string;
};

const ReadingListDeletionAlertDialog = ({
  children,
  listId,
  listsQueryKey,
}: ListDeletionAlertDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteReadingList(listId),

    onMutate: () => {
      queryClient.setQueryData(
        listsQueryKey,
        (oldData?: { readingLists: ExtendedReadingList[] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            readingLists: oldData.readingLists.filter(
              (readingList) => readingList.id !== listId
            ),
          };
        }
      );
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully deleted list");
      }
      queryClient.invalidateQueries({ queryKey: listsQueryKey });
    },
  });

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
            onClick={() => deleteMutation()}
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
