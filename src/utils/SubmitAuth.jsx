export default function submitAuth(userName, password, isLogin, navigateTo) {
    const endpoint = isLogin ? '/login' : '/register';
    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: userName, password })
    })
    .then(res => res.json())
    .then(data => {
      // LOG THAT MOTHERFUCKER IN!!!
      navigateTo("main", null);
    })
    .catch(err => {
      // Handle error
      console.error(err);
    });
  }
  
  