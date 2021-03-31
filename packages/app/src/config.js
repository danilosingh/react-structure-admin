import React from 'react';
import AdminContainer from './containers/admin/AdminContainer';
import AppContainer from './containers/app/AppContainer';
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
      path: '/',
      component: (props) => {
        console.log('props');
        console.log(props);
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
