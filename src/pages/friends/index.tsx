import { Button, Checkbox, Input } from "antd";
import { useEffect, useState, type FC } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { friendAPI } from "../../apis/friend.api";
import { userAPI } from "../../apis/user.api";

const Friend: FC = () => {
    const [data, setData] = useState<any>([])
    const [pageSize, setPageSize] = useState<number>(500);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [searchFrirend, setSearchFrirend] = useState<string>('');
    const [active, setActive] = useState<number>(0);
    const [user, setUser] = useState<any>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    const getPagingUser = async () => {
        const result = await userAPI.getPagingNoDelete({ pageSize: pageSize, pageIndex: pageIndex, search: search });
        setData(result.data);
        setPageIndex(result.pageIndex);
        setPageSize(result.pageSize);
    }

    useEffect(() => {
        getPagingUser()
    }, [pageSize, pageIndex, search])

    const getPagingUserFriend = async (active: number) => {
        const result = await userAPI.getPagingUserFriend({ pageSize: 500, pageIndex: 1, userId: active, search: searchFrirend });
        setUser(result.data);

    }

    useEffect(() => {
        getPagingUserFriend(active)
    }, [searchFrirend])


    const onClickActive = async (value: any) => {
        await setActive(value);
        await getPagingUserFriend(value);
        await setSelectedUserIds([]);
        await getAllByIdUser(value)

    }

    const handleToggle = (userId: number) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId); // uncheck
            } else {
                return [...prev, userId]; // check
            }
        });
    };

    const onClickAddFriend = () => {
        const body = {
            friend: selectedUserIds,
            userId: active
        }
        friendAPI.create(body).then((_res: any) => {
            toast.success('Thêm bạn bè thành công!')
        }).catch((_err: any) => {
            toast.error('Lỗi khi thêm bạn bè!')
        })
    }

    const getAllByIdUser = async (userId: number) => {
        const result = await friendAPI.getAllById(userId);
        const friendIds = result.map((item: any) => item.friendId);
        setSelectedUserIds(friendIds)
    }

    return <div className="w-[1000px] m-auto" >
        <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
            Danh sách bạn bè của tài khoản
        </div>
        <div className="flex  justify-between mt-5 text-lg gap-2 " >
            <div className="w-[50%]" >
                <div>Tìm kiếm người dùng :</div>
                <Input placeholder="Nhập tên nhân viên" onChange={(e: any) => (setSearch(e.target.value))} />
            </div>
            <div className="w-[50%]  " >
                <div>Tìm kiếm bạn bè :</div>
                <div className="flex items-center gap-2" >
                    <Input placeholder="Nhập tên bạn bè " onChange={(e: any) => (setSearchFrirend(e.target.value))} />
                    <Button onClick={onClickAddFriend} variant="solid" color="magenta" >Lưu bạn bè</Button>
                </div>
            </div>
        </div>
        <div className="flex w-[100%] border border-gray-200 h-[80vh] mt-1  " >
            <div className="w-[50%] border-r border-r-gray-200 h-[80vh] overflow-auto" >
                {
                    data.length > 0 && data.map((item: any, index: number) => {
                        return <div
                            onClick={() => onClickActive(item.id)}
                            key={item.id}
                            className={`p-[10px] flex items-center gap-2 text-lg box-border cursor-pointer border-b border-white hover:bg-amber-500 hover:text-white 
                                ${active === item.id ? "bg-amber-500 text-white" : "bg-gray-200"}
                            `}
                        >
                            {index + 1}. <FaUser size={22} className="text-[#0f447d]" /> {item.full_name}
                        </div>
                    })
                }


            </div>
            <div className="w-[50%] h-[80vh] overflow-auto">
                {
                    user.length > 0 && active !== 0 &&
                    user.map((item: any, index: number) => {
                        const isChecked = selectedUserIds.includes(item.id);
                        return <div
                            key={item.id}
                            onClick={() => handleToggle(item.id)}
                            className="p-[10px] flex items-center justify-between gap-2 text-lg box-border cursor-pointer border-b border-white hover:bg-emerald-500 hover:text-white"
                        >
                            <div>
                                {index + 1}. {item.full_name}
                            </div>
                            <Checkbox
                                checked={isChecked}
                                onChange={() => { }}
                            />
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}

export default Friend