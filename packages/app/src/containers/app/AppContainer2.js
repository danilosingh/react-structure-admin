import React from 'react';
import { Layout } from 'antd';
import { Routes } from 'react-structure-admin';

const { Content } = Layout;

const AppContainer2 = (props) => {
  const { match, routes, roles, basePath } = props;
  console.log("AppContainer2");
  console.log(routes);
  console.log(basePath);
  console.log(props);
  return (
    <Layout className="gx-app-layout">
      <Layout>
        <Content className="gx-layout-content gx-container-wrap">
          <h3>App container 2</h3>
         
          <Routes
            match={match}
            routes={routes}
            roles={roles}
            basePath={basePath}
            isContainer
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppContainer2;
