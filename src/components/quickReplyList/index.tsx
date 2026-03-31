import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import { Fragment, useEffect, useState, type FC } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { replyListAPI } from "../../apis/reply_list.api";
import { toast } from "react-toastify";
import { useChatSocket } from "../../hooks/useChatSocket";
import { SENDER_TYPE } from "../../utils";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface IProps {
    conversation?: any
}
const QuickReplyList: FC<IProps> = (props) => {
    const { conversation } = props
    const [pageIndex, _setPageIndex] = useState<number>(1);
    const [pageSize, _setPageSize] = useState(500)
    const [data, setData] = useState<any>([
        { id: 1, name: 'xin chào' },
    ])
    const [value, setValue] = useState<any>("");
    const [id, setId] = useState<any>("");
    const { sendMessage } = useChatSocket({});
    const users = useSelector((state: RootState) => state.users);

    const getPaging = async () => {
        const result = await replyListAPI.getPaging({ pageSize: pageSize, pageIndex: pageIndex });
        setData(result.data.data)
    }

    useEffect(() => {
        getPaging()
    }, [pageSize, pageIndex])

    const onChangeValue = (e: any) => {
        setValue(e.target.value)
    }

    const onClickEdit = (e: any, item: any) => {
        e.stopPropagation();
        setValue(item.name)
        setId(item.id)
    }
    const onClickSave = () => {
        if (id) {
            replyListAPI.update({ name: value, id: id }).then((_res: any) => {
                toast.success(`Lưu thành công!`)
                setValue("");
                setId("");
                getPaging()
            }).catch((_err: any) => {
                toast.error(` Lưu không thành công! `)
            })
        } else {
            replyListAPI.create({ name: value }).then((_res: any) => {
                toast.success(`Lưu thành công!`)
                setValue("");
                getPaging()
            }).catch((_err: any) => {
                toast.error(` Lưu không thành công! `)
            })
        }

    }

    const onClickDelete = (e: any, item: any) => {
        e.stopPropagation();
        replyListAPI.deleteReply(item.id).then((_res: any) => {
            toast.success(`Xóa thành công!`);
            getPaging()
        }).catch((_err: any) => {
            toast.error(` Xóa không thành công! `)
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Ngăn không cho xuống dòng
            onClickSave()
        }
    };

    const onClickSendMessage = (item: any) => {
        sendMessage({
            senderType: SENDER_TYPE.STAFF,
            content: item.name,
            userId: users?.user?.id,
            idComputer: conversation.idComputer,
            gclid: conversation.gclid,
        })
    }
    return <Fragment>
        <div className="flex items-center justify-between gap-2 mt-2" >
            <TextField
                value={value}
                onChange={onChangeValue}
                className="w-[80%]" id="outlined-basic" label="Nhập câu trả lời" variant="outlined" size="small"
                InputLabelProps={{
                    shrink: true, // 👈 ép label nhảy lên khi có value
                }}
                onKeyDown={handleKeyDown}
            />
            <Button onClick={onClickSave} size="medium" variant="contained">Lưu</Button>
        </div>
        <div className="h-[80vh] overflow-auto mt-2" >
            {
                data.length > 0 && data.map((item: any, index: number) => {
                    return <div onClick={() => onClickSendMessage(item)} key={item.id} className="flex items-center gap-1 px-1 py-1 bg-amber-100 hover:bg-amber-400 mt-1 cursor-pointer border-b-white " >
                        <div className="w-[7%]" >{index + 1}.</div>
                        <div className="w-[70%]">{item.name}</div>
                        <div className="flex items-center justify-between gap-1" >
                            <Fab onClick={(e: any) => onClickEdit(e, item)} variant="extended" size="small" color="success">
                                <FaEdit />
                            </Fab>
                            <Fab onClick={(e: any) => onClickDelete(e, item)} variant="extended" size="small" color="error">
                                <MdDelete />
                            </Fab>
                        </div>
                    </div>
                })
            }


        </div>
    </Fragment>
}

export default QuickReplyList