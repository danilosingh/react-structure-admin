import React from 'react';
import { Crud } from 'react-structure-admin';
import TopicEdit from './TopicEdit';

const TopicList = (props) => {
  return (
    <Crud
      {...props}
      tenant={'9dca757c-1d2b-4f9f-b748-7615bbdcd979'}
      columns={[
        {
          title: 'Nome',
          dataIndex: 'name'
        }
      ]}
      editComponent={TopicEdit}
    />
  );
};

export default TopicList;
