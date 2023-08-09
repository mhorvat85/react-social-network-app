import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollow(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUsers() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, {
          signal,
        });
        setIsLoading(false);
        setUsers(response.data);
      } catch (err) {
        console.log("There was a problem.");
      }
    }
    fetchUsers();
    return () => {
      controller.abort();
    };
  }, [props]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {users.map((follow, index) => {
        return (
          <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follow.avatar} /> {follow.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollow;
