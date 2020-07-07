import React from 'react';
import { Resource } from 'react-structure-admin';
import ProceduralRiteEdit from './ProceduralRiteEdit';

const ProceduralRiteList = (props) => (
  <Resource
    {...props}
    columns={{
      dataColumns: [
        {
          title: 'Nome',
          dataIndex: 'name'
        }
      ],
      customActions: []
    }}
    editComponent={ProceduralRiteEdit}
  />
);

export default ProceduralRiteList;
