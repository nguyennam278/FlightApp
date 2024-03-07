const getValueInputOnChange = (textDF, obj) => {
  let textRs = textDF;
  var textAdd = obj.nativeEvent?.data;
  if (textAdd) {
    textRs = textDF + textAdd + "";
  }
  return textRs;
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export { getValueInputOnChange, isEmpty };
