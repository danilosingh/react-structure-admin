import { createContext } from 'react';
import authInitialState from './authInitialState';

const AuthContext = createContext(authInitialState);

export default AuthContext;
