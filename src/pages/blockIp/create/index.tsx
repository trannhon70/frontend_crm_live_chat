import type { FormProps } from 'antd';
import { Breadcrumb, Button, Form, Input, Select } from "antd";
import type { FC } from "react";
import { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { blockIplAPI } from '../../../apis/block_ip.api';

type FieldType = {
    name?: string;
    status?: any
};

const CreateBlockIp: FC = () => {
    const [form] = Form.useForm();
    const param = useParams();
    const navige = useNavigate();
    const variant = Form.useWatch('variant', form);

    const getByIds = async () => {
        const result = await blockIplAPI.getById(param.id);
        form.setFieldsValue({
            name: result.data.name,
            status: result.data.status,
        });
    }

    useEffect(() => {
        if (param.id) {
            getByIds()
        }
    }, [param.id])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const body = {
            name: values.name,
            status: values.status,
        }
        
        if (param.id) {
            try {

                const result = await blockIplAPI.update(Number(param.id), body)
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

                const result = await blockIplAPI.create(body);

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


    return <Fragment>
        <Breadcrumb
            items={[
                {
                    title: 'Quản lý Ip hoặc id',
                },
                {
                    title: <a href="">{param.id ? "Cập nhật" : "Thêm mới"}</a>,
                },
            ]}
        />
        <div className="flex items-center justify-center text-2xl text-gray-700 font-bold mb-7 " >{param.id ? "Cập nhật" : "Thêm mới"} IP hoặc ID</div>
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
                    label="Địa chỉ"
                    name="status"
                    rules={[{ required: true, message: 'không được bỏ trống!' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'IP', label: 'IP' },
                            { value: 'ID_PC', label: 'Id máy tính' },
                        ]}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ip hoặc ID"
                    name="name"
                    rules={[{ required: true, message: 'Ip hoặc ID không được bỏ trống!' }]}
                >
                    <Input size="large" />
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

export default CreateBlockIp