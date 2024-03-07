import React, { useState, useEffect } from "react";
import { Box, Text, Modal } from "zmp-ui";
import api from "../../Common/api";
export default function SubWrap(props) {
  const [listSub, setListSub] = useState(props.units);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailSubAward, setDetailSubAward] = useState([]);
  return (
    <Box>
      <Box style={{ paddingLeft: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: 600 }}>{props.name}</Text>
        <Box
          style={{
            maxHeight: 200,
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            overflow: "hidden",
            overflowX: "scroll",
          }}
        >
          {listSub ? (
            listSub.map((item, index) => {
              return (
                <Box
                  style={{
                    padding: 10,
                    width: "50%",
                    height: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                  onClick={() => {
                    {
                      setModalVisible(true);
                      setDetailSubAward(item);
                    }
                  }}
                >
                  <img
                    style={{ width: 100, height: 100, borderRadius: 10 }}
                    src={item.image}
                  />
                  <Text>{item.unitName}</Text>
                </Box>
              );
            })
          ) : (
            <Text>Chưa có giải thưởng nào</Text>
          )}
        </Box>
      </Box>

      <Modal
        visible={modalVisible}
        modalClassName="modal-info"
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <Box className="sub-award-popup">
          <Box style={{ width: "100%", height: "100%" }}>
            <img src={detailSubAward?.image} />
          </Box>
          <span onClick={() => setModalVisible(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">{detailSubAward?.unitName}</p>
            <p>{detailSubAward?.unitDesc}</p>
            <p>Tesst</p>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
