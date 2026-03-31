import { Fragment, type FC } from "react";
import TableComponent from "../../components/table";
import { Tag, Tooltip, type TableProps } from "antd";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import moment from "moment";
import { liveChatColorAPI } from "../../apis/live-chat-color";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
    data?: any;
    pageIndex?: number;
    pageSize?: number;
    onChangePage?: any;
    total?: number;
    setForm?: any
}
const TableLiveChatColor: FC<IProps> = (props) => {
    const { data, pageIndex, onChangePage, pageSize, total, setForm } = props
    const queryClient = useQueryClient();

    const onClickDelete = (value: any) => {
        liveChatColorAPI.deletes(value).then((_res) => {
            toast.success('Xóa thành công!');
            queryClient.invalidateQueries({
                queryKey: ["live-chat"]
            });
        }).catch((_err) => {
            toast.error(_err.response.data.message)
        })
    }

    const onClickEdit = (form: any) => {
        setForm({ id: form.id, color: form.color, url: form.url })
    }
    const columns: TableProps<any>['columns'] = [
        {
            title: "STT",
            dataIndex: 'age',
            key: 'age',
            render(_value, _record, index) {
                return <Fragment>{index + 1}</Fragment>
            },
            width: 50
        },

        {
            title: "url",
            dataIndex: 'url',
            key: 'url',
            render(_value, _record) {
                return <Fragment>{_value}</Fragment>
            },
        },

        {
            title: "màu sắc",
            dataIndex: 'color',
            key: 'color',
            render(_value, _record) {
                return <Fragment><Tag color={_value} >{_value}</Tag></Fragment>
            },
        },

        {
            title: "Thời gian tạo",
            key: 'created_at',
            dataIndex: 'created_at',
            render(value, _record, _index) {
                return <Fragment>{moment(value * 1000).format('DD-MM-YYYY HH:mm')}</Fragment>
            },
            width: 200
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
                        <BiSolidEdit className="cursor-pointer" onClick={() => onClickEdit(record)} color="#008236" size={25} />
                    </Tooltip>
                </div>
            },
            width: 200
        },
    ];
    return <Fragment>
        <TableComponent columns={columns} data={data} total={total} pageIndex={pageIndex} pageSize={pageSize} onChangePage={onChangePage} />
    </Fragment>
}

export default TableLiveChatColor