import { Button } from "antd";
import DOMPurify from "dompurify";
import { type FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { chatBoxMessageDoctorAPI } from "../../apis/chat_box_message_doctor.api";

const DoctorReferralSetting:FC = () =>{

    const [rawInput, setRawInput] = useState<string>("");
  const [id, setId] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  };

  const onClickSave = async () => {
    if (!rawInput.trim()) {
      return toast.warning("Nội dung không được bỏ trống!");
    }

    const result = await chatBoxMessageDoctorAPI.create({ name: rawInput, id: id });
    if (result.statusCode === 1) {
      toast.success("Lưu dữ liệu thành công");
    } else {
      toast.error("Lỗi không cập nhật được");
    }
  };

  const getOne = async () => {
    const result = await chatBoxMessageDoctorAPI.getByIdUser();
    if (result?.data?.name) {
      setRawInput(result.data.name);
      setId(result.data.id);
    }
  };

  useEffect(() => {
    getOne();
  }, []);


    return <div className="m-auto w-[1000px]">
      <div className="flex items-center justify-center text-3xl font-bold text-[#0f447d] mt-2 uppercase">
        Cài đặt giới thiệu bác sĩ
      </div>

      <div className="flex gap-[20px] mt-5">
        {/* Bên trái: textarea nhập HTML */}
        <div style={{ flex: 1 }}>
          <textarea
            onChange={handleChange}
            placeholder="Nhập HTML tại đây..."
            style={{
              width: "100%",
              height: "300px",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              fontFamily: "monospace",
              fontSize: 14,
            }}
            value={rawInput}
          />
        </div>

        {/* Bên phải: render HTML đã nhập (sau khi lọc DOMPurify) */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            minHeight: 200,
            backgroundColor: "#fafafa",
            overflow: "auto",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(rawInput, {
                USE_PROFILES: { html: true },
              }),
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end mt-3">
        <Button onClick={onClickSave} size="large" type="primary">
          Lưu dữ liệu
        </Button>
      </div>
    </div>
}

export default DoctorReferralSetting