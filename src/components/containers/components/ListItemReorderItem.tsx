import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExtendedReadingListItem } from "../../reading-list/ReadingListStoryItem";
import { Button } from "../../ui/button";
import { GripHorizontal } from "lucide-react";

type ListItemReorderItemProps = {
  listItem: ExtendedReadingListItem;
};

const ListItemReorderItem = ({ listItem }: ListItemReorderItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: listItem.id });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
      }}
      className="py-6 m-[5px] rounded-none  cursor-grab border-b-[1px] border-b-gray-200"
    >
      <div className="w-full flex justify-between items-center">
        <p className="text-normal line-clamp-1">{listItem.title}</p>
        <Button variant={"ghost"} size={"icon"} className="">
          <GripHorizontal
            strokeWidth={2}
            className="stroke-main-text !w-4 !h-4"
          />
        </Button>
      </div>
    </li>
  );
};

export default ListItemReorderItem;
