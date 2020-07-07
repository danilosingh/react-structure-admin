import React from 'react';

const LazyComponent = (props) => {
  const Component = React.lazy(props.component);
  return <Component />;
};

export default LazyComponent;
