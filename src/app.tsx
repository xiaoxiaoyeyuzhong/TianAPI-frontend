import Footer from '@/components/Footer';
import { getLoginUserUsingGet } from '@/services/TianAPI-backend/userController';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {AvatarDropdown, AvatarName} from './components/RightContent/AvatarDropdown';
import { requestConfig } from './requestConfig';
import {QuestionCircleFill} from "antd-mobile-icons";
import {Question} from "@/components/RightContent";

const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
  const state: InitialState = {
    //初始化用户状态为undefined
    loginUser: undefined,
  }
  try{
    //调用getLoginUserUsingGET()函数，尝试获取当前登录用户的信息
    const res = await getLoginUserUsingGet();
    // 如果登录用户信息不为空，赋值给state的loginUser
    if(res.data){
      state.loginUser = res.data;
    }
  }catch(e){
    //如果获取信息错误，重定向到登录页面
    history.push(loginPath);
  }
  //返回修改后的状态
  return state;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () =>[<Question key="doc" />],
    avatarProps: {
      src: initialState?.loginUser?.userAvatar,
      title: <AvatarName />,
      render: () => {
        return <AvatarDropdown />;
      },
    },
    waterMarkProps: {
      content: initialState?.loginUser?.userName,
    },
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...defaultSettings,
    onPageChange: ()=>{
      const {location} = history;
      //如果没登录，把页面重定向到登录页
      if(!initialState?.loginUser && location.pathname !== loginPath){
        history.push(loginPath);
      }
    }
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
