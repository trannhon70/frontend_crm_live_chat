import { Button, Modal, Result } from 'antd';
import React, { useContext } from "react";


import { useSelector } from 'react-redux';
import { AuthContext } from '../../context/AuthContext';
import type { RootState } from '../../redux/store';
export default function ModalTokenExpiration() {
    const {invalidToken, title} = useSelector((state: RootState) => state.users);
    const { logout } = useContext(AuthContext)

    return (
        <>
            <Modal title="" open={invalidToken} closeIcon={false} footer={false} >
                <Result
                    status="500"
                    subTitle={<div className='text-lg font-bold text-orange-800 ' >{title}</div>}
                    extra={<Button onClick={logout} type="primary">Đăng xuất</Button>}
                />
            </Modal>
        </>
    );
}
