import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Fragment, useState, type FC } from "react";
import { HexColorPicker } from "react-colorful";
import Marquee from 'react-fast-marquee';
import { CgPhone } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { LuSendHorizontal } from "react-icons/lu";
import { MdAttachFile, MdInsertEmoticon } from "react-icons/md";
import { liveChatColorAPI } from "../../apis/live-chat-color";
import { toast } from "react-toastify";
import TableLiveChatColor from "./tableLiveChatColor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingLayout from "../../components/loadingLayout";
import ErrorComponent from "../../components/error";

const PageLiveChatColorSetings: FC = () => {

    const queryClient = useQueryClient();

    const [form, setForm] = useState<any>({
        color: "#aabbcc",
        url: ""
    })
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const { data, isError, isLoading } = useQuery({
        queryKey: ["live-chat", { pageIndex, pageSize }],
        queryFn: () => liveChatColorAPI.getPaging({ pageIndex, pageSize }),
    });

    if (isLoading) return <LoadingLayout />
    if (isError) return <ErrorComponent />


    const onClickSave = () => {
        if (form.url === "") return toast.warning("Url không được bỏ trống!")
        if (form.id) {
            console.log(form);
            liveChatColorAPI.update(form).then((_res: any) => {
                toast.success('Lưu dữ liệu thành công!')
                setForm({ color: "#aabbcc", url: "" })
                queryClient.invalidateQueries({
                    queryKey: ["live-chat"]
                });
            }).catch((_err: any) => {
                console.log(_err);
                toast.error(_err.response.data.message)
            })
        } else {
            liveChatColorAPI.create(form).then((_res: any) => {
                toast.success('Lưu dữ liệu thành công!')
                setForm((form: any) => ({ ...form, url: "" }))
                queryClient.invalidateQueries({
                    queryKey: ["live-chat"]
                });
            }).catch((_err: any) => {
                console.log(_err);
                toast.error(_err.response.data.message)
            })
        }

    }

    const onChangePage = (page: number, pageSize: number) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }
    return <Fragment>
        <div className="w-[1000px] m-auto" >
            <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
                cài đặt màu sắc live chat
            </div>
            <div className="flex items-center justify-between gap-2 mt-5" >
                <div></div>
                <Button onClick={onClickSave} variant="contained">Lưu dữ liệu</Button>
            </div>
            <div className="flex justify-center mt-3 gap-2 " >
                <div className="w-[60%]" >
                    <div className="flex items-end justify-center gap-1.5" >
                        <Box component="form" sx={{ width: "100%" }} noValidate autoComplete="off" >
                            <TextField id="outlined-basic" value={form.url} onChange={(e: any) => setForm((form: any) => ({ ...form, url: e.target.value }))} label="Nhập url" fullWidth size="small" />
                        </Box>
                    </div>
                    <div className="mt-2.5" >
                        <div className="text-xl font-semibold" >Bảng màu :</div>
                        <HexColorPicker color={form.color} onChange={(e: any) => setForm((form: any) => ({ ...form, color: e }))} />
                    </div>

                </div>
                <div className="w-[40%]">
                    <div style={form.color ? { border: `1px solid ${form.color}` } : {}} className="chat_container-motion" >
                        <div style={form.color ? { background: form.color } : {}} className="chat_container-motion-top" >
                            <div className="chat_container-motion-top-right">
                                <div className="chat_container-motion-top-right-body">
                                    <Marquee speed={20} gradient={false}>
                                        <span className="chat_container-motion-top-right-body-span">
                                            <CgPhone size={20} /> 028 7777 9888
                                        </span>
                                    </Marquee>
                                </div>
                            </div>
                            <div className="chat_container-motion-top-left">
                                <a style={{ display: 'flex', alignItems: 'center' }} href="tel:+02877779888"><LiaPhoneVolumeSolid size={25} className="chat_container-motion-top-left-icon" /></a>
                                <IoClose size={30} className="chat_container-motion-top-left-icon" />
                            </div>
                        </div>

                        <div className="render_chat" >
                            <div style={{ border: `1px solid ${form.color ? form.color : '#07686b'}`, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                <div style={{ padding: 10, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                    <div style={{ color: form.color ? form.color : '#07686b', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>PHÒNG KHÁM NAM KHOA HCM
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%', margin: '0 auto', gap: '2%' }}>
                                        <div style={{ width: '50%', border: '1px solid #5CB54B', backgroundColor: '#E5FFEB', borderRadius: 20, display: 'flex', alignItems: 'center', padding: 5, gap: 5 }}>
                                            <img style={{ width: 40, height: 40 }} src="https://apichat.andongclinic.vn/api/uploads/icon_location.png" alt="..." />
                                            <div style={{ fontSize: 12, fontWeight: 'bold', color: '#10531D' }}> 73 Kinh Dương Vương, Phường Phú Lâm, TP.HCM</div>
                                        </div>
                                        <a href="tel:02877779888" style={{ width: '50%', border: '1px solid #5CB54B', backgroundColor: '#E5FFEB', borderRadius: 20, display: 'flex', alignItems: 'center', padding: 5, gap: 5, textDecoration: 'none' }}>
                                            <img style={{ width: 40, height: 40 }} src="https://apichat.andongclinic.vn/api/uploads/icon_phone.png" alt="..." />
                                            <div style={{ fontSize: 12, fontWeight: 'bold', color: '#10531D' }}>Điện thoại: <br /> 028 7777 9888
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', background: `${form.color ? form.color : 'linear-gradient(90deg, #07686b 0%, #07686b 100%)'}`, height: 40, color: 'white' }}>
                                    Khung chat đã được cài đặt bảo mật thông tin
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}  >
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                <div
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    style={{ width: "70%", height: "40px", padding: "5px", overflow: "auto", outline: `2px solid ${form.color ?? '#01969a'} `, outlineOffset: "-1px", borderBottomLeftRadius: "3px" }}
                                    data-placeholder="Nhập câu hỏi tại đây..."
                                />
                                <div style={{ position: "relative" }} >
                                    <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: `${form.color ?? '#01969a'}`, outline: `2px solid ${form.color ?? '#01969a'}`, outlineOffset: "-1px", cursor: "pointer" }} >
                                        <MdInsertEmoticon size={25} />
                                    </div>


                                </div>
                                <input type="file" style={{ display: "none" }} accept="image/*,audio/mp3,video/mp4" />
                                <div style={{ border: "1px solid #e5e7eb", width: "10%", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: `${form.color ?? '#01969a'}`, outline: `2px solid ${form.color ?? '#01969a'}`, outlineWidth: "2px", outlineOffset: "-1px", cursor: "pointer" }} >
                                    <MdAttachFile size={22} />
                                </div>
                                <div style={{ border: "1px solid #e5e7eb", width: "10%", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: `${form.color ?? '#01969a'}`, outline: `2px solid ${form.color ?? '#01969a'}`, outlineWidth: "2px", outlineOffset: "-1px", cursor: "pointer", borderBottomRightRadius: "3px" }}>
                                    <LuSendHorizontal size={25} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-2.5">
                <TableLiveChatColor data={data.data} pageIndex={pageIndex} pageSize={pageSize} total={data.total} onChangePage={onChangePage} setForm={setForm} />
            </div>
        </div>
    </Fragment>
}

export default PageLiveChatColorSetings