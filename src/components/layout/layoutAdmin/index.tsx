
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import React, { useLayoutEffect, useState } from 'react';
import { FaList } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import { Link, Outlet, useLocation } from 'react-router-dom';
import UseCheckRole from '../../../hooks/useCheckRole';
import { CheckRole } from '../../../utils';
import logo from "/src/assets/images/logo.png";

import { FaUsers } from "react-icons/fa";
import HeaderComponent from '../../header/headerAdmin';

const { Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
const sub0 = [
    '/admin/quan-ly-nguoi-dung', '/admin/quan-ly-nguoi-dung/them-moi'
]

const sub1 = [
    '/admin/quan-ly-nhan', '/admin/quan-ly-nhan/them-moi'
]

const sub2 = [
    '/admin/quan-ly-ip', '/admin/quan-ly-ip/them-moi'
]



const LayoutComponent: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const { role } = UseCheckRole();

    useLayoutEffect(() => {
        if (sub0.includes(location.pathname)) {
            setOpenKeys(['sub0']);
        }
        if (sub1.includes(location.pathname)) {
            setOpenKeys(['sub1']);
        }

        if (sub2.includes(location.pathname)) {
            setOpenKeys(['sub2']);
        }

    }, [location.pathname, sub0, sub1, sub2])

    const items: MenuItem[] = [
        getItem(<Link to={'/'}>Trang chủ</Link>, '/', <IoHomeOutline size={20} />),
        ...(role === CheckRole.ADMIN ?
            [getItem('Quản lý người dùng', 'sub0', <FaUsers size={20} />, [
                getItem(<Link to={'/admin/quan-ly-nguoi-dung'}>Danh sách</Link>, '/admin/quan-ly-nguoi-dung', <FaList size={20} />),
                getItem(<Link to={'/admin/quan-ly-nguoi-dung/them-moi'}>Thêm mới</Link>, '/admin/quan-ly-nguoi-dung/them-moi', <VscDiffAdded size={20} />),

            ])] : []),
        ...(role === CheckRole.ADMIN ?
            [getItem('Quản lý nhãn', 'sub1', <FaUsers size={20} />, [
                getItem(<Link to={'/admin/quan-ly-nhan'}>Danh sách</Link>, '/admin/quan-ly-nhan', <FaList size={20} />),
                getItem(<Link to={'/admin/quan-ly-nhan/them-moi'}>Thêm mới</Link>, '/admin/quan-ly-nhan/them-moi', <VscDiffAdded size={20} />),

            ])] : []),
        ...(role === CheckRole.ADMIN ?
            [getItem('Quản lý Ip và Id block', 'sub2', <FaUsers size={20} />, [
                getItem(<Link to={'/admin/quan-ly-ip'}>Danh sách</Link>, '/admin/quan-ly-ip', <FaList size={20} />),
                getItem(<Link to={'/admin/quan-ly-ip/them-moi'}>Thêm mới</Link>, '/admin/quan-ly-ip/them-moi', <VscDiffAdded size={20} />),

            ])] : []),

    ];

    return (
        <Layout style={{ height: '100vh' }} >
            <Sider style={{ overflow: 'auto' }} width={250} trigger={null} collapsible collapsed={collapsed}  >
                <div className="p-2">
                    <img className='w-[100%] ' src={logo} alt="..." />
                </div>
                <Menu
                    className='mt-3'
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    openKeys={openKeys} // Use openKeys instead of defaultOpenKeys
                    onOpenChange={setOpenKeys} // Update openKeys on change
                    items={items}
                />
            </Sider>
            <Layout>
                <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content
                    style={{
                        margin: '6px ',
                        padding: '5px  10px',
                        minHeight: 280,
                        background: '#f7f9fa',
                        borderRadius: borderRadiusLG,
                        overflow: 'auto',

                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default LayoutComponent