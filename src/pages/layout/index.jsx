import React, { useState } from "react";
import { BottomNavigation, Icon, Page } from "zmp-ui";

const LayoutNavigatePage = () => {
  const [activeTab, setActiveTab] = useState("post");
  return (
    <Page className="page">
      <BottomNavigation
        fixed
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          if (key == "me") {
            () => navigate("/user");
          }
        }}
      >
        <BottomNavigation.Item
          key="post"
          label="Tin tức"
          icon={<Icon icon="zi-chat" />}
          activeIcon={<Icon icon="zi-chat-solid" />}
        />
        <BottomNavigation.Item
          key="contact"
          label="Tra cứu"
          icon={<Icon icon="zi-call" />}
          activeIcon={<Icon icon="zi-call-solid" />}
        />
        <BottomNavigation.Item
          key="me"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
        />
      </BottomNavigation>
    </Page>
  );
};

export default LayoutNavigatePage;
