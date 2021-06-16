import React from 'react';
import AdminContainer from './containers/admin/AdminContainer';
import AppContainer from './containers/app/AppContainer';
import SignIn from './pages/signin/SignIn';
import TopicList from './pages/topics/TopicList';
import UserList from './pages/users/UserList';

export default {
  roles: [
    {
      name: 'Admin',
      defaultPath: '/a'
    }
  ],
  routes: [
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
      path: '/signin',
      component: (props) => <SignIn {...props} />,
      exact: true
    },
    {
      path: '/',
      component: (props) => {
        return <AppContainer {...props} />;
      },
      routes: [
        {
          path: '/',
          title: 'users',
          resource: 'users',
          singularTitle: 'Usuário',
          exact: true,
          component: (props) => <UserList {...props} />,
          menu: { icon: 'tachometer-alt' }
        },
        {
          path: '/topics',
          title: 'Tópicos',
          resource: 'topics',
          singularTitle: 'Tópico',
          exact: true,
          component: (props) => <TopicList {...props} />,
          menu: { icon: 'tachometer-alt' }
        }
      ]
    }
  ]
};
