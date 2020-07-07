const getAuthDataFromStorage = () => {
  try {
    const auth64 = localStorage.getItem('auth_data');
    return JSON.parse(auth64 ? atob(auth64) : '{}');
  } catch (e) {
    console.log('Error on getAuthDataFromStorage');
    return {};
  }
};

export default getAuthDataFromStorage;
