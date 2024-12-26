import React from "react";

export default function MainContentContainer(props) {
  const { children } = props;
  return (
    <>
      <div className="flex  ">{children}</div>;
    </>
  );
}
