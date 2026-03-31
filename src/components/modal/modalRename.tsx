import { Input, Modal } from "antd";
import { Fragment, useEffect, useState, type FC } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { conversationAPI } from "../../apis/conversation.api";
import { toast } from "react-toastify";


const ModalRename: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const conversationId = queryParams.get("conversationId");
    const [conversation, setConversation] = useState<any>(null);

    const getByIdConversation = async () => {
        const result = await conversationAPI.getById(Number(conversationId))
        setConversation(result.data)
    }

    useEffect(() => {
        if (conversationId) {
            getByIdConversation()
        }
    }, [conversationId])

    const showModal = () => {
        if (conversationId) {
            setIsModalOpen(true);
        }

    };

    const handleOk = async () => {
        if (conversation.name === '') {
            return toast.warning('Dữ liệu không được bỏ trống')
        }
        const resutl = await conversationAPI.updateName(conversation.id, { name: conversation.name });
        if (resutl.statusCode === 1) {
            toast.success('Đổi tên thành công!')
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (e: any) => {
        setConversation((prev: any) => ({
            ...prev,
            name: e.target.value
        }))
    }


    return <Fragment>
        <div className={`flex items-center justify-center w-auto p-2 rounded-sm hover:bg-[#07213d] hover:text-white text-md font-semibold gap-2 cursor-pointer 
                `}
            onClick={showModal}
        >
            Đổi tên <MdOutlineDriveFileRenameOutline size={20} />
        </div>
        <Modal
            title="Đổi tên"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input value={conversation?.name} onChange={onChange} />
        </Modal>
    </Fragment>
}

export default ModalRename