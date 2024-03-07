// Import Recoil
import { atom, useRecoilState, useRecoilValue } from "recoil";

// Create an Atom
export const listBlog = atom({
  key: "listBlog", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (can be any valid JavaScript value)
});

// export const listNew = atom({
//   key: "listNew", // unique ID (with respect to other atoms/selectors)
//   default: [], // default value (can be any valid JavaScript value)
// });

export const phoneNumberUser = atom({
  key: "phoneNumberUser", // tên duy nhất cho atom
  default: "", // giá trị mặc định là chuỗi rỗng
});

export const actionTab = atom({
  key: "actionTab", // tên duy nhất cho atom
  default: "home", // giá trị mặc định là chuỗi rỗng
});

export const infoUser = atom({
  key: "infoUser", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (can be any valid JavaScript value)
});

export const isShowFollowOA = atom({
  key: "isShowFollowOA", // unique ID (with respect to other atoms/selectors)
  default: true, // default value (can be any valid JavaScript value)
});

export const screenComponent = atom({
  key: "screenComponent",
  default: null,
});

export const checkURLLink = atom({
  key: "checkURLLink",
  default: {
    isLink: false,
    url: "",
  },
});

export const headerState = atom({
  key: "headerState",
  default: {},
});
