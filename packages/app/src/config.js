import React from 'react';
import CourtList from './courts/CourtList';
import ProceduralRiteList from './proceduralRites/ProceduralRiteList';

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
      path: '/proceduralrites',
      title: 'Rito processual',
      singularTitle: 'Rito',
      component: (props) => <ProceduralRiteList {...props} />,
      menu: { icon: 'university' }
    }
  ]
};
