import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetProps, TableProps } from 'antd';
import { Breadcrumb, Input, Select, Tag, Tooltip } from "antd";
import moment from "moment";
import type { FC } from 'react';
import { Fragment, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blockIplAPI } from "../../../apis/block_ip.api";
import ErrorComponent from "../../../components/error";
import LoadingLayout from "../../../components/loadingLayout";
import TableComponent from "../../../components/table";
import { getTextColorByBg } from "../../../utils";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const ManagerBlockIP: FC = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(25);
    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<string>('')
    const navige = useNavigate();
    const queryClient = useQueryClient();


    const { data, isError, isLoading } = useQuery({
        queryKey: ["ip", { pageIndex, pageSize, search, status }],
        queryFn: () => blockIplAPI.getPaging({ pageIndex, pageSize, search, status }),
        placeholderData: keepPreviousData,
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
            width:50
        },

         {
            title: "Địa chỉ",
            dataIndex: 'status',
            key: 'status',
            render(_value, _record, index) {
                if(_value === 'ID_PC'){
                    return <Tag color="#f50">ID máy tính</Tag>
                } 
                return <Tag color="#2db7f5">IP</Tag>
            },
        },
        {
            title: "Tên địa chỉ",
            dataIndex: 'name',
            key: 'name',
            render(value, _record, _index) {
                const textColor = getTextColorByBg(_record?.color);
                return <span style={{ background: `${_record.color}`, color: `${textColor}` }} className="text-base px-3 py-1 rounded ">
                    {value}
                </span>
            },
        },


        {
            title: "Thời gian tạo",
            key: 'created_at',
            dataIndex: 'created_at',
            render(value, _record, _index) {
                return <Fragment>{moment(value * 1000).format('DD-MM-YYYY HH:mm')}</Fragment>
            },
             width:200
        },
        {
            title: "Thao tác",
            key: 'delete',
            dataIndex: 'delete',
            render(_value, record, _index) {
                return <div className='flex gap-4 ' >
                    <Tooltip title="Xóa">
                        <MdDelete className="cursor-pointer" onClick={() => onClickDelete(record.id)} color="red" size={25} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <BiSolidEdit className="cursor-pointer" onClick={() => onClickEdit(record.id)} color="#008236" size={25} />
                    </Tooltip>
                </div>
            },
            width:200
        },
    ];

    const onClickEdit = (id: number) => {
        navige(`/admin/quan-ly-ip/cap-nhat/${id}`)
    }

    const onClickDelete = async (id: number) => {
        try {
            const result = await blockIplAPI.deletes(id)
            if (result.statusCode === 1) {
                toast.success(`Xóa nhãn thành công!`);
                queryClient.invalidateQueries({ queryKey: ["ip"] });
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

    const onChangeStatus = (e:any) =>{
        setStatus(e)
    } 
    return <Fragment>
        <Breadcrumb
            items={[
                {
                    title: 'Quản lý Ip và Id',
                },
                {
                    title: <a href="">danh sách</a>,
                },
            ]}
        />
        <div className="flex items-center w-[500px] gap-2 my-2 ">
            <Select
                placeholder="Lựa chọn"
                style={{ width: 200 }}
                onChange={onChangeStatus}
                options={[
                    { value: 'IP', label: 'IP' },
                    { value: 'ID_PC', label: 'Id máy tính' },
                ]}
            />
            <Search

                placeholder="Nhập Ip"
                allowClear
                enterButton="Tìm kiếm"
                size="middle"
                onSearch={onSearch}
            />
        </div>
        <TableComponent columns={columns} data={data.data} total={data.total} pageIndex={pageIndex} pageSize={pageSize} onChangePage={onChangePage} />
    </Fragment>
}

export default ManagerBlockIP