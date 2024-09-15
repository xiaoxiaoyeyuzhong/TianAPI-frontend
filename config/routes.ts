export default [
  {
    path: '/',name:'主页',icon: 'smile' ,component: './Index'
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
      { icon: 'table', path: '/admin/interfaceInfo', component: './Admin/InterfaceInfo', name: '接口管理' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
