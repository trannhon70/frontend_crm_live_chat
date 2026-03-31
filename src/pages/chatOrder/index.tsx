import { Fragment, useEffect, useState, type FC } from "react";
import LoadingLayout from "../../components/loadingLayout";
import UseCheckRole from "../../hooks/useCheckRole";
import { useNavigate } from "react-router-dom";
import { CheckRole } from "../../utils";
import { userAPI } from "../../apis/user.api";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Item } from "./sortable_item";
import Container from "./container";
import { Button } from "antd";
import { toast } from "react-toastify";


const wrapperStyle: any = {
    display: "flex",
    flexDirection: "row",
    marginTop:'15px'
};

const ChatOrder: FC = () => {
    const { role } = UseCheckRole();
    const navigate = useNavigate();
    const [items, setItems] = useState<any>({
        root: [],
    });
    const [activeId, setActiveId] = useState<any>();

    useEffect(() => {
        if (role && role !== CheckRole.ADMIN) {
            navigate('/');
        }
    }, [role]);

    if (role !== CheckRole.ADMIN) {
        return <LoadingLayout />
    }

    const getAllTuVan = async () => {
        const result = await userAPI.getAllTuVan();
        setItems((prev: any) => ({
            ...prev,
            root: result.sort((a:any, b:any) => Number(a.order) - Number(b.order)),
        }));
    }

    useEffect(() => {
        getAllTuVan()
    }, [])



    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function findContainer(id: string) {
        return Object.keys(items).find((key) =>
            items[key].some((item: any) => item.id === id)
        );
    }

    function handleDragStart(event: any) {
        const { active } = event;
        const { id } = active;
        setActiveId(id);
    }

    function handleDragOver(event: any) {
        const { active, over, draggingRect } = event;
        const { id } = active;
        const { id: overId } = over;

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev: any) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            // Find the indexes for the items
            const activeIndex = activeItems.findIndex((item: any) => item.id === id);
            const overIndex = overItems.findIndex((item: any) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem =
                    over &&
                    overIndex === overItems.length - 1 &&
                    draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item: any) => item !== active.id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        const { id } = active;
        const { id: overId } = over;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);
        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            return;
        }

        const activeIndex = items[activeContainer].findIndex((item: any) => item.id === active.id);
        const overIndex = items[overContainer].findIndex((item: any) => item.id === overId);

        if (activeIndex !== overIndex) {
            setItems((items: any) => ({
                ...items,
                [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
            }));
        }

        setActiveId(null);
    }
    
    const onclickSave = () =>{
        const body = items['root'].map((item:any, index: number) =>{
            return {
                order: index + 1,
                userId: item.id,
                fullName: item.fullName
            }
        })
        userAPI.updateOrder(body).then((_res : any) =>{
            toast.success(`Cập nhật thành công!`)
        }).catch((__err: any)=>{
            console.log(__err);
            
            toast.error(`Cập nhật không thành công!`)
        })
    }
    return <Fragment>
        <div className="w-[1000px] m-auto" >
            <div className="flex items-center justify-between text-3xl font-bold text-[#0f447d] mt-2 uppercase">
                Danh sách thứ tự nhận chat của tư vấn 
                <Button onClick={onclickSave} variant="solid" color="green" size="middle" className="w-[100px]" >Lưu</Button>
            </div>
            <div style={wrapperStyle}>
                <DndContext
                    // announcements={defaultAnnouncements}
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <Container id="root" items={items.root} />
                    <DragOverlay>{activeId ? <Item item={items['root'].find((item: any) => item.id === activeId)} /> : null}</DragOverlay>
                </DndContext>
            </div>

        </div>

    </Fragment>
}



export default ChatOrder