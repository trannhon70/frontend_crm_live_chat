import  { Fragment } from "react";
import type { FC } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, Modal } from 'antd';
import { userAPI } from "../../apis/user.api";
import { toast } from "react-toastify";
interface IProps {
    open?: any,
    setOpen?: any,
    value?: any
}

type FieldType = {

    password?: string;
    confirm?: string;
};
const ModalUpdatePassWord: FC<IProps> = (props) => {
    const { open, setOpen, value } = props
    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);
    const onCancel = () => {
        setOpen(false);
        form.resetFields()
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (_errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const body = {
            password: values.password
        }
        try {
            const result = await userAPI.updatePassword(Number(value.id), body);
            if (result.statusCode === 1) {
                toast.success(`Cập nhật thành công!`);
                onCancel()
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
    }

    return <Fragment>

        <Modal
            title={<p>Thay đổi mật khẩu : {value?.fullName}</p>}
            open={open}
            onCancel={onCancel}
            footer={false}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                variant={variant || 'filled'}
                style={{ width: "100%" }}
                initialValues={{ remember: true, variant: 'filled' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    name="password"
                    label="Mật khẩu mới"
                    rules={
                        [
                            {
                                required: true,
                                message: 'Mật khẩu không được bỏ trống!',
                            },
                        ]}
                    hasFeedback
                >
                    <Input.Password size="large" />
                </Form.Item>

                <Form.Item<FieldType>
                    name="confirm"
                    label="Nhập lại mật khẩu mới"
                    dependencies={['password']}
                    hasFeedback
                    rules={
                        [
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

                <Form.Item label={null}>
                    <Button color="orange" variant="solid" htmlType="submit">
                        Cập nhật
                    </Button>
                    <Button onClick={onCancel} className="ml-2.5" color="orange" type="default">
                        Quay lại
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </Fragment>
}

export default ModalUpdatePassWord