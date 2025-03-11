import { deleteMultipleListItems } from "@/actions/reading-list-item/deleteListItem";
import { useReadingListDetail } from "@/components/context/ReadingListDetailContext";
import { Spinner } from "@/components/loading/Spinner";
import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { Button } from "@/components/ui/button";
import { ReadingListDetail } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ListDetailRemoveItemsBtn = () => {
  const queryClient = useQueryClient();
  const {
    listItemsQueryKey,
    listDetailQueryKey,
    resetItemsToRemove,
    setPageActionType,
    hasItemToRemove,
    listItemsToRemove,
  } = useReadingListDetail();

  const closeRemove = () => {
    resetItemsToRemove();
    setPageActionType(null);
  };

  const { mutate: removeMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      if (!hasItemToRemove || !listItemsToRemove) {
        return Promise.resolve<ActionResponse<{ deletedCount: number }>>({
          success: false,
          error: "There is no item to remove",
        });
      }
      return deleteMultipleListItems(listItemsToRemove.map((item) => item.id));
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(`Successfully removed ${res.data.deletedCount} items`);

        // This is your reference
        queryClient.setQueryData(
          listItemsQueryKey,
          (oldData?: { listItems: ExtendedReadingListItem[] }) => {
            if (!oldData) return oldData;

            const newListItems = oldData.listItems.filter(
              (item) => !listItemsToRemove?.includes(item)
            );
            return {
              listItems: newListItems,
            };
          }
        );

        queryClient.setQueryData(
          listDetailQueryKey,
          (oldData?: { readingList: ReadingListDetail }) => {
            if (!oldData) return oldData;

            return {
              readingList: {
                ...oldData.readingList,
                stories_count:
                  oldData.readingList.stories_count - res.data.deletedCount,
              },
            };
          }
        );

        queryClient.invalidateQueries({ queryKey: listItemsQueryKey });
        queryClient.invalidateQueries({ queryKey: listDetailQueryKey });

        closeRemove();
      }
    },
  });

  return (
    <div className="fixed tablet:static bottom-0 w-full tablet:w-fit left-0 bg-white tablet:bg-transparent ">
      <div className="w-full flex justify-center mb-16 mt-8 tablet:m-0 gap-3">
        <Button
          disabled={isRemoving}
          onClick={closeRemove}
          variant={"outline"}
          className="rounded-full font-light border-main-text/60 transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={() => removeMutation()}
          disabled={!hasItemToRemove || isRemoving}
          variant={"default"}
          className="rounded-full bg-main-green font-normal transition-colors"
        >
          {isRemoving ? <Spinner /> : "Remove"}
        </Button>
      </div>
    </div>
  );
};

export default ListDetailRemoveItemsBtn;
