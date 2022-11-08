import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
  return (
    <div className="container">
      <h1>Create a Post</h1>
      <PostCreate />
      <h1>List Posts</h1>
      <PostList />
    </div>
  );
};

export default App;
