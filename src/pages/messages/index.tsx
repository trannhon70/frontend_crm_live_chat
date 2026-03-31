import { Fragment, useCallback, useEffect, useState, type FC } from "react";
import ComponentCardOnlineVisitors from "../../components/card/cardOnlineVisitors";
import { useLocation } from "react-router-dom";
import { Result } from "antd";
import CardHeaderChat from "../../components/card/cardHeaderChat";
import { conversationAPI } from "../../apis/conversation.api";
import CardBodyChatBox from "../../components/card/cardBodyChatBox";
import { messageAPI } from "../../apis/message.api";
import { useChatSocket } from "../../hooks/useChatSocket";
import CardInputChatBox from "../../components/card/cardInputChatBox";
import { SENDER_TYPE } from "../../utils";
import ComponentCardChatList from "../../components/card/cardChatList";
import CardDetailCustomer from "../../components/card/cardDetailCustomer";
import logo from '@/assets/react.svg';

const Messages: FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const conversationId = queryParams.get("conversationId");
    const [conversation, setConversation] = useState<any>(null);
    const [pageSize, setPageSize] = useState<number>(500);
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [data, setData] = useState<any>([]);
    const [active, setActive] = useState<boolean>(true);

    const onNewMessage = useCallback((msg: any) => {
        // Nếu trong Electron, tạo desktop notification
        if (SENDER_TYPE.CUSTOMER === msg.senderType) {
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification("Có 1 tin nhắn mới", {
                    body: `Từ: ${msg.senderName ?? 'Người dùng'}`,
                    icon: logo, // nên là URL tuyệt đối hoặc base64 nếu dùng trong Electron
                });

                notification.onclick = () => {
                    // Gửi 1 sự kiện về main process để "focus" app lại
                    window?.electronAPI?.focusApp?.();
                };
            }
        }
        // Chỉ xử lý nếu đúng conversationId hiện tại
        if (Number(msg.conversationId) === Number(conversationId)) {
            setData((prevData: any[]) => {
                // Kiểm tra nếu msg đã tồn tại (tránh trùng)
                const exists = prevData.some(item => Number(item.id) === Number(msg.id));
                if (exists) return prevData;

                return [...prevData, msg]; // thêm msg vào cuối danh sách
            });
        }
    }, [conversationId]);

    const { sendMessage } = useChatSocket({
        onNewMessage
    });

    const getPagingMessage = async () => {
        const result = await messageAPI.getPaging({ conversationId: conversationId, pageSize: pageSize, pageIndex: pageIndex });
        setData(result.data.data)
        setPageSize(result.data.pageSize)
        setPageIndex(result.data.pageIndex)
    }

    useEffect(() => {
        getPagingMessage()
    }, [pageIndex, pageSize, conversationId])

    const getByIdConversation = async () => {
        const result = await conversationAPI.getById(Number(conversationId))
        setConversation(result.data)
    }

    useEffect(() => {
        if (conversationId) {
            getByIdConversation()
        }
    }, [conversationId])

    const noti = Array.isArray(data) ? data.filter((item: any) => item?.status === false && item?.senderType === SENDER_TYPE.CUSTOMER).length : 0;

    return <Fragment>
        <div className="flex items-center w-full" >
            <div className="w-[22%] bg-white h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto">
                <ComponentCardChatList />
                <ComponentCardOnlineVisitors />
            </div>

            <div className={`${active ? " w-[56%]" : "w-[78%]"}  bg-[#f0f2f5] h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto`} >
                {
                    conversationId ? <Fragment>
                        <CardHeaderChat conversation={conversation} setActive={setActive} active={active} />
                        <CardBodyChatBox data={data} />
                        <CardInputChatBox sendMessage={sendMessage} conversation={conversation} noti={noti} />
                    </Fragment> :
                        <Result
                            status="404"
                            title="404"
                            subTitle="Bạn chưa chọn người chat"
                        />
                }

            </div>

            {
                active && <div className="w-[22%] bg-white h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto" >
                    {
                        conversation ? <CardDetailCustomer conversation={conversation} /> : <Result
                            status="warning"
                            title="404"
                            subTitle="Chưa có dữ liệu "
                        />
                    }

                </div>
            }

        </div>
    </Fragment>
}

export default Messages