import { Breadcrumb, InputNumber, Select, Switch } from "antd";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { rolesAPI } from "../../../apis/role.api";
import { userAPI } from "../../../apis/user.api";

type FieldType = {
    roleId?: string;
    email?: string;
    password?: string;
    fullName?: string;
    ngaySinh?: string;
    phone?: string;
    delete?: string;
    avatar?: string;
    confirm?: string;
    quantity?: number;

};

const CreateUser: FC = () => {
    const [form] = Form.useForm();
    const param = useParams();
    const navige = useNavigate();
    const variant = Form.useWatch('variant', form);
    const [role, setRole] = useState<any>([])

    const getByIdUser = async (id: number) => {
        const result = await userAPI.getById(id);
        form.setFieldsValue({
            roleId: result.roleId,
            fullName: result.fullName,
            email: result.email,
            delete: result.delete,
            quantity: result.quantity,
        });
    }

    useEffect(() => {
        if (param.id) {
            getByIdUser(Number(param.id))
        }

    }, [param.id])

    const getAllRole = async () => {
        const result = await rolesAPI.getAll();
        setRole(result.data)
    }

    useEffect(() => {
        getAllRole()
    }, [])


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const body = {
            roleId: values.roleId,
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            delete: values.delete,
            quantity: values.quantity,
        }
        if (param.id) {
            try {

                const result = await userAPI.update(Number(param.id), body)
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

                const result = await userAPI.create(body)
                if (result.data.statusCode === 1) {
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
                    title: 'Quản lý nhân viên',
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
                    label="Chức vụ"
                    name="roleId"
                    rules={[{ required: true, message: 'Chức vụ không được bỏ trống!' }]}
                >
                    <Select
                        size="large"
                        style={{ width: "100%" }}
                        options={role.length > 0 && role.map((item: any) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tên nhân viên"
                    name="fullName"
                    rules={[{ required: true, message: 'Tên nhân viên không được bỏ trống!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item<FieldType>

                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được bỏ trống!' },
                        {
                            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: 'Email không hợp lệ!'
                        }
                    ]}
                >
                    <Input size="large" disabled={param.id ? true : false} />
                </Form.Item>
                {
                    !param.id &&
                    <Form.Item<FieldType>
                        name="password"
                        label="Mật khẩu"
                        rules={
                            param.id
                                ? [] // Nếu tồn tại param.id, không áp dụng rules
                                : [
                                    {
                                        required: true,
                                        message: 'Mật khẩu không được bỏ trống!',
                                    },
                                ]}
                        hasFeedback
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                }


                {
                    !param.id &&
                    <Form.Item<FieldType>
                        name="confirm"
                        label="Nhập lại mật khẩu "
                        dependencies={['password']}
                        hasFeedback
                        rules={
                            param.id
                                ? [] // Nếu tồn tại param.id, không áp dụng rules
                                : [
                                    {
                                        required: true,
                                        message: 'Nhập lại mật khẩu không được bỏ trống!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp nhau!'));
                                        },
                                    }),
                                ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                }
                <Form.Item<FieldType>
                    label="Tỉ lệ nhận chat"
                    name="quantity"
                    rules={[{ required: true, message: 'Tỉ lệ nhận chat không được bỏ trống!' }]}
                >
                    <InputNumber size="large" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Hoạt động"
                    name="delete"
                >
                    <Switch />
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

export default CreateUser