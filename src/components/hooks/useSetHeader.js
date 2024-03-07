import { useSetRecoilState } from "recoil";
import appConfig from "../../../app-config.json";
import { headerState } from "../../recoil/RecoilState";
import { useCallback, useEffect } from "react";

const useSetHeader = () => {
  const setHeader = useSetRecoilState(headerState);

  return useCallback(
    ({
      route = "",
      hasLeftIcon = true,
      rightIcon = null,
      title = appConfig.app.title,
      customTitle = false,
      type = "primary",
    }) => {
      setHeader({
        route,
        hasLeftIcon,
        rightIcon,
        title,
        customTitle,
        type,
      });
    },

    [setHeader],
  );
};

export default useSetHeader;
