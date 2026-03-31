import { useEffect, useRef, useState, type FC } from "react";
import { chatBotTitleAPI } from "../../../apis/chat_bot_title.api";
import { SENDER_TYPE } from "../../../utils";
import { renderCustomer, renderStaff } from "../cardItemRenderChat";

interface IProps {
    data?: any
}
const CardBodyChatBox: FC<IProps> = (props) => {
    const { data } = props;
    const [title, setTitle] = useState<any>('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data]);

    const getOneChatBotTitle = async () => {
        const result = await chatBotTitleAPI.getOne();
        if (result?.data?.name) {
            setTitle(result.data.name);
        }
    };

    useEffect(() => {
        getOneChatBotTitle();
    }, []);

    return <div className="h-[81vh] overflow-auto p-2" >
        <div className="flex items-center justify-center" >
            <div
                className=" rounded  w-[400px] inline-grid"
                dangerouslySetInnerHTML={{ __html: title }}
            />
        </div>
        {data.sort((a: any, b: any) => Number(a.created_at) - Number(b.created_at)).map((item: any) =>
            item.senderType !== SENDER_TYPE.CUSTOMER
                ? renderCustomer(item)
                : renderStaff(item)
        )}

        <div ref={messagesEndRef} />

    </div>
}

export default CardBodyChatBox