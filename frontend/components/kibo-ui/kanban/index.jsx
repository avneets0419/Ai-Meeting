"use client";;
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const t = tunnel();

const KanbanContext = createContext({
  columns: [],
  data: [],
  activeCardId: null,
});

export const KanbanBoard = ({
  id,
  children,
  className,
  shadowColor = "rgba(0,0,0,0.9)", // default color
}) => {
  // 🧩 make this column droppable
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md text-xs shadow-inner ring-2 transition-all bg-gray-50 dark:bg-neutral-900",
        isOver ? "ring-primary" : "ring-transparent",
        className
      )}
      style={{
        position: "relative",
      }}
    >
      {/* Inner circular gradient shadow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{
          background: `radial-gradient(circle at bottom right, ${shadowColor}, transparent 30%)`,
          mixBlendMode: "multiply",
        }}
      />
      {children}
    </div>
  );
};











export const KanbanCard = (
  {
    id,
    name,
    children,
    className
  }
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div style={style} {...listeners} {...attributes} ref={setNodeRef} >
        <Card
          className={cn(
            "cursor-grab gap-4 rounded-md p-3 shadow-sm h-20",
            isDragging && "pointer-events-none cursor-grabbing opacity-30",
            className
          )}>
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              "cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary",
              isDragging && "cursor-grabbing",
              className
            )}>
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export const KanbanCards = (
  {
    children,
    className,
    ...props
  }
) => {
  const { data } = useContext(KanbanContext);
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div className={cn("flex flex-grow flex-col gap-2 p-2", className)} {...props}>
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export const KanbanHeader = ({
  className,
  ...props
}) => (
  <div className={cn("m-0 p-2 font-semibold text-sm ", className)} {...props} />
);

export const KanbanProvider = (
  {
    children,
    onDragStart,
    onDragEnd,
    onDragOver,
    className,
    columns,
    data,
    onDataChange,
    ...props
  }
) => {
  const [activeCardId, setActiveCardId] = useState(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragStart = (event) => {
    const card = data.find((item) => item.id === event.active.id);
    if (card) {
      setActiveCardId(event.active.id);
    }
    onDragStart?.(event);
  };

  // replace existing handleDragOver with this
const handleDragOver = (event) => {
  const { active, over } = event;

  if (!over) return;

  const activeItem = data.find((item) => item.id === active.id);
  const overItem = data.find((item) => item.id === over.id);

  if (!activeItem) return;

  const activeColumn = activeItem.column;
  const overColumn =
    overItem?.column ||
    columns.find((col) => col.id === over.id)?.id ||
    columns[0]?.id;

  if (activeColumn !== overColumn) {
    let newData = [...data];
    const activeIndex = newData.findIndex((item) => item.id === active.id);
    const overIndex = newData.findIndex((item) => item.id === over.id);

    // update column and order
    newData[activeIndex].column = overColumn;
    newData = arrayMove(newData, activeIndex, overIndex);

    // metadata so consumers know exactly what moved
    const meta = {
      movedItem: activeItem,
      fromColumnId: activeColumn,
      toColumnId: overColumn,
      fromIndex: activeIndex,
      toIndex: overIndex,
      triggeredBy: "dragOver",
    };

    onDataChange?.(newData, meta);
  }

  onDragOver?.(event);
  console.log("🧠 activeColumn:", activeColumn, "over.id:", over.id, "→ resolved overColumn:", overColumn);
};

  // replace existing handleDragEnd with this
const handleDragEnd = (event) => {
  setActiveCardId(null);
  onDragEnd?.(event);

  const { active, over } = event;
  if (!over || active.id === over.id) return;

  let newData = [...data];

  const oldIndex = newData.findIndex((item) => item.id === active.id);
  const newIndex = newData.findIndex((item) => item.id === over.id);

  const activeItem = newData[oldIndex];
  const oldColumn = activeItem?.column;
  const newColumn =
    newData[newIndex]?.column ||
    columns.find((col) => col.id === over.id)?.id ||
    oldColumn;

  // set column if it changed and reorder
  newData[oldIndex].column = newColumn;
  newData = arrayMove(newData, oldIndex, newIndex);

  const meta = {
    movedItem: activeItem,
    fromColumnId: oldColumn,
    toColumnId: newColumn,
    fromIndex: oldIndex,
    toIndex: newIndex,
    triggeredBy: "dragEnd",
  };

  onDataChange?.(newData, meta);
};


  const announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};

      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};

      return `Cancelled dragging the card "${name}"`;
    },
  };

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}>
        <div
          className={cn("grid size-full auto-cols-fr grid-flow-col gap-4", className)}>
          {columns.map((column) => children(column))}
        </div>
        {typeof window !== "undefined" &&
          createPortal(<DragOverlay>
            <t.Out />
          </DragOverlay>, document.body)}
      </DndContext>
    </KanbanContext.Provider>
  );
};
