import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateListItemsOrder } from "../../../../actions/reading-list-item/updateListItem";
import { useReadingListDetail } from "../../../context/ReadingListDetailContext";
import { Spinner } from "../../../loading/Spinner";
import { ExtendedReadingListItem } from "../../../reading-list/ReadingListStoryItem";
import { Button } from "../../../ui/button";

type ListDetailReorderButtonProps = {
  listId: string;
};

const ListDetailReorderButton = ({ listId }: ListDetailReorderButtonProps) => {
  const queryClient = useQueryClient();
  const {
    listItemsQueryKey,
    resetReorderedItems,
    setPageActionType,
    isOrderChange,
    reorderedListItems,
  } = useReadingListDetail();

  const closeReorder = () => {
    resetReorderedItems();
    setPageActionType(null);
  };

  const { mutate: reorderMutation, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!isOrderChange || !reorderedListItems) {
        return Promise.resolve({
          success: false,
          error: "The order hans't changed.",
        });
      }
      return updateListItemsOrder(listId, reorderedListItems);
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully reordered list items");

        queryClient.setQueryData(
          listItemsQueryKey,
          (oldData?: { listItems: ExtendedReadingListItem[] }) => {
            if (!oldData) return oldData;

            const reorderedMap = new Map(
              reorderedListItems!.map((item, index) => [item.id, index])
            );

            const newListItems = reorderedListItems!.map((item) => ({
              ...oldData.listItems.find((oldItem) => oldItem.id === item.id),
              item_order: reorderedMap.get(item.id) ?? item.item_order,
            }));

            return { listItems: newListItems };
          }
        );

        queryClient.invalidateQueries({ queryKey: listItemsQueryKey });
        closeReorder();
      }
    },
  });

  return (
    <div className="fixed tablet:static bottom-0 w-full tablet:w-fit left-0 bg-white tablet:bg-transparent ">
      <div className="w-full flex justify-center mb-16 mt-8 tablet:m-0 gap-3">
        <Button
          disabled={isUpdating}
          onClick={closeReorder}
          variant={"outline"}
          className="rounded-full font-light border-main-text/60 transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={() => reorderMutation()}
          disabled={!isOrderChange || isUpdating}
          variant={"default"}
          className="rounded-full bg-main-green font-normal transition-colors"
        >
          {isUpdating ? <Spinner /> : "Done"}
        </Button>
      </div>
    </div>
  );
};

export default ListDetailReorderButton;
