// client/src/components/UserList.jsx

import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}

export default UserList;
