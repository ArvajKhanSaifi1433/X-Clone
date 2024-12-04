import React from "react";
import CreatePost from "./CreatePost";
import Tweet from "./Tweet";

function Feed() {

  return (
    <div className="border w-full mx-auto dark:bg-gray-900 dark:border-gray-700">
      <CreatePost  />
      <Tweet  />
    </div>
  );
}

export default Feed;
