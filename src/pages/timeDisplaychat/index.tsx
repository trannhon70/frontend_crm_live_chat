import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LiveChatTimeAPI } from "../../apis/live_chat_time";
import LoadingLayout from "../../components/loadingLayout";
import UseCheckRole from "../../hooks/useCheckRole";
import { CheckRole } from "../../utils";


const TimeDisplayChat: FC = () => {
    const { role } = UseCheckRole();
    const navigate = useNavigate();
    const [data, setData] = useState<any>([
        { id: 1, time: 0 },
        { id: 2, time: 0 }
    ])

    useEffect(() => {
        if (role && role !== CheckRole.ADMIN) {
            navigate('/');
        }
    }, [role]);

    if (role !== CheckRole.ADMIN) {
        return <LoadingLayout />
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await LiveChatTimeAPI.getAll();
                if (res.data.length > 0) {
                    setData(res.data)
                }
            } catch (error) {
                console.error("Lỗi fetch:", error);
            }
        };

        fetchData();
    }, [])

    const onChangeTime = (id: any, event: any) => {
        setData((prev: any) =>
            prev.map((item: any) =>
                item.id === id ? { ...item, time: event.target.value } : item
            )
        );
    }

    const onClickSave = () => {
        LiveChatTimeAPI.create(data).then((_res: any) => {
            toast.success('Lưu dữ liệu thành công!')
        }).catch((_err: any) => {
            toast.error('Lưu dữ liệu không thành công!')
        })
    }

    return <div className="max-w-[800px] mx-auto mt-10">
        {/* Title */}
        <div className="text-center text-3xl font-extrabold text-[#0f447d] uppercase tracking-wide">
            Cài đặt thời gian hiển thị popup
        </div>

        {/* Card */}
        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between text-lg py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Hiển thị lần đầu</span>
                <span className="text-[#0f447d] font-bold">
                    <TextField
                        id="outlined-basic" label="giây" variant="outlined"
                        value={data[0].time}
                        onChange={(e: any) => onChangeTime(data[0].id, e)}
                        type="number"
                    />
                </span>
            </div>
            <div className="flex items-center justify-between text-lg py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Hiển thị các lần về sau</span>
                <span className="text-[#0f447d] font-bold">
                    <TextField
                        id="outlined-basic" label="giây" variant="outlined"
                        value={data[1].time}
                        onChange={(e: any) => onChangeTime(data[1].id, e)}
                        type="number"
                    />
                </span>
            </div>

            {/* Save button */}
            <div className="flex justify-center mt-6">
                <Button onClick={onClickSave} variant="contained">Lưu</Button>
            </div>
        </div>
    </div>
}

export default TimeDisplayChat