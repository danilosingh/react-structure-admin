import React from 'react';
import { useHistory } from 'react-router-dom';

const RouteRedirect = ({ to }) => {
  useHistory().push(to);
  return null;
};

export default RouteRedirect;
