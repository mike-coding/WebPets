import { useUserDataContext, useNavigationContext } from "../hooks/AppContext";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useSubmitAuth() {
  const { setUserData } = useUserDataContext();
  const { navigateTo } = useNavigationContext();
  const submitAuth = async (
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
      .then(async (res) => {
        const { status } = res;
        return res.json().then(async (data) => {
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
            const targetSubpage = transformedData.completed_tutorial ? "default" : "tutorial";
            if (targetSubpage === "default") {
              // for some reason, this fixes the login delay before rendering a pet.
              // BE VERY CAREFUL MESSING AROUND WITH THIS SCRIPT UNLESS YOU WANT TO BANG YOUR HEAD AGAINST THE WALL FOR HOURS.
              // I HAVE SPENT A COLLECTIVE 10+ HOURS ON THIS SMALL ~300MS HANG. 
              await sleep(0);
            }
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
        });
      })
      .catch((err) => {
        console.error(err);
        setIsRequesting(false);
      });
  };

  return submitAuth;
}




