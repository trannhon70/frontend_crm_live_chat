import { Fragment, useEffect, useState, type FC } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRef } from "react";
import { Button, DatePicker, Input, type DatePickerProps } from "antd";
import { userAPI } from "../../apis/user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from 'dayjs';

const Profile: FC = () => {
    const [user, setUser] = useState<any>({})
    const navigate = useNavigate();
    const [file, setFile] = useState<any>(null)
    const getByUser = async () => {
        const result = await userAPI.getByIdUser();
        setUser(result.data.data)
    }

    useEffect(() => {
        getByUser()
    }, [])

    const fileInputRef: any = useRef(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file)
            const url = URL.createObjectURL(file);
            setUser((prev: any) => {
                return {
                    ...prev,
                    avatar: url
                }
            })
        }
    };

    const onChange: DatePickerProps['onChange'] = (date, _dateString) => {
        const timestampInSeconds = date.unix();

        setUser((prev: any) => ({
            ...prev,
            ngay_sinh: timestampInSeconds
        }))
    };

    const onClickPrev = () => {
        navigate(-1)
    }

    const onClickUpdate = () => {
        const formData = new FormData();
        formData.append('full_name', user.full_name);
        formData.append('ngay_sinh', user.ngay_sinh);
        formData.append('phone', user.phone);
        if (file) {
            formData.append('file', file); // đúng tên 'file' theo interceptor
        }
        userAPI.updateProfile(formData).then(() => {
            toast.success('Cập nhật thành công!')
        }).catch(() => {
            toast.error('Cập nhật không thành công!')
        })

    }

    return <Fragment>
        <div className="m-auto w-[500px]">
            <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
                Thông tin cá nhân
            </div>
            <div className="flex items-center justify-center mt-2" >
                <div className="w-[70px] h-[70px] bg-[#d36219] rounded-full flex items-center justify-center cursor-pointer "
                    onClick={handleDivClick}
                >
                    {
                        user.avatar ? <img width={50} height={50} src={user.avatar} alt="..." /> : <FaUserCircle color="white" size={55} />
                    }
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/*"
                />
            </div>
            <div className="mt-2" >
                <div className="text-xl font-bold text-[#0f447d] mb-1" >
                    Email:
                </div>
                <Input variant="filled" size="large" disabled value={user.email} />
            </div>
            <div className="mt-2" >
                <div className="text-xl font-bold text-[#0f447d] mb-1" >
                    Họ và tên:
                </div>
                <Input variant="filled" size="large" value={user.full_name} onChange={(e: any) => { setUser((prev: any) => ({ ...prev, full_name: e.target.value })) }} />
            </div>
            <div className="mt-2" >
                <div className="text-xl font-bold text-[#0f447d] mb-1" >
                    Ngày sinh:
                </div>
                <DatePicker value={user.ngay_sinh ? dayjs.unix(user.ngay_sinh) : null} onChange={onChange} variant="filled" style={{ width: '500px' }} size="large" />
            </div>
            <div className="mt-2" >
                <div className="text-xl font-bold text-[#0f447d] mb-1" >
                    Số điện thoại:
                </div>
                <Input variant="filled" size="large" value={user.phone} onChange={(e: any) => { setUser((prev: any) => ({ ...prev, phone: e.target.value })) }} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2" >
                <Button onClick={onClickUpdate} color="primary" variant="solid" size="large">
                    Cập nhật
                </Button>
                <Button onClick={onClickPrev} color="danger" variant="solid" size="large">
                    Quay lại
                </Button>
            </div>
        </div>
    </Fragment>
}

export default Profile