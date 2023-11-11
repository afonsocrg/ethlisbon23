import { Spin } from 'antd'
// import { LoadingOutlined } from '@ant-design/icons'

export default function Loading({ isLoading, children, className }) {
    return (
        <Spin spinning={isLoading} wrapperClassName={className}>
            {children}
        </Spin>
    )
}
