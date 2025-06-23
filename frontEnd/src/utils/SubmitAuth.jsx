import { useUserDataContext, useNavigationContext } from "../hooks/AppContext";

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
    // Use the current host's IP address but change port to 5000
    const currentHost = window.location.hostname;
    const apiUrl = `http://${currentHost}:5000${endpoint}`;
    
    setIsRequesting(true);
    fetch(apiUrl, {
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
          // Transform the nested structure from the API response into the consolidated one.
          const transformedData = {
            id: data.id,
            username: data.username,
            completed_tutorial: data.data.completed_tutorial,
            pets: data.data.pets,
          };

          setUserData(transformedData);
          console.log("setUserData called", performance.now());
          const targetSubpage = transformedData.completed_tutorial ? null : "tutorial";
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




