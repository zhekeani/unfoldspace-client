import { useEffect, useState } from "react";
import { useReadingListDetail } from "../../context/ReadingListDetailContext";
import { ExtendedReadingListItem } from "../../reading-list/ReadingListStoryItem";
import { Checkbox } from "../../ui/checkbox";

type ListItemsRemoveContainerProps = {
  listItems: ExtendedReadingListItem[];
};

const ListItemsRemoveContainer = ({
  listItems,
}: ListItemsRemoveContainerProps) => {
  const [itemsToRemove, setItemsToRemove] = useState<
    { listItem: ExtendedReadingListItem; isChecked: boolean }[]
  >(listItems.map((item) => ({ listItem: item, isChecked: false })));

  const { setItemsToRemove: setSelectedItemsToRemove } = useReadingListDetail();

  useEffect(() => {
    setSelectedItemsToRemove(
      itemsToRemove
        .filter((item) => item.isChecked)
        .map((item) => item.listItem)
    );
  }, [itemsToRemove, setSelectedItemsToRemove]);

  const handleCheckedChange = (id: string, isChecked: boolean) => {
    setItemsToRemove((prev) =>
      prev.map((prevItem) =>
        prevItem.listItem.id === id ? { ...prevItem, isChecked } : prevItem
      )
    );
  };

  return (
    <div className="mx-5">
      <ul className="flex flex-col gap-1">
        {itemsToRemove.map((item) => (
          <li
            key={item.listItem.id}
            className="w-full py-6 flex gap-3 items-center border-b-[1px] border-b-gray-200"
          >
            <Checkbox
              className="cursor-pointer disabled:cursor-none disabled:opacity-100 data-[state=checked]:bg-main-green data-[state=checked]:border-none rounded-none border-gray "
              checked={item.isChecked}
              onCheckedChange={(isChecked) =>
                handleCheckedChange(item.listItem.id, !!isChecked)
              }
            />

            <p className="text-base">{item.listItem.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListItemsRemoveContainer;
