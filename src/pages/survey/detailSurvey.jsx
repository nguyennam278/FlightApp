import React, { useState, useEffect } from "react";

import dfData from "../../Common/DefaultConfig.json";
import useSetHeader from "../../components/hooks/useSetHeader";

import api from "../../Common/api";
import { getSetting } from "zmp-sdk/apis";
import {
  followOA,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  showToast,
} from "zmp-sdk/apis";

import { useLocation } from "react-router-dom";

import { useRecoilState } from "recoil";
import {
  Page,
  Box,
  Text,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Modal,
} from "zmp-ui";
import { useNavigate } from "react-router";

import { phoneNumberUser } from "../../recoil/RecoilState";
import moment from "moment";

export default function DetailSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const { OtpGroup, Option } = Select;

  const [listAwnser, setListAwnser] = useState([]);
  const [errMess, setErrMess] = useState("");

  const [infoUser, setInfoUser] = useState("");
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [listOtherAns, setListOtherAns] = useState([]);
  const [listSub, setLisSub] = useState([]);
  const [listSubAns, setListSubAns] = useState([]);
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Detail Survey",
      customTitle: false,
    });
  }, []);
  useEffect(() => {
    if (location.state.id != undefined) {
      getListQuestions(location.state.id);
    }
  }, [location.state.id]);

  console.log("phone:", phoneNumber);
  useEffect(() => {
    getUser();
  }, []);

  const getSetting = async () => {
    try {
      const data = await getSetting({
        success: async (data) => {
          try {
            var checkPhone = false;
            if (data.authSetting["scope.userPhonenumber"] == false) {
              checkPhone = await getPhoneUser();
            } else {
              submitAnswer();
              if (phoneNumber == "") {
                checkPhone = await getPhoneUser();
              } else {
                checkPhone = true;
                submitAnswer();
              }
            }
          } catch (error) {
            console.log("ERROR catch process", error);
          }
        },
        fail: (error) => {
          console.log("ERROR fail", error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (listSub.length > 0) {
  //     let list = [];
  //     listSub.map((item) => {
  //       const obj = {};
  //       obj.subQuestionId = item.subQuestionId;
  //       obj.responseData = "";
  //       obj.questionId = "";

  //       list.push(obj);
  //     });
  //     setListSubAns([...list]);
  //   }
  // }, [listSub]);

  useEffect(() => {
    if (questions.length > 0) {
      let list = [];
      questions.map((item) => {
        const obj = {};
        obj.questionId = item.questionId;
        obj.responseData = "";

        list.push(obj);
      });
      setListAwnser([...list]);
    }
  }, [questions]);

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      setInfoUser(userInfo);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const getPhoneUser = async () => {
    try {
      const accessToken = await getAccessToken({});
      getPhoneNumber({
        success: async (data) => {
          let { token } = data;
          api
            .post("ZaloHelperApi/GetPhoneNumber", {
              accessToken: accessToken,
              tokenNumber: token,
              secretKey: dfData.secretKey,
            })
            .then((res) => {
              setPhoneNumber(res.data.number);
            })

            .catch((err) => console.log(err));
        },
        fail: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openToast = async (text) => {
    try {
      const data = await showToast({
        message: text,
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const submitAnswer = () => {
    console.log("vao duoc r");
    //validate lại answerother

    let listAnsValidate = [...listAwnser];
    for (let i = 0; i < listAwnser.length; i++) {
      if (listAnsValidate[i].responseData.includes("Other")) {
        let ques = questions.find(
          (q) => q.questionId == listAnsValidate[i].questionId,
        );
        if (ques && (ques.questionTypeId == 3 || ques.questionTypeId == 4)) {
          let ansOther = listOtherAns.find(
            (x) => x.questionId == ques.questionId,
          )?.AnsOther;
          listAnsValidate[i].responseData = listAnsValidate[
            i
          ].responseData.replace("Other", ansOther);
        }
      }
    }

    let obj = {
      responseId: 0,
      userZaloId: infoUser.id,
      responses: listAnsValidate,
      responseDate: moment().format(),
      updateTime: moment().format(),
      phoneNumber: phoneNumber,
      avatar: infoUser.avatar,
    };

    api
      .post(`SurveyApi/CreateSurveyResponse`, obj)
      .then((res) => {
        if (res.code == 1) {
          followOA({
            id: dfData.oaId,
            success: (res) => {
              setDialogVisible(true);
            },
            fail: (err) => {
              setDialogVisible(true);
            },
          });
        } else {
          setErrMess(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
        openToast(error);
      });

    let submitSubAnswer = {
      userZaloId: infoUser.id,
      phoneNumber: phoneNumber,
      responses: listSubAns,
    };

    api
      .post(`SurveyApi/CreateSurveyResponse`, submitSubAnswer)
      .then((res) => {
        console.log("Res code sub question:", res.code);
      })
      .catch((error) => console.log(error));
  };

  const sendAnwser = () => {
    let check = validateSurvey(listAwnser);
    if (check == true) {
      setErrMess("");
      if (phoneNumber) {
        submitAnswer();
      } else {
        getSetting();
      }
    } else {
      setErrMess("Vui lòng trả lời đầy đủ câu hỏi");
    }
  };

  const validateSurvey = (listAwnser) => {
    const result = listAwnser.filter((item) => item.responseData == "");
    if (result.length === 0) {
      return true;
    } else {
      let check = true;
      result.forEach((item) => {
        let ques = questions.find((q) => q.questionId == item.questionId);
        if (ques && ques.isRequired == true) {
          check = false;
        }
      });
      return check;
    }
  };

  const handleAnswerData = (questionId, responseData, typeId) => {
    if (listAwnser.length > 0) {
      const index = (element) => element.questionId == questionId;

      const result = listAwnser.findIndex(index);

      listAwnser[result].responseData = responseData;
      if (typeId == 4) {
        if (responseData == "Other") {
          showInput(questionId, true);
        } else {
          showInput(questionId, false);
        }
      }
      if (typeId == 3) {
        if (responseData.includes("Other")) {
          showInput(questionId, true);
        } else {
          showInput(questionId, false);
        }
      }
    }
  };

  const getListQuestions = (surveyId) => {
    api
      .get(`/SurveyApi/GetSurveyQuestionBySurveyId?`, {
        params: {
          surveyId: surveyId,
        },
      })
      .then((res) => {
        setQuestions([...res.Data]);
      })
      .catch((error) => console.log(error));
  };

  const showInput = (questionId, isShow) => {
    let elem = document.getElementById("addOtherAswer_" + questionId);
    if (isShow) {
      var obj = {
        questionId: questionId,
        AnsOther: "",
      };
      var listNew = [...listOtherAns];
      listNew.push(obj);
      setListOtherAns([...listNew]);
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
      setListOtherAns([
        ...listOtherAns.filter((item) => item.questionId != questionId),
      ]);
    }
  };

  // const checkSelect = (subId, questionId, ans) => {
  //   console.log("value: ", valueSub);

  //   var listAns = valueSub.filter(
  //     (item) => item.questionId != questionId && item.subId == subId
  //   );
  //   console.log("lisst: ", listAns);
  //   const obj = {
  //     questionId: questionId,
  //     subId: subId,
  //     ans: ans,
  //   };
  //   listAns.push({ ...obj });
  //   setValueSub([...listAns]);
  // };

  const checkSelect = () => {
    var listSubQuestion = document.getElementsByClassName("input_radio_sub");
    let list = [];
    for (let i = 0; i < listSubQuestion.length; i++) {
      if (listSubQuestion[i].checked) {
        let subId = listSubQuestion[i].getAttribute("subQuestionId");
        list.push({
          subId,
          answer: listSubQuestion[i].value,
        });
      }
      setListSubAns([...list]);
    }
  };

  const handleSurveyList = (listQuestion) => {
    if (listQuestion.length > 0) {
      return (
        <>
          {listQuestion.map((item, index) => {
            if (item.questionTypeId == 1) {
              return (
                <div key={index}>
                  <h4>
                    {item.questionContent}
                    {item.isRequired && <span style={{ color: "red" }}>*</span>}
                  </h4>

                  <Input
                    onChange={(event) => {
                      handleAnswerData(item.questionId, event.target.value, 1);
                    }}
                  />
                </div>
              );
            } else if (item.questionTypeId == 2) {
              return (
                <div key={index}>
                  <h4>
                    {item.questionContent}
                    {item.isRequired && <span style={{ color: "red" }}>*</span>}
                  </h4>

                  <Select
                    closeOnSelect={true}
                    placeholder="Chọn câu trả lời"
                    onChange={(value) => {
                      handleAnswerData(item.questionId, value, 2);
                    }}
                  >
                    <OtpGroup>
                      {item.questionOption.map((anwser, index) => {
                        return (
                          <Option key={index} value={anwser} title={anwser} />
                        );
                      })}
                    </OtpGroup>
                  </Select>
                </div>
              );
            } else if (item.questionTypeId == 4) {
              return (
                <div key={index}>
                  <h4>
                    {item.questionContent}
                    {item.isRequired && <span style={{ color: "red" }}>*</span>}
                  </h4>
                  <Radio.Group
                    onChange={(value) => {
                      handleAnswerData(item.questionId, value, 4);
                    }}
                  >
                    {item.questionOption.map((anwser, index) => {
                      return (
                        <Box key={index} mt={4}>
                          <Radio name="radio" value={anwser} label={anwser} />
                        </Box>
                      );
                    })}
                    <Box mt={3}>
                      <Radio label="Khác: " value="Other" />
                    </Box>
                    <div
                      id={`addOtherAswer_${item.questionId}`}
                      style={{ display: "none", width: "90vw" }}
                    >
                      <Input
                        placeholder="Vui lòng điền câu trả lời"
                        value={
                          listOtherAns.find(
                            (f) => f.questionId == item.questionId,
                          )?.AnsOther
                        }
                        onChange={(event) => {
                          var index = listOtherAns.findIndex(
                            (x) => x.questionId == item.questionId,
                          );
                          if (index >= 0) {
                            var listNewAns = [...listOtherAns];
                            listNewAns[index].AnsOther = event.target.value;
                            setListOtherAns([...listNewAns]);
                          }
                        }}
                      />
                    </div>
                  </Radio.Group>

                  <Box>
                    {getSubQuestionList(
                      item.subQuestions,
                      4,
                      item.questionOption,
                    )}
                  </Box>
                </div>
              );
            } else if (item.questionTypeId == 3) {
              return (
                <div key={index}>
                  <h4>
                    {item.questionContent}
                    {item.isRequired && <span style={{ color: "red" }}>*</span>}
                  </h4>
                  <Checkbox.Group
                    onChange={(value) => {
                      handleAnswerData(item.questionId, value.toString(), 3);
                    }}
                  >
                    {item.questionOption.map((anwser, index) => {
                      return (
                        <Box key={index} mt={4}>
                          <Checkbox value={anwser} label={anwser} />
                        </Box>
                      );
                    })}
                    <Box mt={3}>
                      <Checkbox
                        id="checkboxOther"
                        label="Khác: "
                        value="Other"
                      />
                    </Box>
                    <div
                      id={`addOtherAswer_${item.questionId}`}
                      style={{ display: "none", width: "90vw" }}
                    >
                      <Input
                        placeholder="Vui lòng điền câu trả lời"
                        value={
                          listOtherAns.find(
                            (f) => f.questionId == item.questionId,
                          )?.AnsOther
                        }
                        onChange={(event) => {
                          var index = listOtherAns.findIndex(
                            (x) => x.questionId == item.questionId,
                          );
                          if (index >= 0) {
                            var listNewAns = [...listOtherAns];
                            listNewAns[index].AnsOther = event.target.value;
                            setListOtherAns([...listNewAns]);
                          }
                        }}
                      />
                    </div>
                  </Checkbox.Group>
                  <Box>
                    {getSubQuestionList(
                      item.subQuestions,
                      3,
                      item.questionOption,
                    )}
                  </Box>
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </>
      );
    } else {
      return <></>;
    }
  };

  const getSubQuestionAnswer = (subId, questionId, ans) => {
    if (listSubAns.length > 0) {
      const index = (element) => element.subQuestionId === subId;
      const result = listSub.findIndex(index);

      listSubAns[result].questionId = questionId;
      listSubAns[result].responseData = ans;
    }
  };

  const getSubQuestionList = (listSubQuestion, type, listOption) => {
    if (listSubQuestion.length > 0 && listOption.length > 0) {
      return (
        <>
          <Box
            style={{
              width: "90vw",
              overflowX: "scroll",
            }}
          >
            <div className="sub_questions">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {listOption.map((item, index) => {
                      return (
                        <>
                          <th>{item}</th>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {listSubQuestion && (
                    <>
                      {listSubQuestion.map((item, indexBig) => {
                        return (
                          <tr name={indexBig} key={indexBig}>
                            <th scope="row">{item.subQuestionContent}</th>
                            {listOption && (
                              <>
                                {listOption.map((test, index) => {
                                  for (let i = 0; i < listOption.length; i++) {
                                    return (
                                      <td>
                                        <input
                                          className="input_radio_sub input_radio"
                                          type={
                                            type === 3 ? "checkbox" : "radio"
                                          }
                                          name={`same_${indexBig}_${item.questionId}`}
                                          value={test}
                                          subQuestionId={item.subQuestionId}
                                          onChange={(e) => checkSelect()}
                                        />
                                      </td>
                                    );
                                  }
                                })}
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Box>
        </>
      );
    }
  };

  return (
    <>
      <Page
        hideScrollbar={true}
        className="section-container"
        style={{ height: "90vh", margin: 0 }}
      >
        <Box>
          <Text.Header style={{ textAlign: "center", fontWeight: "bold" }}>
            {location.state.name} <br />
            {location.state.desc}
          </Text.Header>
        </Box>

        <Box>{handleSurveyList(questions)}</Box>

        <Box mt={3} style={{ fontSize: 17, fontWeight: 600, color: "red" }}>
          {errMess ? errMess : " "}
        </Box>
        <Box
          mt={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              sendAnwser();
            }}
          >
            Gửi
          </Button>
        </Box>
        <Modal
          visible={dialogVisible}
          title="Thành công"
          onClose={() => {
            setDialogVisible(false);
            navigate(-1);
          }}
          actions={[
            {
              text: "Đóng",
              close: true,
              highLight: true,
            },
          ]}
          description="Cảm ơn bạn đã thực hiện khảo sát"
        />
      </Page>
    </>
  );
}
