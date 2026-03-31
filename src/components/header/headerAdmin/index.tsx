import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import type { Dispatch, FC, SetStateAction } from "react";
import { useContext, useEffect } from "react";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../../context/AuthContext';
import { fetchUserById } from '../../../features/usersSlice';
import type { AppDispatch, RootState } from '../../../redux/store';
import ModalTokenExpiration from '../../modal/modalTokenExpiration';



interface IHeaderProps {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const HeaderComponent: FC<IHeaderProps> = ({ collapsed, setCollapsed }) => {
    const { logout } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchUserById());
    }, [dispatch])

    const items: MenuProps['items'] = [
        // {
        //     key: 'a',
        //     label: (
        //         <Link className='text-base' to='/quan-ly-ho-so'>Thông tin cá nhân</Link>
        //     ),
        //     icon: <PiUserSwitchDuotone size={30} />,
        // },

        // {
        //     key: 'c',
        //     label: (
        //         <Link className='text-base' to='thay-doi-mat-khau'>Thay đổi mật khẩu</Link>
        //     ),
        //     icon: <PiPasswordFill size={30} />,
        // },

        {
            key: 'b',
            danger: true,
            label: <div >Đăng xuất</div>,
            icon: <CiLogout size={30} />,
            onClick: logout
        },
    ];


    return <Header style={{ padding: 0, background: 'white', display: 'flex', justifyContent: "space-between", height: "50px" }}>
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
                fontSize: '16px',
                width: 50,
                height: 50,
            }}
        />

        <div className='flex items-center justify-between gap-3 pr-4  ' style={{ textTransform: 'capitalize' }} >

            <div className='flex items-center gap-3 ' >
                {users?.user?.full_name}
                <Dropdown menu={{ items }}>
                    <div onClick={(e) => e.preventDefault()}>
                        <Space className='cursor-pointer' >
                            {
                                users?.user?.avatar ?
                                    <Avatar style={{ backgroundColor: '#ed6c02' }} size={35}>
                                        <img
                                            src={users?.user?.avatar}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt="avatar"
                                        />
                                    </Avatar>
                                    : <Avatar size={35} icon={<UserOutlined />} />
                            }

                        </Space>
                    </div>
                </Dropdown>
            </div>

        </div>
        <ModalTokenExpiration />
    </Header>
}

export default HeaderComponent