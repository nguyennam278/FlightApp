import React, { useState, useRef } from "react";
import { Page, Box, Button, Input, Select } from "zmp-ui";
import "./contain.css";
import PopUpDetail from "../popUp/popUpDetail";
const Flight = () => {
  const { OtpGroup, Option } = Select;
  const [isShow, setIsShow] = useState(false);
  const [dataFlight, setDataFlght] = useState(false);
  const popUpDetailRef = useRef(false);
  const listFlight = [
    {
      flightId: 1,
      startTime: "22:05",
      placeStart: "HCM",
      endTime: "00:30",
      placeEnd: "HN",
      brand: "VietJett",
      time: "04/03/2024",
      key: "VN1",
      status: "Đã cất cánh",
    },
    {
      flightId: 2,
      startTime: "00:30",
      placeStart: "HCM",
      endTime: "02:30",
      placeEnd: "DN",
      brand: "VietNam Airline",
      time: "05/03/2024",
      key: "VN2",
      status: "Hủy chuyến bay",
    },

    {
      flightId: 3,
      startTime: "17:00",
      placeStart: "Hue",
      endTime: "19:05",
      placeEnd: "HCM",
      brand: "VietJett",
      time: "06/03/2024",
      key: "VN3",
      status: "Đã cất cánh",
    },
    {
      flightId: 4,
      startTime: "10:00",
      placeStart: "VN",
      endTime: "17:00",
      placeEnd: "USA",
      brand: "VietJett",
      time: "07/03/2024",
      key: "VN4",
      status: "Đã cất cánh",
    },
  ];

  return (
    <Page hideScrollbar="true" style={{ background: "#ddd", height: "100vh" }}>
      <Box style={{ textAlign: "center", marginBottom: 10, marginTop: 20 }}>
        <h2>Flight</h2>
      </Box>

      <Box
        style={{
          background: "#00a9c4",
          padding: 10,
          marginBottom: 20,
        }}
      >
        <Box className="test_box">
          <Box> Điểm đi</Box>
          <Box>
            <Select className="select" closeOnSelect={true}>
              <Option value="1" title="Hồ Chí Minh" />
              <Option value="2" title="Hà Nội" />
              <Option value="3" title="Đà Nẵng" />
              <Option value="4" title="Huế" />
            </Select>
          </Box>
        </Box>
        <Box className="test_box">
          <Box> Điểm đến</Box>
          <Box>
            <Select className="select" closeOnSelect={true}>
              <Option value="1" title="Hồ Chí Minh" />
              <Option value="2" title="Hà Nội" />
              <Option value="3" title="Đà Nẵng" />
              <Option value="4" title="Huế" />
            </Select>
          </Box>
        </Box>

        <Box className="test_box">
          <Box> Ngày</Box>
          <Box>
            <Select className="select" closeOnSelect={true}>
              <Option value="1" title="1/1/2024" />
              <Option value="2" title="2/1/2024" />
              <Option value="3" title="3/1/2024" />
              <Option value="4" title="4/1/2024" />
            </Select>
          </Box>
        </Box>

        <Box className="test_box">
          <Box> Giờ</Box>
          <Box>
            <Select className="select" closeOnSelect={true}>
              <Option value="1" title="0h-6h" />
              <Option value="2" title="6h-12h" />
              <Option value="3" title="12hh-18h" />
              <Option value="4" title="18h-0h" />
            </Select>
          </Box>
        </Box>

        <Box style={{ textAlign: "center", paddingTop: 10 }}>
          <Button size="small">Tìm kiếm</Button>
        </Box>
      </Box>

      <Box>
        <table className="table  table-striped  table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col" style={{ color: "#fff", background: "#333" }}>
                Thời gian
              </th>
              <th scope="col" style={{ color: "#fff", background: "#333" }}>
                Hãng
              </th>
              <th scope="col " style={{ color: "#fff", background: "#333" }}>
                Chuyến bay
              </th>
              <th scope="col " style={{ color: "#fff", background: "#333" }}>
                Trạng thái
              </th>
              <th scope="col " style={{ color: "#fff", background: "#333" }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {listFlight.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Box
                      flex
                      justifyContent="center"
                      alignItems="center"
                      style={{ fontWeight: "bold" }}
                    >
                      {" "}
                      <div>
                        <div>{item.startTime}</div>
                        <div>{item.placeStart}</div>
                      </div>
                      <div style={{ padding: "0px 5px" }}>-</div>
                      <div>
                        <div>{item.endTime}</div>
                        <div>{item.placeEnd}</div>
                      </div>
                    </Box>
                  </td>
                  <td>{item.brand}</td>
                  <td>{item.key}</td>
                  <td>{item.status}</td>
                  <td
                    onClick
                    style={{ textDecoration: "underline" }}
                    onClick={() => {
                      popUpDetailRef.current.open(item);
                    }}
                  >
                    Chi tiết
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
      <PopUpDetail ref={popUpDetailRef} />
    </Page>
  );
};

export default Flight;
