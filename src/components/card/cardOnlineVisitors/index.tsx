import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, type FC } from "react";
import { AiFillCloseSquare, AiTwotoneAudio } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import { conversationAPI } from "../../../apis/conversation.api";
import CardUserInfoNode from "../cardUserInfoNode";
import { useChatSocket } from '../../../hooks/useChatSocket';
import { useLocation } from 'react-router-dom';
import _ from "lodash";
import { Button } from 'antd';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 10,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,

    },
}));

function ExpandIcon(props: React.PropsWithoutRef<typeof IoAddCircleSharp>) {
    return <IoAddCircleSharp {...props} className="opacity-80 text-[#0f447d] " />;
}

function CollapseIcon(props: React.PropsWithoutRef<typeof AiFillCloseSquare>) {
    return <AiFillCloseSquare {...props} className="opacity-80 text-red-600" />;
}

function EndIcon(props: React.PropsWithoutRef<typeof AiTwotoneAudio>) {
    return <AiTwotoneAudio {...props} className="opacity-70" />;
}
interface IProps {

}
const ComponentCardOnlineVisitors: FC<IProps> = (props) => {
    const { } = props
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const conversationId = queryParams.get("conversationId");
    const [pageSize, setPageSize] = useState<number>(200);
    const [pageIndex, _setPageIndex] = useState<number>(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-all-conversation", pageIndex, pageSize],
        queryFn: () => conversationAPI.getAll({ pageIndex, pageSize }),
        placeholderData: keepPreviousData,
    });

    const onNewConversation = useCallback((msg: any) => {
        queryClient.setQueryData(
            ["get-all-conversation", pageIndex, pageSize],
            (oldData: any) => {
                if (!oldData) {
                    return { data: [msg], total: 1, pageIndex, pageSize };
                }

                const idToMatch = Number(msg?.id);

                // clone mảng cũ để không mutate trực tiếp
                const newData = [...oldData.data];
                const idx = newData.findIndex((item) => Number(item.id) === idToMatch);

                if (idx !== -1) {
                    // ✅ nếu đã tồn tại → chỉ update field online hoặc merge msg
                    newData[idx] = { ...newData[idx], ...msg };
                } else {
                    // ✅ nếu chưa có → thêm mới (có thể push cuối hoặc unshift đầu tuỳ UI)
                    newData.unshift(msg); // thêm đầu
                }

                return {
                    ...oldData,
                    data: newData,
                };
            }
        );
    }, [queryClient, pageIndex, pageSize]);


    const { } = useChatSocket({
        onNewConversation,
        onNewMessage(msg) {
            queryClient.setQueryData(
                ["get-all-conversation", pageIndex, pageSize],
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    const conversations = Array.isArray(oldData.data) ? oldData.data : [];

                    const convIndex = conversations.findIndex(
                        (c: any) => Number(c.id) === Number(msg.conversationId)
                    );
                    if (convIndex === -1) return oldData; // không có thì bỏ qua

                    const targetConv = conversations[convIndex];

                    // tránh thêm trùng tin nhắn
                    const exists = targetConv.message?.some((m: any) => m.id === msg.id);
                    if (exists) return oldData;

                    const newMessages = [
                        ...(Array.isArray(targetConv.message) ? targetConv.message : []),
                        msg,
                    ];

                    const newConversations = [...conversations];
                    newConversations[convIndex] = { ...targetConv, message: newMessages };

                    return { ...oldData, data: newConversations };
                }
            );
        },
        onNewMessageStatus(msgList) {
            const m = Array.isArray(msgList) ? msgList[0] : msgList;

            queryClient.setQueryData(
                ["get-all-conversation", pageIndex, pageSize],
                (oldData: any) => {
                    if (!oldData?.data) return oldData;

                    const conversations = Array.isArray(oldData.data) ? oldData.data : [];

                    // tìm index của conversation cần update
                    const convIndex = conversations.findIndex(
                        (item: any) => Number(item.id) === Number(m?.conversationId)
                    );
                    if (convIndex === -1) return oldData;

                    const targetConv = conversations[convIndex];
                    const msgIndex = targetConv.message.findIndex(
                        (mes: any) => mes.id === m.id
                    );
                    if (msgIndex === -1) return oldData;

                    // clone đúng chỗ cần thiết
                    const newMessages = [...targetConv.message];
                    newMessages[msgIndex] = { ...newMessages[msgIndex], status: m.status };

                    const newConversations = [...conversations];
                    newConversations[convIndex] = { ...targetConv, message: newMessages };

                    return { ...oldData, data: newConversations };
                }
            );
        }
    });

    const onlineUsers = useMemo(() => {
        return data?.data?.filter((item: any) => item?.online && item?.userId === null) || [];
    }, [data?.data]);

    const offlineUsers = useMemo(() => {
        return data?.data?.filter((item: any) => !item?.online) || [];
    }, [data?.data]);

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (isError) return <div>Có lỗi xảy ra khi tải dữ liệu</div>;

    const onClickSee = () => {
        setPageSize((prev: any) => prev + 100)
    }
    return <>
        <SimpleTreeView
            aria-label="customized"
            defaultExpandedItems={['1a', '2b', `3c`]}
            selectedItems={conversationId?.toString()}
            slots={{
                expandIcon: ExpandIcon,
                collapseIcon: CollapseIcon,
                endIcon: EndIcon,

            }}
            sx={{ overflowX: 'hidden', flexGrow: 1, width: "100%" }}
        >
            <CustomTreeItem itemId="1a" label="khách truy cập trực tuyến">
                <CustomTreeItem itemId="2b" label="Đang online">
                    {
                        onlineUsers.length > 0 && onlineUsers.map((item: any, index: number) => {
                            if (!item || item.id === undefined || item.id === null) return null;
                            return <CustomTreeItem key={item.id} itemId={item.id.toString()} label={<CardUserInfoNode item={item} index={index} status='false' />} />
                        })
                    }
                </CustomTreeItem>
                <CustomTreeItem itemId="3c" label="Đang offline">
                    {
                        offlineUsers.length > 0 && offlineUsers.map((item: any, index: number) => {
                            if (!item || item.id === undefined || item.id === null) return null;
                            return <CustomTreeItem key={item.id} itemId={item.id.toString()} label={<CardUserInfoNode item={item} index={index} status='false' />} />
                        })
                    }
                </CustomTreeItem>
            </CustomTreeItem>
        </SimpleTreeView>
        {
            pageSize < data.total && <div className='flex items-center justify-end mx-4 my-3' ><Button onClick={onClickSee} style={{ width: '80%' }} >Xem thêm</Button></div>
        }

    </>

}

export default ComponentCardOnlineVisitors