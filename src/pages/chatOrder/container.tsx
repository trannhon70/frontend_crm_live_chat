import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableItem from "./sortable_item";




export default function Container(props: any) {
  const { id, items } = props;

  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items.map((item: any) => item.id)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={{
        background: "#dadada",
        padding: 10,
        
        flex: 1,
        height:'85vh',
        overflow:'auto'
      }}>
        {items.map((item: any, index: number) => (
          <SortableItem key={item.id} item={item} index={index + 1} />
        ))}
      </div>
    </SortableContext>
  );
}