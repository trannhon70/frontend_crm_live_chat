import { Button, Result } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const Error: FC = () => {
    const navige = useNavigate()

    const onClickHome = () => {
        navige(-1)
    }
  return  <div className="flex w-full h-screen items-center justify-center " >
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button onClick={onClickHome} type="primary">Back Home</Button>}
  />
  </div>
}

export default Error