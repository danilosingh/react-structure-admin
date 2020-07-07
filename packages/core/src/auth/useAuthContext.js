import { useContext } from 'react';
import AuthContext from './AuthContext';

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
