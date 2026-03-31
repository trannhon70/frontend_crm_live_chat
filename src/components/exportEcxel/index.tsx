import { Button } from "antd";
import { Fragment, type FC } from "react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

interface IProps {
    data?: any[];
    fileName?: string;
}

const ComponentExportEcxel: FC<IProps> = ({ data = [], fileName = 'export' }) => {
    const exportToExcel = () => {
        if (data.length === 0) return;

        const headersMap: Record<string, string> = {
            id: 'STT',
            customerIp: 'IP',
            user: 'Nhân viên',
            label: 'Nhãn',
            message: 'Tin nhắn của khách',
            idComputer: 'Id của khách',
            userAgent: 'User-Agent',
            browser: 'Trình duyệt',
            os: 'Hệ điều hành',
            device: 'Loại thiết bị',
            country: 'Quốc gia',
            city: 'Tỉnh/TP',
            name: 'Tên',
            url: 'Url',
            address: 'Địa chỉ',
            created_at: 'Thời gian',
            // thêm nếu có trường khác
        };

        const transformedData = data.map((item, index) => {
            const newItem: any = {};
            Object.keys(headersMap).forEach((key) => {
                let value = item[key];
                if (key === 'id') {
                    value = index + 1
                }
                if (key === 'user') {
                    value = value?.fullName
                }
                 if (key === 'label') {
                    value = value?.name
                }
                if (key === 'created_at' && typeof value === 'number') {
                    // Nếu là timestamp => convert
                    value = dayjs.unix(value).format('DD/MM/YYYY HH:mm:ss'); // hoặc 'YYYY-MM-DD'
                }

                newItem[headersMap[key]] = value;
            });

            return newItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Fragment>
            <Button onClick={exportToExcel} type="dashed" style={{ backgroundColor: 'orange', color: 'white' }}>
                Xuất Excel
            </Button>
        </Fragment>
    );
};

export default ComponentExportEcxel;
