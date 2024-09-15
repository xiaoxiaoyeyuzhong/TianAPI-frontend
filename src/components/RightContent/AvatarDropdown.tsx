import { userLogoutUsingPost } from '@/services/TianAPI-backend/userController';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Button, Space } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};


export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {


  const { initialState, setInitialState } = useModel('@@initialState');


  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, loginUser: undefined }));
        });
        userLogoutUsingPost().catch((error)=>{
          console.log("用户注销失败",error);
        });
        const {search,pathname} = window.location;
        const redirect = pathname + search;
        history.replace('/user/login',{redirect});
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const { loginUser } = initialState || {};

  if (!loginUser) {
    return (
      <Link to="/user/login">
        <Button type="primary" shape="round">
          登录
        </Button>
      </Link>
    );
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      <Space>
        {loginUser?.userAvatar ? (
          <Avatar size="large" src={loginUser?.userAvatar} />
        ) : (
          <Avatar size="large" icon={<UserOutlined />} />
        )}
        <span className="anticon">{loginUser?.userName ?? '无名'}</span>
      </Space>
    </HeaderDropdown>
  );
};

export const AvatarName = () => {
    const { initialState } = useModel('@@initialState');
    const { loginUser } = initialState || {};
    return <span className="anticon">{loginUser?.userName}</span>;
};
