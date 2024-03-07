import { atom } from "recoil";
import { userInfo } from "zmp-sdk";

export const userState = atom<userInfo>({
  key: "user",
  default: {
    id: "1241244",
    name: "MiniApp News",
    avatar: "ZA",
  },
});
