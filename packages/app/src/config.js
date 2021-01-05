import React from 'react';
import CourtList from './courts/CourtList';
import Home from './home/Home';
import UserList from './users/UserList';

export default {
  roles: [
    {
      name: 'Admin',
      defaultPath: '/a'
    },
    {
      name: `*`,
      defaultPath: '/app'
    }
  ],
  routes: [
    {
      path: '/courts',
      title: 'Tribunais de Justiça',
      singularTitle: 'Tribunal de Justiça',
      component: (props) => <CourtList {...props} />,
    },
    {
      path: '/test',
      title: 'Teste',
      component: (props) => <Home {...props} />,
    },
    {
      path: '/users',
      title: 'Usuários',
      component: (props) => <UserList {...props} />,
    }
  ]
};
