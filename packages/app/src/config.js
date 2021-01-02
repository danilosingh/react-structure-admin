import React from 'react';
import CourtList from './courts/CourtList';
import Home from './home/Home';


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
      menu: { icon: 'university' }
    },
    {
      path: '/test',
      title: 'Teste',      
      component: (props) => <Home {...props} />,
      menu: { icon: 'university' }
    }
  ]
};
