import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Modal, Box, Input, Button } from "zmp-ui";

const PopUpDetail = forwardRef((props, ref) => {
  const [popUpDetail, setPopUpDetail] = useState(false);
  const [data, setData] = useState({});

  const open = (dataFlight) => {
    setData(dataFlight);
    setPopUpDetail(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <Modal
      maskClosable={false}
      mask={true}
      visible={popUpDetail}
      onClose={() => {
        setPopUpDetail(false);
      }}
      title={
        <div
          style={{ float: "right", fontSize: 15 }}
          onClick={() => setPopUpDetail(false)}
        >
          X
        </div>
      }
    >
      <Box style={{ paddingTop: 10 }}>
        <Box>
          <Box
            mt={3}
            textAlign="center"
            style={{ fontSize: 18, fontWeight: 700, paddingBottom: 10 }}
          >
            Chi tiết chuyến bay
          </Box>

          <Box flex justifyContent="space-between">
            <Box>
              <Input
                className="input_flight"
                value={data.placeStart}
                label={<b>Điểm đi</b>}
              />
            </Box>

            <Box>
              <Input
                className="input_flight"
                value={data.startTime}
                label={<b>Giờ khởi hành</b>}
              />
            </Box>
          </Box>

          <Box mt={3} flex justifyContent="space-between" gap="10px">
            <Box>
              <Input
                className="input_flight"
                value={data.placeEnd}
                label={<b>Điểm đến</b>}
              />
            </Box>

            <Box>
              <Input
                className="input_flight"
                value={data.endTime}
                label="Giờ đến"
              />
            </Box>
          </Box>

          <Box mt={3} flex justifyContent="space-between" gap="10px">
            <Box>
              <Input
                className="input_flight"
                value={data.brand}
                label={<b>Hãng bay</b>}
              />
            </Box>

            <Box>
              <Input
                className="input_flight"
                value={data.key}
                label={<b>Chuyến bay</b>}
              />
            </Box>
          </Box>

          <Box mt={3}>
            <Box>
              <b>Trạng thái</b>{" "}
              <span>
                <Button
                  size="small"
                  style={{
                    marginLeft: 10,
                    background: data.status === "Đã cất cánh" ? "green" : "red",
                  }}
                >
                  {data.status}
                </Button>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
});

export default PopUpDetail;
