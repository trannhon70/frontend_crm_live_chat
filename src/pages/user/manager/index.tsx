import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetProps, TableProps } from 'antd';
import { Breadcrumb, Input, Popover, Tooltip } from "antd";
import moment from "moment";
import type { FC } from 'react';
import { Fragment, useState } from "react";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { PiPasswordLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { userAPI } from "../../../apis/user.api";
import ErrorComponent from "../../../components/error";
import LoadingLayout from "../../../components/loadingLayout";
import ModalUpdatePassWord from "../../../components/modal/modalUpdatePassWord";
import TableComponent from "../../../components/table";


type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const ManagerUser: FC = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(25);
    const [search, setSearch] = useState<string>("");
    const navige = useNavigate();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>();

    const { data, isError, isLoading } = useQuery({
        queryKey: ["users", { pageIndex, pageSize, search }],
        queryFn: () => userAPI.getPagingAdmin({ pageIndex, pageSize, search }),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    if (isLoading) return <LoadingLayout />
    if (isError) return <ErrorComponent />

    const columns: TableProps<any>['columns'] = [
        {
            title: "STT",
            dataIndex: 'age',
            key: 'age',
            render(_value, _record, index) {
                return <Fragment>{index + 1}</Fragment>
            },
        },
        {
            title: "Họ và tên",
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: "Phân quyền",
            dataIndex: 'role',
            key: 'role',
            render(value, _record, _index) {
                return <Fragment>{value?.name}</Fragment>
            },
        },

        {
            title: "Thời gian tạo",
            key: 'created_at',
            dataIndex: 'created_at',
            render(value, _record, _index) {
                return <Fragment>{moment(value * 1000).format('DD-MM-YYYY HH:mm')}</Fragment>
            },
        },
        {
            title: "Thao tác",
            key: 'delete',
            dataIndex: 'delete',
            render(value, record, _index) {

                return <div className='flex gap-4 ' >
                    <div className="cursor-pointer" >
                        {
                            !value ?
                                <Tooltip title="Mở khóa tài khoản">
                                    <span>
                                        <IoMdLock onClick={() => onClickOpenLock(record.id)} color="red" size={25} />
                                    </span>
                                </Tooltip>
                                :
                                <Tooltip title="Đóng tài khoản">
                                    <span>
                                        <IoMdUnlock onClick={() => onClickCloseLock(record.id)} color="#008236" size={25} />
                                    </span>
                                </Tooltip>
                        }
                    </div>
                    <Popover content={content(record)} trigger="click">
                        <span>
                            <IoSettings className='cursor-pointer  ' size={25} />
                        </span>
                    </Popover>

                </div>
            },
        },
    ];

    const content = (record: any) => (
        <div className="w-[170px]" >
            <div onClick={() => onClickModalPassword(record)} className="cursor-pointer flex items-center gap-1.5 text-gray-600 font-semibold text-base hover:bg-amber-700 hover:text-white p-1 transition-all duration-300 ease-in-out transform hover:scale-105" ><PiPasswordLight size={20} />Thay đổi mật khẩu</div>
            <div onClick={() => onClickEdit(record.id)} className="cursor-pointer flex items-center gap-1.5 text-gray-600 font-semibold text-base hover:bg-amber-700 hover:text-white p-1 transition-all duration-300 ease-in-out transform hover:scale-105" ><FaEdit size={20} />Cập nhật</div>
        </div>
    );

    const onClickEdit = (id: number) => {
        navige(`/admin/quan-ly-nguoi-dung/cap-nhat/${id}`)
    }


    const onClickModalPassword = (value: any) => {
        setValue(value)
        setOpen(true);
    };

    const onClickCloseLock = async (id: number) => {
        try {
            const result = await userAPI.closeTheLock({ id, delete: false })
            if (result.statusCode === 1) {
                toast.success(`Khóa tài khoản thành công!`);
                queryClient.invalidateQueries({ queryKey: ["users"] });
            }
        } catch (error: any) {
            console.log(error);
            toast.error(`${error.response.data.message}`)
        }
    }

    const onClickOpenLock = async (id: number) => {
        try {
            const result = await userAPI.closeTheLock({ id, delete: true })
            if (result.statusCode === 1) {
                toast.success(`Mở khóa tài khoản thành công!`);
                queryClient.invalidateQueries({ queryKey: ["users"] });
            }
        } catch (error: any) {
            console.log(error);
            toast.error(`${error.response.data.message}`)
        }
    }

    const onChangePage = (page: number, pageSize: number) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }

    const onSearch: SearchProps['onSearch'] = (value, _e, _info) => {
        setSearch(value);
    }
    return <Fragment>
        <Breadcrumb
            items={[
                {
                    title: 'Quản lý nhân viên',
                },
                {
                    title: <a href="">danh sách</a>,
                },
            ]}
        />
        <div className="w-[300px] my-2">
            <Search

                placeholder="Nhập tên nhân viên, email"
                allowClear
                enterButton="Tìm kiếm"
                size="middle"
                onSearch={onSearch}
            />
        </div>
        <TableComponent columns={columns} data={data.data} total={data.total} pageIndex={pageIndex} pageSize={pageSize} onChangePage={onChangePage} />
        <ModalUpdatePassWord open={open} value={value} setOpen={setOpen} />
    </Fragment>
}

export default ManagerUser