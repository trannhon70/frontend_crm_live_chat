import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { Fragment, type FC } from "react";
import QuickReplyList from "../../quickReplyList";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

interface IProps {
    conversation: any;

}
const CardDetailCustomer: FC<IProps> = (props) => {
    const { conversation } = props;
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };




    return <Fragment>
        <AppBar position="static">
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                <Tab label="trả lời nhanh" {...a11yProps(0)} />
                <Tab label="Chi tiết" {...a11yProps(1)} />

            </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
            <QuickReplyList conversation={conversation} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>

            <div className="text-lg font-bold" >
                Thông tin chi tiết khách hàng :
            </div>
            <div className="p-2  text-base text-gray-800 space-y-2 w-full max-w-3xl mx-auto">
                <div className="font-semibold text-blue-600">
                    ID vĩnh viễn của khách truy cập: {conversation?.idComputer}
                </div>
                <div><span className="font-medium">Tên khách truy cập:</span> {conversation?.name}</div>
                <div>
                    <span className="font-medium">Lần đầu truy cập website: </span>
                    <a href={conversation?.url} className="text-blue-500 underline break-all">
                        {conversation?.url}
                    </a>
                </div>
                <div><span className="font-medium">Trang đang truy cập:</span> Giống như trên</div>
                <div><span className="font-medium">Địa chỉ IP:</span> {conversation?.customerIp}</div>
                <div><span className="font-medium">Vị trí IP:</span> {conversation?.city}</div>

                <div><span className="font-medium">Thiết bị truy cập:</span> {conversation?.device}</div>
                <div><span className="font-medium">Hệ điều hành:</span> {conversation?.os}</div>
                <div><span className="font-medium">Quốc gia:</span> {conversation?.country}</div>
                <div><span className="font-medium">User-Agent:</span> {conversation?.userAgent}</div>
                <div><span className="font-medium">Địa chỉ khách hàng:</span> {conversation?.address ? conversation?.address : 'khách hàng không chia sẻ'}</div>
                {/* <div><span className="font-medium">Hệ điều hành:</span> AdsBot-Google (+http://www.google.com/adsbot.html)</div>
            <div><span className="font-medium">User-Agent:</span> AdsBot-Google (+http://www.google.com/adsbot.html)</div> */}
            </div>
        </TabPanel>




    </Fragment>
}

export default CardDetailCustomer