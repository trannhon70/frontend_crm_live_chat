import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { Fragment, useCallback, useEffect, useState, type FC } from "react";
import { AiFillCloseSquare, AiTwotoneAudio } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import { friendAPI } from "../../../apis/friend.api";
import { useChatSocket } from '../../../hooks/useChatSocket';
import CardUserInfoNode from "../cardUserInfoNode";
import { IoMdSettings } from "react-icons/io";
import { Popover } from 'antd';
import { PiDotFill } from "react-icons/pi";
import { userAPI } from '../../../apis/user.api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { CheckRole } from '../../../utils';

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
const ComponentCardChatList: FC<IProps> = (props) => {
    const [data, setData] = useState<any>([]);
    const users = useSelector((state: RootState) => state.users);

    const onNewConversation = useCallback((msg: any) => {
        setData((prevData: any) => {
            // ✅ clone data để tránh tham chiếu lẫn nhau
            return prevData.map((item: any) => {
                const isOtherUser = Number(item.id) !== Number(msg.userId);
                if (isOtherUser) {
                    return { ...item }; // clone để đảm bảo ko dùng chung tham chiếu
                }

                const existingIndex = item.conversation?.findIndex(
                    (con: any) => Number(con.id) === Number(msg.id)
                );

                let updatedConversations;
                if (existingIndex !== -1) {
                    // ✅ update msg cũ
                    updatedConversations = item.conversation.map((con: any, idx: number) =>
                        idx === existingIndex ? { ...con, ...msg } : { ...con }
                    );
                } else {
                    // ✅ thêm msg mới (clone conversation để chắc chắn ko dùng chung)
                    updatedConversations = [...(item.conversation || []).map((c: any) => ({ ...c })), { ...msg }];
                }

                return {
                    ...item,
                    conversation: updatedConversations,
                };
            });
        });
    }, []);

    const onNewUserOnline = useCallback((msg: any) => {
        setData((prevData: any) => {
            return prevData.map((item: any) => {
                if (Number(item.id) === Number(msg.id)) {
                    return { ...item, online: msg.online };
                }
                return item;
            })
        })
    }, [])

    const onNewMessage = useCallback((msg: any) => {
        setData((prevData: any[]) => {
            return prevData.map((userItem: any) => {
                if (!userItem.conversation) return userItem;
                const updatedConversations = userItem.conversation.map((conv: any) => {
                    if (Number(conv.id) !== Number(msg.conversationId)) return conv;
                    return {
                        ...conv,
                        message: [...(Array.isArray(conv.message) ? conv.message : []), msg]
                    };
                });
                return {
                    ...userItem,
                    conversation: updatedConversations,
                };
            });
        });
    }, []);
    const { } = useChatSocket({
        onNewConversation,
        onNewUserOnline,
        onNewMessage,
        onNewMessageStatus(msg) {
            setData((prevData: any[]) => {
                return prevData.map((userItem: any) => {
                    if (!userItem.conversation) return userItem;
                    const updatedConversations = userItem.conversation.map((conv: any) => {
                        if (Number(conv?.id) !== Number(msg[0]?.conversationId)) return conv;
                        return {
                            ...conv,
                            message: msg
                        };
                    });
                    return {
                        ...userItem,
                        conversation: updatedConversations,
                    };
                });
            });

        }
    })

    const getAllFriendUser = async () => {
        const result = await friendAPI.getAllFriendUser()
        setData(result.data)
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                getAllFriendUser();
            }
        };

        // Gọi lần đầu khi component mount
        getAllFriendUser();

        // Lắng nghe khi chuyển tab
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Tạo interval gọi API mỗi 60 giây
        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                getAllFriendUser();
            }
        }, 60000); // 60s

        // Cleanup khi component unmount
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(intervalId);
        };
    }, []);

    const { activeUser, activeMessage } = data.reduce(
        (acc: { activeUser: string[]; activeMessage: string[] }, item: any) => {
            acc.activeUser.push(`${item.id}_a`);
            acc.activeMessage.push(`${item.id}_b`);
            return acc;
        },
        { activeUser: [], activeMessage: [] }
    );

    const content = (item: any) => {
        const handleClick = (e: React.MouseEvent, online: boolean) => {
            e.stopPropagation();
            const body = { id: item.id, online };
            userAPI.updateOnline(body).then((_res: any) => {
                toast.success(` Cập nhật thành công! `)
            }).catch((_err: any) => {
                toast.warning(` Cập nhật không thành công! `)
            })
        };

        const options = [
            { label: "Online", color: "#2a8237", value: true },
            { label: "Offline", color: "red", value: false },
        ];

        return (
            <div>
                {options.map((opt) => (
                    <div
                        key={opt.label}
                        onClick={(e) => handleClick(e, opt.value)}
                        className="flex gap-1 items-center hover:bg-gray-200 py-1 cursor-pointer text-md"
                    >
                        <PiDotFill color={opt.color} size={20} /> {opt.label}
                    </div>
                ))}
            </div>
        );
    };
    return <Fragment>
        {
            data.length > 0 &&
            <SimpleTreeView
                aria-label="customized"
                defaultExpandedItems={['1', ...activeUser, ...activeMessage]}

                // selectedItems={conversationId?.toString()}
                slots={{
                    expandIcon: ExpandIcon,
                    collapseIcon: CollapseIcon,
                    endIcon: EndIcon,

                }}
                sx={{ overflowX: 'hidden', flexGrow: 1, width: "100%" }}
            >
                <CustomTreeItem itemId="1" label="Danh sách trò chuyện">
                    {
                        data.length > 0 && data.map((item: any, _index: number) => {
                            return <CustomTreeItem key={`${item.id}_a`} itemId={`${item.id}_a`} label={
                                <div className='flex items-center justify-between' >
                                    <div>
                                        {item.fullName} {item.online ? <span className="text-green-700" >(online)</span> : <span className="text-red-700" >(offline)</span>}
                                    </div>
                                    {
                                        [CheckRole.ADMIN, CheckRole.QUANLY].includes(users.user?.role?.id) &&
                                        <Popover content={content(item)} title="Cài đặt" trigger="hover">
                                            <IoMdSettings size={20} />
                                        </Popover>
                                    }
                                </div>
                            }>
                                <CustomTreeItem itemId={`${item.id}_b`} label="Trò chuyện">
                                    {
                                        item.conversation.length > 0 && item.conversation.filter((ite: any) => ite.online === true).map((con: any, mesIndex: number) => {
                                            return <CustomTreeItem
                                                key={`${item.id}_${con.id}_${mesIndex}`}
                                                itemId={`${item.id}_${con.id}_${mesIndex}`}
                                                label={<CardUserInfoNode item={con} index={mesIndex} status='true' />} />
                                        })
                                    }
                                </CustomTreeItem>
                            </CustomTreeItem>
                        })
                    }
                </CustomTreeItem>
            </SimpleTreeView>
        }
    </Fragment>
}

export default ComponentCardChatList