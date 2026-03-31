import React, { type JSX } from 'react';
import { BsBrowserSafari } from "react-icons/bs";
import { FaEdge } from "react-icons/fa";
import { FcCellPhone } from "react-icons/fc";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { LiaFirefox, LiaGoogle } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import { messageAPI } from '../../../apis/message.api';
import { CHECK_BROWSER, CHECK_DEVICE, SENDER_TYPE } from '../../../utils';


interface Props {
    item: {
        browser: string;
        device: string;
        city: string;
        id?: string;
        name: string;
        message?: any;
        gclid?: any;
    };
    index: number;
    status?: string
}

const CardUserInfoNode: React.FC<Props> = (props) => {
    const { item, status } = props;
    const navige = useNavigate()
    const browserIcons: Record<string, JSX.Element> = {
        [CHECK_BROWSER.EDGE]: <FaEdge className="bg-[#0f447d] rounded text-white p-[2px]" size={20} />,
        [CHECK_BROWSER.SAFARI]: <BsBrowserSafari className="bg-[#af1212] rounded text-white p-[2px]" size={20} />,
        [CHECK_BROWSER.FIREFOX]: <LiaFirefox className="bg-[#af1212] rounded text-white p-[2px]" size={20} />,
        default: <LiaGoogle className="bg-[#094e0e] rounded text-white p-[2px]" size={20} />
    };

    const renderBrowser = () => browserIcons[item.browser] || browserIcons.default;

    const renderDevice = () => {
        return item.device === CHECK_DEVICE.MOBILE
            ? <FcCellPhone size={18} />
            : <HiMiniComputerDesktop className="bg-[#ff0000] rounded text-white p-[2px]" size={20} />;
    };

    //    console.log(`Render item ${item.id} at`, performance.now().toFixed(2), 'ms');

    const noti = Array.isArray(item?.message) ? item.message.filter((item: any) => item?.status === false && item?.senderType === SENDER_TYPE.CUSTOMER).length : 0;
    const checkColor = item?.message?.some((item: any) => item?.senderType === SENDER_TYPE.CUSTOMER)

    const onClickItem = async () => {
        if (noti > 0) {
            const body = {
                conversationId: item.id,
                gclid: item.gclid,
                senderType: SENDER_TYPE.CUSTOMER
            }
            await messageAPI.updateStatus(body);
        }

        navige(`?conversationId=${item.id}&status=${status}`)
    }

    return (
        <div onClick={onClickItem} className="flex items-center gap-1" title={`${item.browser} - ${item.device} - ${item.city}`}>

            <div className={` ${noti > 0 ? 'blink' : ''} flex items-center gap-1`}>
                {noti > 0 ? (
                    <div
                        className={`flex items-center justify-center w-[20px] h-[20px] bg-red-600 text-white rounded-full text-sm`}
                    >
                        {noti > 9 ? '9+' : noti}
                    </div>
                ) : (
                    <>
                        {renderBrowser()}
                        {renderDevice()}
                    </>
                )}

                <span style={{ color: checkColor === true ? "blue" : "black" }}>{item.name}</span>
            </div>


        </div>
    );
};

// Sử dụng React.memo để tránh re-render nếu `item` không đổi
export default React.memo(CardUserInfoNode);
