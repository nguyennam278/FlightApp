import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Page, Box, Text, Spinner } from "zmp-ui";
import api from "../../Common/api";
import dfData from "../../Common/DefaultConfig.json";
import "./survey.css";
import useSetHeader from "../../components/hooks/useSetHeader";

export default function Survey() {
  const navigate = useNavigate();
  const [listSurvey, setListSurvey] = useState([]);
  const [loading, setLoading] = useState(false);
  const setHeader = useSetHeader();
  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Survey List",
      customTitle: false,
    });
    getListSurvey();
  }, []);

  const getListSurvey = () => {
    setLoading(true);
    api
      .get(`/SurveyApi/GetListSurvey?miniAppId=${dfData.appid}`)
      .then((res) => {
        setListSurvey([...res.Data]);
      });
    setLoading(false);
  };

  return (
    <Page hideScrollbar={true} className="section-container">
      <Box>
        <Text.Title className="title-survey">Danh sách khảo sát</Text.Title>
      </Box>

      {/* Set loading */}
      {loading == true ? (
        <Spinner />
      ) : (
        <Box mt={6}>
          <div className="survey-content">
            {listSurvey.map((item, index) => {
              return (
                <div
                  key={index}
                  className="survey-item"
                  onClick={() => {
                    navigate("/detail-survey", {
                      state: {
                        id: item.surveyId,
                        name: item.surveyName,
                        desc: item.surveyDesc,
                      },
                    });
                  }}
                >
                  {item.surveyName}
                </div>
              );
            })}
          </div>
        </Box>
      )}
    </Page>
  );
}
