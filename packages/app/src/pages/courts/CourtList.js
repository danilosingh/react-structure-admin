import React from 'react';
import { Resource } from 'react-structure-admin';
import CourtEdit from './CourtEdit';

const CourtList = (props) => (
  <Resource
    {...props}
    columns={{
      dataColumns: [
        {
          title: 'Nome',
          dataIndex: 'name'
        },
        {
          title: 'Estado',
          dataIndex: 'state',
          render: (state) => <>{state.toUpperCase()}</>
        }
      ],
      customActions: []
    }}
    editComponent={CourtEdit}
  />
);

export default CourtList;
