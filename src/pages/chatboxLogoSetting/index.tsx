import { Fragment, useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import UseCheckRole from "../../hooks/useCheckRole";
import { CheckRole } from "../../utils";
import LoadingLayout from "../../components/loadingLayout";
import { chatBoxLogoAPI } from "../../apis/chat_bot_logo.api";
import { RiUploadCloud2Line } from "react-icons/ri";

const ChatboxLogoSetting: FC = () => {
    const navigate = useNavigate();
    const { role } = UseCheckRole();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [img, setimg] = useState<any>(null)
    const [id, setId] = useState<any>(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };
    console.log(id, 'id');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("id", id);
            await chatBoxLogoAPI.create(formData);
            getOne();
        }
    };

    const getOne = async () => {
        const result = await chatBoxLogoAPI.getOne();

        setimg(result.data?.file);
        setId(result.data?.id);
    };

    useEffect(() => {
        getOne();
    }, []);

    useEffect(() => {
        if (role && role !== CheckRole.ADMIN) {
            navigate('/');
        }
    }, [role]);

    if (role !== CheckRole.ADMIN) {
        return <LoadingLayout />
    }

    return <Fragment>
        <div className="w-[1000px] m-auto" >
            <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
                Chỉnh sửa logo chat box
            </div>
            <div className="flex items-center justify-center mt-10 " >
                <div className="w-[200px] h-[200px] bg-gray-200 rounded cursor-pointer flex items-center justify-center " onClick={handleDivClick}>
                    {
                        img ? <img width="100%" height="100%" src={img} alt="..." /> : <RiUploadCloud2Line size={60} className="text-[#0f447d]" />
                    }

                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>
        </div>
    </Fragment>
}

export default ChatboxLogoSetting