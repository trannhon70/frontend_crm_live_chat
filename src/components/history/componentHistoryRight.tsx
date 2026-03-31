import IconButton from "@mui/material/IconButton";
import { Fragment, useEffect, useRef, useState, type FC } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { messageAPI } from "../../apis/message.api";
import { SENDER_TYPE } from "../../utils";
import { renderCustomer, renderStaff } from "../card/cardItemRenderChat";
import moment from "moment";
import { Tabs } from 'antd';
import { TiMessageTyping } from "react-icons/ti";
import { RiChatSettingsLine } from "react-icons/ri";
import CardDetailCustomer from "../card/cardDetailCustomer";
interface Iprops {
    setOpen: any;
    record: any;
}
const ComponentHistoryRight: FC<Iprops> = (props) => {
    const { setOpen, record } = props
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageIndex, _setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(100);
    const [total, setTotal] = useState<number>(0)
    const [data, setData] = useState<any>([]);
    const [card, setCard] = useState<any>('');
    const [active, setActive] = useState<number>(1)

    useEffect(() => {
        setPageSize(10);   // reset mỗi lần đổi record
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [record.id]);

    useEffect(() => {
        const fecthMessage = async () => {
            const result = await messageAPI.getByIdConversation({ pageIndex, pageSize, conversationId: record.id, userId: record.userId });
            setData(result.data.data)
            setCard(result.data.card)
            setTotal(result.data.total)
        }
        if (record) {
            fecthMessage();
        }

    }, [record.id, pageSize, pageIndex])

    // 🔥 Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

            setPageSize((prev) => {
                if (scrollPercent >= 0.7 && prev < total) {
                    return prev + 50;
                }
                return prev;
            });
        };

        const container = containerRef.current;
        container?.addEventListener("scroll", handleScroll);

        return () => container?.removeEventListener("scroll", handleScroll);
    }, [total]); // chỉ phụ thuộc vào total thôi

    const onClickClose = () => {
        setOpen(false)
    }

    const renderMessage = () => {
        return <div ref={containerRef} className=" h-[83vh] overflow-auto " >
            <div className="mt-1"><strong >Thời gian : {moment(record.created_at * 1000).format("DD-MM-YYYY HH:mm:ss")}</strong></div>
            <div className="flex items-center justify-center mt-1" >
                <div
                    className=" rounded  w-[400px] inline-grid"
                    dangerouslySetInnerHTML={{ __html: card?.name }}
                />
            </div>
            {data.length > 0 && data.map((item: any) =>
                item.senderType !== SENDER_TYPE.CUSTOMER
                    ? renderCustomer(item)
                    : renderStaff(item)
            )}
        </div>
    }

    const renderDetail = () => {
        return <div className=" h-[83vh] overflow-auto ">
            <div className="text-lg font-bold" >
                Thông tin chi tiết khách hàng :
            </div>
            <div className="p-2  text-base text-gray-800 space-y-2 w-full max-w-3xl mx-auto">
                <div className="font-semibold text-blue-600">
                    ID vĩnh viễn của khách truy cập: {record?.idComputer}
                </div>
                <div><span className="font-medium">Tên khách truy cập:</span> {record?.name}</div>
                <div>
                    <span className="font-medium">Lần đầu truy cập website: </span>
                    <a href={record?.url} className="text-blue-500 underline break-all">
                        {record?.url}
                    </a>
                </div>
                <div><span className="font-medium">Trang đang truy cập:</span> Giống như trên</div>
                <div><span className="font-medium">Địa chỉ IP:</span> {record?.customerIp}</div>
                <div><span className="font-medium">Vị trí IP:</span> {record?.city}</div>

                <div><span className="font-medium">Thiết bị truy cập:</span> {record?.device}</div>
                <div><span className="font-medium">Hệ điều hành:</span> {record?.os}</div>
                <div><span className="font-medium">Quốc gia:</span> {record?.country}</div>
                <div><span className="font-medium">User-Agent:</span> {record?.userAgent}</div>
                <div><span className="font-medium">Địa chỉ khách hàng:</span> {record?.address ? record?.address : 'khách hàng không chia sẻ'}</div>
            </div>
        </div>
    }
    return <Fragment>
        <div className="bg-[#f0f2f5] shadow-lg rounded p-2 border border-gray-200" >
            <div className="flex items-center justify-between">
                <div className=" flex items-center gap-1" >
                    <span
                        className={`flex items-center text-md px-2 py-1 rounded cursor-pointer ${active === 1 ? "bg-amber-600/80 text-white" : "bg-white text-black"}`}
                        onClick={() => setActive(1)}
                    >
                        <TiMessageTyping size={30} /> Tin nhắn
                    </span>

                    <span
                        className={`flex items-center text-md px-2 py-1 rounded cursor-pointer ${active !== 1 ? "bg-amber-600/80 text-white" : "bg-white text-black"}`}
                        onClick={() => setActive(2)}
                    >
                        <RiChatSettingsLine size={30} /> Chi tiết
                    </span>
                </div>
                <IconButton
                    onClick={onClickClose}
                    color="warning"
                    aria-label="close"
                    sx={{
                        backgroundColor: "rgba(255, 0, 0, 0.1)", // nền mờ đỏ
                        "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 38%)" // đổi khi hover
                        }
                    }}
                >
                    <IoCloseSharp />
                </IconButton>

            </div>
            {
                active === 1 ? renderMessage() : renderDetail()
            }

        </div>
    </Fragment>
}

export default ComponentHistoryRight