import React from "react";
import { Link } from "react-router-dom";

function Post({ post, onClick, noAuthor }) {
  return (
    <Link onClick={onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
      <span className="text-muted small">
        {" "}
        {!noAuthor ? `by ${post.author.username}` : ""} on {new Date(post.createdDate).getMonth()}/
        {new Date(post.createdDate).getDate() + 1}/{new Date(post.createdDate).getFullYear()}{" "}
      </span>
    </Link>
  );
}

export default Post;
