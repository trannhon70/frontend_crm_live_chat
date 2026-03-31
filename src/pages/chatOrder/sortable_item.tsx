import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Item(props: any) {
  const { item, index } = props;
  

  return <div className="flex p-3 bg-[#0f447d] mb-1 text-white text-lg gap-2 cursor-pointer rounded ">
        {index}. {item?.fullName} - {item?.email}
    </div>;
}

export default function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item item={props.item} index={props.index}/>
    </div>
  );
}
