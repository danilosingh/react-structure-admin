import React from 'react';
import { Crud } from 'react-structure-admin';
import TopicEdit from './TopicEdit';

const TopicList = (props) => {
  return (
    <>
      <Crud
        {...props}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name'
          }
        ]}
        editComponent={TopicEdit}
      />
    </>
  );
};

export default TopicList;
