import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { ExtendedReadingListItem } from "../../reading-list/ReadingListStoryItem";
import ListItemReorderItem from "./ListItemReorderItem";
import { useReadingListDetail } from "../../context/ReadingListDetailContext";

type ListItemsReorderContainerProps = {
  listItems: ExtendedReadingListItem[];
};

const ListItemsReorderContainer = ({
  listItems,
}: ListItemsReorderContainerProps) => {
  const { setReorderedItems } = useReadingListDetail();
  const [items, setItems] = useState<ExtendedReadingListItem[]>(listItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id == active.id);
    const newIndex = items.findIndex((item) => item.id == over.id);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  useEffect(() => {
    setReorderedItems(
      items.map((item) => ({ id: item.id, item_order: item.item_order }))
    );
  }, [items, setReorderedItems]);

  return (
    <div className="flex-1 ">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="mx-5">
            {items.map((item) => (
              <ListItemReorderItem key={item.id} listItem={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ListItemsReorderContainer;
