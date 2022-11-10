import React from "react";

const PostList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    content =
      comment.status === "pending"
        ? "Pending."
        : comment.status === "rejected"
        ? "Incluing sensitive words."
        : comment.content;

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default PostList;
