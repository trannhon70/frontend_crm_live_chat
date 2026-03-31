import type { FormProps } from 'antd';
import { Breadcrumb, Button, Form, Input, Popover } from "antd";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";
import { SketchPicker } from 'react-color';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { labelAPI } from "../../../apis/label.api";
import { useTextColorByBg } from "../../../hooks/useTextColorByBg";

type FieldType = {
    name?: string;
    color?: string;
};

const CreateLabel: FC = () => {
    const [form] = Form.useForm();
    const param = useParams();
    const navige = useNavigate();
    const variant = Form.useWatch('variant', form);
    const [color, setColor] = useState<any>('#000000');
    const textColor = useTextColorByBg(color);

    const getByIds=  async () =>{
        const result = await labelAPI.getById(param.id);
        form.setFieldsValue({
            name: result.data.name,
        });
        setColor(result.data.color)
    }

    useEffect(() =>{
        if(param.id){
            getByIds()
        }
    },[param.id])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const body = {
            name: values.name,
            color: color,
        }
        if (param.id) {
            try {

                const result = await labelAPI.update(Number(param.id), body)
                if (result.statusCode === 1) {
                    toast.success(`Cập nhật thành công!`)
                    form.resetFields();
                    navige(-1);
                }
            } catch (error: any) {
                console.log(error);
                toast.error(`${error.response.data.message}`)
            }
        } else {
            try {

                const result = await labelAPI.create(body);

                if (result.statusCode === 1) {
                    toast.success(`Thêm mới thành công!`)
                    form.resetFields();
                }
            } catch (error: any) {
                console.log(error);
                toast.error(`${error.response.data.message}`)
            }
        }

    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onClickPrev = () => {
        navige(-1)
    }

    const onChangeColor = (e: any) => {
        setColor(e.hex)
    }
    

    return <Fragment>
        <Breadcrumb
            items={[
                {
                    title: 'Quản lý nhãn',
                },
                {
                    title: <a href="">{param.id ? "Cập nhật" : "Thêm mới"}</a>,
                },
            ]}
        />
        <div className="flex items-center justify-center text-2xl text-gray-700 font-bold mb-7 " >{param.id ? "Cập nhật" : "Thêm mới"} nhân viên</div>
        <div className="flex items-center justify-center w-full " >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                variant={variant || 'filled'}
                style={{ width: 700 }}
                initialValues={{ remember: true, variant: 'filled' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >


                <Form.Item<FieldType>
                    label="Tên nhãn"
                    name="name"
                    rules={[{ required: true, message: 'Tên nhãn không được bỏ trống!' }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Background"
                    name="color"
                >
                    <Popover content={<SketchPicker color={color} onChange={onChangeColor} />} trigger="click">
                        <div style={{ background: color, color: textColor }} className="w-[100px] h-[40px] flex items-center justify-center rounded cursor-pointer " >{color}</div>
                    </Popover>
                </Form.Item>



                <Form.Item label={null}>
                    <Button color="orange" variant="solid" htmlType="submit">
                        {param.id ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    <Button onClick={onClickPrev} className="ml-2.5" color="orange" type="default">
                        Quay lại
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </Fragment>
}

export default CreateLabel