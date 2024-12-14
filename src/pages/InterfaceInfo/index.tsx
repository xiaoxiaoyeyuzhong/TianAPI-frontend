import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {App, Button, Card, Descriptions, Divider, Form, message, Spin} from 'antd';
import {
  getInterfaceInfoByIdUsingGet, invokeInterfaceInfoUsingPost
} from "@/services/TianAPI-backend/interfaceInfoController";
import {useParams} from "react-router";
import {Input} from 'antd/lib';


/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  // 使用 useState 和泛型来定义组件内的状态
  // 数据加载状态
  const [loading, setLoading] = useState(false);
  // 列表数据
  const [data, setData] = useState<API.InterfaceInfo>();
  //使用useParams获取动态路由参数
  const params = useParams();
  //接口调用结果变量
  const [invokeRes, setInvokeRes] = useState<any>();
  //接口调用状态变量
  const [invokeLoading, setInvokeLoading] = useState(false);
  // 定义异步加载数据的函数
  const loadData = async () => {
    //检查动态路由参数是否存在
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    // 开始加载数据，设置 loading 状态为 true
    setLoading(true);
    try {
      // 调用接口获取数据
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      console.log('接口返回的数据：', res?.data);
      // 将请求返回的数据设置到列表数据状态中
      setData(res?.data);
      // 捕获请求失败的错误信息
    } catch (error: any) {
      // 请求失败时提示错误信息
      message.error('请求失败，' + error.message);
    }
    // 数据加载成功或失败后，设置 loading 状态为 false
    setLoading(false);
  };

  useEffect(() => {
    // 页面加载完成后调用加载数据的函数
    loadData();
  }, []);


  //请求参数表单提交后调用
  const onFinish = async (values: any) => {
    // 检查是否存在接口id
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    try {
      setInvokeLoading(true);
      // 发起接口调用请求，传入一个对象作为参数，这个对象包含了id和values的属性，
      // 其中，id 是从 params 中获取的，而 values 是函数的参数
      const res = await invokeInterfaceInfoUsingPost({
        id: Number(params.id),
        userRequestParams: JSON.stringify(values),
      });
      //将结果设置到存储调用结果变量中
      setInvokeRes(res.data);
      message.success('请求成功');
      setInvokeLoading(false);
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
  };


  const [form] = Form.useForm();
  return (
    // 使用 antd 的 PageContainer 组件作为页面容器

    <PageContainer title="在线接口开放平台">
        <Card>{
          data ? (
            <Descriptions title={data.name} column={1}>
              <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
              <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
              <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
              <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
              <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
              <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
              <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
            </Descriptions>
          ) : (<>接口不存在</>)
        }</Card>
        <Divider />
        <Card title={"在线调试"}>
          {/* 创建一个表单,表单名称为"invoke",布局方式为垂直布局,当表单提交时调用onFinish方法 */}
          <Form name="invoke" form={form} layout="vertical" onFinish={onFinish}>
            {/*  /!* 创建一个表单项,用于输入请求参数,表单项名称为"userRequestParams" *!/*/}
            {/*  <Form.Item label="请求参数" name="userRequestParams">*/}
            {/*    <Input.TextArea />*/}
            {/*  </Form.Item>*/}
            {data && data.requestParams ? (
              //使用map遍历requestParams，将其每一项映射成key为name和type两个键值对
              JSON.parse(data.requestParams).map((param: { name: string, type: string }) => (
                <Form.Item
                  key={param.name} // 使用 param.name 作为唯一标识
                  label={param.name} // 表单项的 label 是请求参数的 name 属性
                  name={param.name} // 表单项的 name 与请求参数的 name 属性对应
                  rules={[{required: true, message: `${param.name} 不能为空`}]} // 添加必填校验规则
                >
                  <Input.TextArea placeholder={`请输入 ${param.name}`}/>{/* 显示 "请输入 username" */}
                </Form.Item>
              ))
            ) : (
              <div>无请求参数</div>
            )}
            <Form.Item wrapperCol={{span: 16}}>
              {/* 创建调用按钮*/}
              <App>
              <Button type="primary" htmlType="submit">
                调用
              </Button>
              </App>
            </Form.Item>
          </Form>
        </Card>
        <Card title={"返回结果"} loading={invokeLoading}>
            {invokeRes}
        </Card>
    </PageContainer>


  );
};

export default Index;
