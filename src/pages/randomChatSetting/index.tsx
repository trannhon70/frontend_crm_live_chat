import { Button, Input, Popover, Tooltip } from "antd";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { SketchPicker } from 'react-color';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdInsertEmoticon } from "react-icons/md";
import { toast } from "react-toastify";
import { liveChatRandomMessage } from "../../apis/live_chat_random_message.api";
import { CheckRole } from "../../utils";
import UseCheckRole from "../../hooks/useCheckRole";
import { useNavigate } from "react-router-dom";
import LoadingLayout from "../../components/loadingLayout";

const RandomChatSetting: FC = () => {
    const [color, setColor] = useState<any>('#000000');
    const divRef: any = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);
    const [pageSize, setPageSize] = useState<number>(500);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [data, setData] = useState<any>([]);
    const [id, setId] = useState<any>(null);
    const [time, setTime] = useState<number>(5);
    const { role } = UseCheckRole();
    const navigate = useNavigate();

    useEffect(() => {
        if (role && role !== CheckRole.ADMIN) {
            navigate('/');
        }
    }, [role]);

    if (role !== CheckRole.ADMIN) {
        return <LoadingLayout />
    }

    const getPagingChat = async () => {
        const result = await liveChatRandomMessage.getPaging({ pageIndex: pageIndex, pageSize: pageSize })
        setData(result.data);
        setPageIndex(result.pageIndex);
        setPageSize(result.pageSize)
    }

    useEffect(() => {
        getPagingChat()
    }, [pageIndex, pageSize])

    const handleOnBlur = async () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange.current = sel.getRangeAt(0);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onClickSave();
        }
    };
    const saveSelection = async () => {

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange.current = sel.getRangeAt(0);
        }
    };
    const onChangeColor = (e: any) => {
        setColor(e.hex)
    }

    const textColor = useMemo(() => {
        // Xử lý mã màu hex ngắn thành hex đầy đủ
        let hex = color.replace("#", "");
        if (hex.length === 3) {
            hex = hex.split("").map((c: any) => c + c).join("");
        }
        // Chuyển thành giá trị RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Tính độ sáng (brightness) theo chuẩn W3C
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        // Ngưỡng 128 là phổ biến, có thể điều chỉnh
        return brightness > 128 ? "black" : "white";
    }, [color]);

    const onEmojiClick = (event: any) => {
        const emoji = event.emoji;
        const sel = window.getSelection();
        if (savedRange.current) {
            sel?.removeAllRanges();
            sel?.addRange(savedRange.current);
        }
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(emoji);
            range.insertNode(textNode);
            // di chuyển con trỏ sau emoji vừa chèn
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
            // update lại savedRange
            savedRange.current = sel.getRangeAt(0);
        } else if (divRef.current) {
            divRef.current.innerHTML += emoji;
        }
        divRef.current?.focus();
    };


    const onClickSave = async () => {
        if (!divRef.current?.innerHTML) return toast.warning('Dữ liệu không được bỏ trống')
        const body = {
            name: divRef.current?.innerHTML,
            color: color,
            time: time
        }
        if (id) {
            await liveChatRandomMessage.update(id, body).then((_res: any) => {
                toast.success(`Lưu dữ liệu thành công`);
                divRef.current.innerHTML = '';
                setId(null);
                setTime(5)
                getPagingChat();
            }).catch((_error: any) => {
                toast.error(`Lưu dữ liệu không thành công`)
            })

        } else {
            await liveChatRandomMessage.create(body).then((_res: any) => {
                toast.success(`Lưu dữ liệu thành công`);
                divRef.current.innerHTML = '';
                getPagingChat();
            }).catch((_error: any) => {
                toast.error(`Lưu dữ liệu không thành công`)
            })
        }
    }

    const deleteItem = async (value: any) => {
        await liveChatRandomMessage.deletes(value).then((_res: any) => {
            toast.success(`Xóa dữ liệu thành công`);
            getPagingChat()
        }).catch((_error: any) => {
            toast.error(`Xóa dữ liệu không thành công`)
        })
    }

    const onClickEdit = (item: any) => {
        divRef.current.innerHTML = item.name
        setId(item.id)
        setTime(item.time)
    }
    

    const onClickPrev = () => {
        setId(null);
        divRef.current.innerHTML = '';
        setTime(5)
    }

    return <div className="m-auto w-[1000px]">
        <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
            Cài đặt chat random
        </div>
        <div className="mt-3 flex items-end justify-between gap-2 " >
            <div className=" w-[70%]" >
                <div>Nội dung tin nhắn: </div>
                <div
                    ref={divRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={handleOnBlur}
                    onKeyDown={handleKeyDown}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onInput={saveSelection}
                    className="border-gray-300 border w-[100%] h-[40px] p-[5px] overflow-auto focus:outline-gray-400 focus:outline-2 focus:outline-offset-[-1px] text-lg "
                    style={{ color }}

                />
            </div>
            <div>
                <div>Thời gian: </div>
                <Input size="large" type="number" value={time} addonAfter="giây" onChange={(e:any)=> setTime(e.target.value)} />
            </div>
            <Popover
                content={<EmojiPicker width={300} height={400} onEmojiClick={onEmojiClick} />}
                trigger="click"
            >
                <div className="border-gray-300 border w-[100px] h-[40px] flex items-center justify-center text-gray-500 hover:text-gray-600 hover:border-gray-600 cursor-pointer">
                    <MdInsertEmoticon size={25} />
                </div>
            </Popover>
            <Popover content={<SketchPicker color={color} onChange={onChangeColor} />} trigger="click">
                <div style={{ background: color, color: textColor }} className="w-[100px] h-[40px] flex items-center justify-center rounded cursor-pointer " >{color}</div>
            </Popover>

            <Button onClick={onClickSave} size="large" variant="solid" color="primary" >Lưu dữ liệu</Button>
            <Button onClick={onClickPrev} size="large" variant="solid" color="orange" >Quay lại</Button>
        </div>
        <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-7 uppercase">
            Danh sách cài đặt
        </div>
        <div className="h-[70vh] overflow-auto" >
            {
                data.length > 0 ? data.map((item: any, index: number) => {
                    return <div className="flex items-center justify-between gap-2 mt-2" >
                        <div className="flex items-center justify-center border-gray-300 border h-[40px] w-[40px] text-lg " >{index + 1}</div>
                        <div className="border-gray-300 border w-[85%] h-[40px] p-[5px] overflow-auto focus:outline-gray-400 focus:outline-2 focus:outline-offset-[-1px] text-lg "
                            style={{ color: item.color }}
                            dangerouslySetInnerHTML={{ __html: item.name }}
                        ></div>
                        <div className="flex items-center justify-center border-gray-300 border h-[40px] w-[100px] text-lg " >{item.time}s</div>
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                type="primary"
                                size="large"
                                icon={<FaEdit />}
                                onClick={() => onClickEdit(item)}
                            />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Button
                                variant="solid"
                                size="large"
                                color="danger"
                                icon={<MdDelete />}
                                onClick={() => deleteItem(item.id)}
                            />
                        </Tooltip>

                    </div>
                }) : <div className="flex items-center justify-center text-2xl mt-6" >Chưa có dữ liệu</div>
            }
        </div>

    </div>
}

export default RandomChatSetting