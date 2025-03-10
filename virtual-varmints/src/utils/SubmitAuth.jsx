import { useUserDataContext, useNavigationContext } from '../hooks/AppContext';

export function useSubmitAuth() {
  const { setUserData } = useUserDataContext();
  const { navigateTo } = useNavigationContext();

  const submitAuth = (
    userName,
    password,
    isLogin,
    setIsRequesting,
    setAuthFeedback
  ) => {
    const endpoint = isLogin ? '/login' : '/register';
    setIsRequesting(true);
    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, password }),
    })
      .then((res) => {
        const { status } = res;
        return res.json().then((data) => ({ status, data }));
      })
      .then(({ status, data }) => {
        if (status === 200 || status === 201) {
          // Only on success do we update our central user data store
          setUserData(data);
          const targetSubpage = data.data.completed_tutorial ? null : "tutorial";
          navigateTo('main', targetSubpage);
        } else if (status === 401) {
          setAuthFeedback('Invalid password');
        } else if (status === 404) {
          setAuthFeedback('User does not exist');
        } else if (status === 400) {
          setAuthFeedback('Username taken');
        } else {
          console.log('Error:', status, data.error || data);
        }
        setIsRequesting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsRequesting(false);
      });
  };

  return submitAuth;
}



  