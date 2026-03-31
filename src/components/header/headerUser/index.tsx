import { Avatar, Dropdown, type MenuProps } from "antd";
import { useContext, useEffect, type FC } from "react";
import { CiLogout } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { IoStatsChart } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { fetchUserById } from "../../../features/usersSlice";
import { useChatSocket } from "../../../hooks/useChatSocket";
import useZaloNotificationSound from "../../../hooks/useZaloNotificationSound";
import type { AppDispatch, RootState } from "../../../redux/store";
import { CheckRole, SENDER_TYPE } from "../../../utils";
import logo from "/src/assets/images/logo.png";
import { FaRocketchat } from "react-icons/fa";
import { SiWechat } from "react-icons/si";
import { IoLogoChrome } from "react-icons/io";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import ModalRename from "../../modal/modalRename";
import { useCountDown } from "../../../hooks/useCountDown";
import { CgProfile } from "react-icons/cg";
import { FaJediOrder } from "react-icons/fa6";
import { GiTimeBomb } from "react-icons/gi";
interface IProps {

}
const HeaderComponentUser: FC<IProps> = (props) => {
    const { } = props
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users);
    const { logout } = useContext(AuthContext);
    const { play } = useZaloNotificationSound();
    const { formattedTime, isExpired } = useCountDown();


    const { } = useChatSocket({
        onNewMessage: (msg) => {
            if (msg.senderType === SENDER_TYPE.CUSTOMER) {
                play();
            }
        }
    });

    useEffect(() => {
        dispatch(fetchUserById());
    }, [dispatch])

    const items: MenuProps['items'] = [
        {
            key: 'a',
            label: <div >Hồ sơ cá nhân</div>,
            icon: <CgProfile size={30} />,
            onClick: () => navigate('/ho-so-ca-nhan')

        },
        {
            key: 'b',
            danger: true,
            label: <div >Đăng xuất</div>,
            icon: <CiLogout size={30} />,
            onClick: logout
        },
    ];

    const settings = [
        users.user?.role?.id === CheckRole.ADMIN && {
            key: '2',
            label: <div className="text-[#0f447d] font-bold">Cài đặt màu sắc live chat</div>,
            icon: <FaRocketchat className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-mau-sac-live-chat')
        },
        users.user?.role?.id === CheckRole.ADMIN && {
            key: '3',
            label: <div className="text-[#0f447d] font-bold">Cài đặt logo chat</div>,
            icon: <IoLogoChrome className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-logo-chat-box')
        },
        {
            key: '4',
            label: <div className="text-[#0f447d] font-bold ">Cài đặt giới thiệu bác sĩ</div>,
            icon: <FaUserDoctor className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-gioi-thieu-bac-si')
        },
        users.user?.role?.id === CheckRole.ADMIN && {
            key: '5',
            label: <div className="text-[#0f447d] font-bold">Cài đặt thứ tự nhận chat của tư vấn</div>,
            icon: <FaJediOrder className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-thu-tu-nhan-chat-tu-van')
        },
        users.user?.role?.id === CheckRole.ADMIN && {
            key: '6',
            label: <div className="text-[#0f447d] font-bold ">Cài đặt chat random</div>,
            icon: <SiWechat className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-chat-random')
        },
        users.user?.role?.id === CheckRole.ADMIN && {
            key: '7',
            label: <div className="text-[#0f447d] font-bold ">Cài đặt thời gian</div>,
            icon: <GiTimeBomb className="text-[#0f447d]" size={25} />,
            onClick: () => navigate('cai-dat-thoi-gian')
        }
    ].filter(Boolean) as MenuProps['items'];


    return <div className="w-full h-[5vh] bg-[#0f447d] text-[#b0c1d4] flex items-center justify-between  box-border " >
        <div className="flex items-center gap-2.5 " >
            <div className="p-2 w-[200px] bg-[#b0c1d4] h-[5vh] ">
                <img className='w-[100%] ' src={logo} alt="..." />
            </div>

            <div className={`flex items-center justify-center w-auto p-2 rounded-sm hover:bg-[#07213d] hover:text-white text-md font-semibold gap-2 cursor-pointer 
                ${location.pathname === '/' ? `bg-[#07213d] text-white` : ``}`}
                onClick={() => { navigate('/') }}
            >
                Tin nhắn <FiMessageCircle size={20} />
            </div>
            <ModalRename />

            <div className={`flex items-center justify-center w-auto p-2 rounded-sm hover:bg-[#07213d] hover:text-white text-md font-semibold gap-2 cursor-pointer 
                ${location.pathname === '/history' ? `bg-[#07213d] text-white` : ``}`}
                onClick={() => { navigate('/history') }}
            >
                Lịch sử <IoStatsChart size={20} />
            </div>
            {
                users.user?.role?.id === CheckRole.ADMIN &&
                <div className={`flex items-center justify-center w-auto p-2 rounded-sm hover:bg-[#07213d] hover:text-white text-md font-semibold gap-2 cursor-pointer`}
                    onClick={() => { navigate('/admin') }}
                >
                    Quản lý Admin <GiHamburgerMenu size={20} />
                </div>
            }
            <div className={`flex items-center justify-center w-auto p-2 rounded-sm hover:bg-[#07213d] hover:text-white text-md font-semibold gap-2 cursor-pointer 
                ${location.pathname === '/add-friend' ? `bg-[#07213d] text-white` : ``}`}
                onClick={() => { navigate('/add-friend') }}
            >
                Thêm bạn bè <FaUserFriends size={20} />
            </div>


            {!isExpired && <span>⏳ Token còn lại: {formattedTime}</span>}

        </div>
        <div className="p-2 flex items-center gap-2.5 " >
            <Dropdown menu={{ items: settings }} trigger={['click']} >
                <div onClick={(e) => e.preventDefault()}>
                    <div className="hover:bg-[#07213d] rounded-full transition duration-300 bg-orange-500/80">
                        <Avatar
                            className="cursor-pointer text-black"
                            size={50}
                            icon={<IoMdSettings />}
                            style={{ backgroundColor: 'transparent', width: '40px', height: '40px' }}
                        />
                    </div>
                </div>
            </Dropdown>

            <div className="flex items-center justify-center gap-1.5" >
                <div className="text-lg font-semibold" >{users?.user?.fullName}</div>
                <Dropdown menu={{ items }} trigger={['click']} >
                    <div onClick={(e) => e.preventDefault()}>
                        <div className="hover:bg-[#07213d] rounded-full transition duration-300 bg-orange-500/80" >
                            <Avatar
                                className="cursor-pointer text-black"
                                size={40}
                                icon={users?.user?.avatar ? <img src={users?.user?.avatar} alt="..." width="100%" height="auto" /> : <FaUserAlt />}
                                style={{ backgroundColor: 'transparent', width: '40px', height: '40px' }}
                            />
                        </div>
                    </div>
                </Dropdown>
            </div>
        </div>
    </div>
}

export default HeaderComponentUser