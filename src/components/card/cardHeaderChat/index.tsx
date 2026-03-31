import { Button, Select, Tag, Tooltip } from "antd";
import React, { useEffect, type FC } from "react";
import { IoPricetagOutline } from "react-icons/io5";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import { labelAPI } from "../../../apis/label.api";
import { conversationAPI } from "../../../apis/conversation.api";
import { toast } from "react-toastify";

interface Iprops {
    conversation?: any;
    setActive: any;
    active: any
}
const CardHeaderChat: FC<Iprops> = (props) => {
    const { conversation, setActive, active } = props
    const { copy } = useCopyToClipboard();
    const [label, setLabel] = React.useState<any>([]);
    const [idLabel, setIdLabel] = React.useState<number>()

    const getAllLabel = async () => {
        const result = await labelAPI.getAll();
        setLabel(result.data);
    }

    useEffect(() => {
        getAllLabel()
    }, [])

    const onClickDetail = () => {
        setActive((prev: any) => !prev);
    }

    const onClickCopy = () => {
        copy(`${conversation.url}`)
    }

    const handleChangeSelect = (value: any) => {
        setIdLabel(value ? value : undefined)
        conversationAPI.updateLabel({
            labelId: value ? value : null,
            conversationId: conversation.id
        }).then(() => {
            toast.success(`Cập nhật thành công!`);
        }).catch((err: any) => {
            console.log(err);
        })
    }
    return <div className="p-3 h-[7vh] bg-white flex justify-between items-center  " >
        <div>
            <div className="flex items-center gap-1" >
                <div className="text-base text-gray-500" >
                    Trang web
                </div>
                <MdOutlineNavigateNext size={20} />
                <Tooltip title="copy">
                    <div
                        onClick={onClickCopy}
                        className="whitespace-nowrap overflow-hidden text-ellipsis w-[400px] underline cursor-pointer"
                    >
                        {conversation?.url}
                    </div>
                </Tooltip>

            </div>
            <div className="mt-1" >
                <Tag>
                    <div className="flex items-center gap-1 cursor-pointer " >
                        Label <IoPricetagOutline />
                    </div>
                </Tag>
                <Select
                    size="small"
                    placeholder="Chọn label"
                    allowClear
                    value={idLabel ? idLabel : conversation?.labelId}
                    style={{ width: "40%" }}
                    onChange={(e: any) => handleChangeSelect(e)}
                    options={label.length > 0 && label.map((item: any) => {
                        return {
                            label: (
                                <span style={{ color: item.color || "black" }}>
                                    {item.name}
                                </span>
                            ),
                            value: item.id
                        }
                    })}
                />
            </div>
        </div>
        <div >
            <Button onClick={onClickDetail} variant="solid" color="green" >{active ? "Ẩn chi tiết" : "Hiện chi tiết"} </Button>
        </div>
    </div >
}

export default CardHeaderChat