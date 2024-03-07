import React, { useState, useEffect } from "react";
import { Page } from "zmp-ui";

const Layout = ({ viewScreen }) => {
  return (
    <Page
      hideScrollbar={true}
      style={{ overflow: "inherit", height: "100vh" }}
      restoreScroll={true}
    >
      {viewScreen}
    </Page>
  );
};

export default Layout;
