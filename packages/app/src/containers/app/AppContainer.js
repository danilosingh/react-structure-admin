import React from 'react';
import { Layout } from 'antd';
import { Routes } from 'react-structure-admin';

const { Content } = Layout;

const AppContainer = (props) => {
  const { match, routes, roles, basePath } = props;
  return (
    <Layout className="gx-app-layout">
      <Layout>
        <Content className="gx-layout-content gx-container-wrap">
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

export default AppContainer;
