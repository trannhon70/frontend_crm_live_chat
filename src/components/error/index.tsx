import { Result } from 'antd';
import type { FC } from "react";

const ErrorComponent: FC = () => {
    return <div className="flex items-center justify-center h-[70vh]" >
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
        />
    </div>
}

export default ErrorComponent