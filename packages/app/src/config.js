import React from 'react';
import AdminContainer from './containers/admin/AdminContainer';
import AppContainer from './containers/app/AppContainer';
import CourtList from './pages/courts/CourtList';
import Home from './pages/home/Home';
import UserList from './pages/users/UserList';
const Test = (props) => {
  console.log("props")
  console.log(props)
  return <>Teste</>;
};
export default {
  roles: [
    {
      name: 'Admin',
      defaultPath: '/a'
    }
  ],
  routes: [
    {
      path: '/test',
      component: Test
    },
    {
      path: '/a',
      component: (props) => <AdminContainer {...props} />,
      roles: ['Admin'],
      routes: [
        {
          path: '/users',
          title: 'Usuários',
          singularTitle: 'Usuário',
          component: (props) => <UserList {...props} />,
          menu: { icon: 'user' }
        }
      ]
    },
    {
      path: '/app',
      component: (props) => 
      {
        console.log("props")
        console.log(props)
        return <AppContainer {...props} />
      }
      ,
      roles: ['Admin'],
      routes: [
        {
          path: '/',
          title: 'users',
          exact: true,
          component: (props) => <UserList {...props} />,
          menu: { icon: 'tachometer-alt' }
        }
      ]
    }
  ]
};
