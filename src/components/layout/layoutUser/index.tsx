import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet } from "react-router-dom"
import HeaderComponentUser from "../../header/headerUser"

const LayoutComponentUser: React.FC = () => {

    return <Layout>
                <HeaderComponentUser  />
                <Content
                    style={{
                        // background: 'w',
                        height:'95vh'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
}

export default LayoutComponentUser