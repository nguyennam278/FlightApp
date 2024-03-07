import React, { useRef, useState } from "react";
import { Page, Box, Input, Tabs } from "zmp-ui";
import PopUpDetail from "../popUp/popUpDetail";
const Statistics = () => {
  const [searchBrand, setSearchBrand] = useState("");
  const [searchDay, setSearchDay] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
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
      status: "Chưa bay",
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
      status: "Chưa bay",
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
      status: "Đã bay",
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
      status: "Đã bay",
    },
  ];
  const filteredData = listFlight.filter((item) =>
    item.brand.toLowerCase().includes(searchBrand.toLowerCase())
  );

  const filteredDay = listFlight.filter((item) =>
    item.time.toLowerCase().includes(searchDay.toLowerCase())
  );

  const filterStatus = listFlight.filter((item) =>
    item.status.toLowerCase().includes(searchStatus.toLowerCase())
  );
  const popUpDetailRef = useRef(false);
  return (
    <Page style={{ height: "100vh", paddingTop: 70 }} hideScrollbar={true}>
      <Tabs>
        <Tabs.Tab key="tab1" label="Theo hãng">
          <Box>
            <Box mt={3} textAlign="center">
              <h3>Thống kê theo hãng</h3>
            </Box>

            <Input
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              placeholder="Nhập hãng hàng không cần tìm"
            />

            <Box mt={3}>
              {" "}
              <table className="table  table-striped  table-hover table-bordered">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hãng bay
                    </th>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Địa điểm
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Ngày
                    </th>
                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Trạng thái
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Box>{item.brand}</Box>
                        </td>
                        <td>
                          {item.placeStart}-{item.placeEnd}
                        </td>
                        <td>{item.time}</td>
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
          </Box>
        </Tabs.Tab>
        <Tabs.Tab key="tab2" label="Theo ngày">
          <Box>
            <Box mt={3} textAlign="center">
              {" "}
              <h3>Thống kê theo ngày</h3>
            </Box>

            <Input
              value={searchDay}
              onChange={(e) => setSearchDay(e.target.value)}
              placeholder="Nhập ngày cần tìm"
            />

            <Box mt={3}>
              {" "}
              <table className="table  table-striped  table-hover table-bordered">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Ngày
                    </th>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Địa điểm
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hãng bay
                    </th>
                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Trạng thái
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDay.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Box>{item.time}</Box>
                        </td>
                        <td>
                          {item.placeStart}-{item.placeEnd}
                        </td>
                        <td>{item.brand}</td>
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
          </Box>
        </Tabs.Tab>

        <Tabs.Tab key="tab3" label="Theo trạng thái">
          <Box>
            <Box textAlign="center" mt={3}>
              {" "}
              <h3>Thống kê theo trạng thái</h3>
            </Box>

            <Input
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              placeholder="Nhập trạng thái của chuyến bay"
            />

            <Box mt={3}>
              {" "}
              <table className="table  table-striped  table-hover table-bordered">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Địa điểm
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hãng bay
                    </th>
                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Ngày
                    </th>

                    <th
                      scope="col "
                      style={{ color: "#fff", background: "#333" }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterStatus.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Box>{item.status}</Box>
                        </td>
                        <td>
                          {item.placeStart}-{item.placeEnd}
                        </td>
                        <td>{item.brand}</td>
                        <td>{item.time}</td>
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
          </Box>
        </Tabs.Tab>
      </Tabs>

      <PopUpDetail ref={popUpDetailRef} />
    </Page>
  );
};
export default Statistics;
