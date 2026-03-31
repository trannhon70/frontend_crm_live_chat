import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PopconfirmProps, TableProps } from 'antd';
import { Button, DatePicker, Input, Popconfirm, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import moment from "moment";
import { Fragment, useEffect, useState, type FC } from "react";
import { FiEdit } from "react-icons/fi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { toast } from "react-toastify";
import { conversationAPI } from "../../apis/conversation.api";
import { labelAPI } from "../../apis/label.api";
import ErrorComponent from "../../components/error";
import ComponentExportEcxel from "../../components/exportEcxel";
import ComponentHistoryRight from "../../components/history/componentHistoryRight";
import LoadingLayout from "../../components/loadingLayout";
import TableComponent from "../../components/table";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { getTextColorByBg } from "../../utils";

const { RangePicker } = DatePicker;

const History: FC = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(100);
    const [dateInput, setDateInput] = useState<any>([]);
    const [searchDate, setSearchDate] = useState<any>([]);
    const [label, setLabel] = useState<any>([]);
    const [update, setUpdate] = useState<any>({});
    const [select, setSelect] = useState<any>();
    const [searchSelect, setSearchSelect] = useState<any>('')
    const { copy } = useCopyToClipboard();
    const queryClient = useQueryClient();
    const [text, setText] = useState<any>("");
    const [search, setSearch] = useState<any>("");
    const [open, setOpen] = useState<boolean>(false)
    const [record, setRecord] = useState<any>("")

    const { data, isError, isLoading } = useQuery({
        queryKey: ["conversation", { pageIndex, pageSize, searchDate, searchSelect, search }],
        queryFn: () => conversationAPI.getPaging({ pageIndex, pageSize, date: searchDate, quatity: searchSelect, search }),
        placeholderData: keepPreviousData,
    });

    const getAllLabel = async () => {
        const result = await labelAPI.getAll();
        setLabel(result.data);
    }

    useEffect(() => {
        getAllLabel()
    }, [])

    if (isLoading) return <LoadingLayout />
    if (isError) return <ErrorComponent />

    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        conversationAPI.updateLabel(update).then(() => {
            toast.success(`Cập nhật thành công!`);
            queryClient.invalidateQueries({ queryKey: ["conversation"] });
        }).catch((err: any) => {
            console.log(err);
        })
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log('onCancel');
        setUpdate({});
    };

    const handleChangeSelect = (e: any, _record: any) => {
        setUpdate({
            labelId: e,
            conversationId: _record.id
        })
    }

    const columns: TableProps<any>['columns'] = [
        {
            title: "STT",
            key: 'created_at',
            dataIndex: 'created_at',
            render(value, _record, _index) {
                return <Fragment>{_index + 1}</Fragment>
            },
            fixed: 'left',
            width: 50,
        },
        {
            title: "Mã",
            key: 'id',
            dataIndex: 'id',
            render(value, _record, _index) {
                return <Fragment>{value}</Fragment>
            },
            width: 70,
        },
        {
            title: "Thời gian bắt đầu",
            key: 'created_at',
            dataIndex: 'created_at',
            render(value, _record, _index) {
                return <Fragment>{moment(value * 1000).format('DD-MM-YYYY HH:mm')}</Fragment>
            },
            fixed: 'left',
            width: 130,
        },
        {
            title: "Nhân viên tư vấn",
            dataIndex: 'user',
            key: 'user',
            render(value, _record, _index) {
                return <Fragment>{value?.fullName}</Fragment>
            },
            fixed: 'left',
            width: 180,
        },
        {
            title: "Tên khách truy cập",
            dataIndex: 'name',
            key: 'name',
            width: 180,
        },
        {
            title: "Phân loại",
            dataIndex: 'label',
            key: 'label',
            render(_value, _record, _index) {
                const textColor = getTextColorByBg(_record?.label?.color);
                return <div className="text-center flex items-center justify-center " >
                    <Popconfirm
                        icon={<MdOutlineTipsAndUpdates size={20} className="text-amber-500" />}
                        title="Cập nhật nhãn"
                        description={<div className="mt-1" >
                            <Select
                                placeholder="Chọn nhãn"
                                allowClear
                                value={update.labelId ? update.labelId : _record?.labelId}
                                style={{ width: 200 }}
                                onChange={(e: any) => handleChangeSelect(e, _record)}
                                options={label.length > 0 && label.map((item: any) => {
                                    return {
                                        label: (
                                            <span style={{ color: item.color || "black" }}>
                                                {item.name}
                                            </span>
                                        ),
                                        value: item.id
                                    }
                                })}
                            />
                        </div>}
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        {
                            _record.labelId ?
                                <div style={{ background: `${_record.label.color}`, color: `${textColor}` }} className="cursor-pointer hover:font-bold px-3 py-1 rounded " >{_record.label.name}</div>
                                :
                                <FiEdit className="text-emerald-700 cursor-pointer " size={20} />
                        }
                    </Popconfirm>

                </div >
            },
            width: 190,

        },
        {
            title: "Hệ điều hành",
            dataIndex: 'browser',
            key: 'browser',
            width: 140,
        },

        {
            title: "Thiết bị",
            dataIndex: 'device',
            key: 'device',
            width: 120,
        },
        {
            title: "Thành phố",
            dataIndex: 'city',
            key: 'city',
            width: 160,
        },
        {
            title: "Quốc gia",
            dataIndex: 'country',
            key: 'country',
            width: 100,
        },

        {
            title: "Địa chỉ IP",
            key: 'customerIp',
            dataIndex: 'customerIp',
            width: 160,
        },

        {
            title: "Tin nhắn của khách",
            key: 'message',
            dataIndex: 'message',
            render(value, _record, _index) {
                return <div className="flex items-center justify-center" >
                    {
                        value > 0 ? <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-bold  " >{value}</span> : 0
                    }

                </div>
            },
            width: 160,
        },
        {
            title: "Địa chỉ URL",
            key: 'url',
            dataIndex: 'url',
            render(value, _record, _index) {
                return <div title={value} onClick={() => copy(value)} className="cursor-pointer" >{value?.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
            },
            width: 250
        },
        {
            title: "Thao tác",
            key: 'id',
            dataIndex: 'id',
            render(value, _record, _index) {
                return <Button variant="solid" color={record.id !== value ? "primary" : "orange"} onClick={() => onClickDetailChat(_record)} className="cursor-pointer" >Xem chi tiết</Button>
            },
            width: 120,
            fixed: 'right',
        },

    ];

    const onChangePage = (page: number, pageSize: number) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }

    const handleChangePicker = (_date: Dayjs | (Dayjs | null)[] | null, dateString: string | string[]) => {
        const startTime = moment(dateString[0], 'YYYY-MM-DD').startOf('day').unix(); // 00:00:00
        const endTime = moment(dateString[1], 'YYYY-MM-DD').endOf('day').unix(); // 23:59:59
        setDateInput([startTime, endTime]);
    }

    const handleSearch = () => {
        setSearchSelect(select)
        setSearchDate(dateInput);
        setSearch(text)
        setPageIndex(1); // Reset về trang đầu
    };

    const onchangeInput = (event: any) => {
        setText(event.target.value)
    }

    const onClickDetailChat = (value: any) => {
        setOpen(true);
        setRecord(value);
    }


    return <Fragment>
        <div className=" p-2 flex items-center gap-2 " >
            {/* <div className="text-base font-bold text-black " >
                Thời gian :
            </div> */}
            <RangePicker
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                style={{ width: "400px" }}
                onChange={handleChangePicker}
            />
            <Select
                defaultValue="Tất cả"
                value={select}
                style={{ width: 170 }}
                onChange={(e: any) => setSelect(e)}
                options={[
                    { value: 'undefined', label: 'Tất cả' },
                    { value: '0', label: 'Có tin nhắn' },
                    { value: '1', label: 'Không có tin nhắn' },
                ]}
            />
            <Input
                style={{ width: '250px' }}
                placeholder="Nhập url, Ip, tên khách hàng"
                onChange={onchangeInput}
                allowClear
            />
            <Button onClick={handleSearch} type="primary">Tìm kiếm</Button>
            <ComponentExportEcxel data={data.data} fileName="history" />
        </div>
        <div className="flex gap-1" >
            <div className={open ? "w-[70%]" : "w-[100%]"} >
                <TableComponent
                    columns={columns}
                    data={data.data}
                    total={data.total}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onChangePage={onChangePage}
                    scroll={{ x: 'max-content', y: 145 * 5 }}
                />
            </div>
            <div className={open ? "w-[30%]" : "w-[0%] hidden "} >
                <ComponentHistoryRight setOpen={setOpen} record={record} />
            </div>
        </div>
    </Fragment>
}

export default History