export default [
  {
    path: '/',name:'主页',icon: 'smile' ,component: './Index'
  },
  {path: '/interfaceInfo/:id',name: '查看接口',icon: 'smile' ,component: './InterfaceInfo',hideInMenu: true
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/interfaceInfo' },
      { name: '接口管理', icon: 'table', path: '/admin/interfaceInfo',
        component: './Admin/InterfaceInfo' },
      { name: '接口分析', icon: 'analysis', path: '/admin/interface_analysis',
        component: './Admin/InterfaceAnalysis' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
