import React, { type FC } from "react";

import { Spin } from 'antd';

const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const content = <div style={contentStyle} />;
const LoadingLayout: FC = () => {
    return <div className="flex w-full h-screen items-center justify-center " >
        <Spin tip="Loading" size="large">
            {content}
        </Spin>
    </div>
}

export default LoadingLayout