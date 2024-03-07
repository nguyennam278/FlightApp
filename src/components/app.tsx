import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { setStorage, login } from "zmp-sdk/apis";
import { RecoilRoot } from "recoil";
import api from "../Common/api";
import dataDf from "../Common/DefaultConfig.json";
import HomePage from "../pages";
import About from "../pages/about";
import Form from "../pages/form";
import User from "../pages/user";
import Post from "../pages/post";
import DetailPost from "../pages/post/DetailPost";
import Home from "../pages/home";
import Survey from "../pages/survey";
import Award from "../pages/awards";
import Event from "../pages/events";
import DetailEvent from "../pages/events/DetailEvent";
import DetailSurvey from "../pages/survey/detailSurvey";
import LuckeyWheel from "../pages/luckeywheel";
import AwardRules from "../pages/luckeywheel/AwardRules";
import AwardLuckyWheel from "../pages/luckeywheel/AwardLuckyWheel";
import HistoryLuckyWheel from "../pages/luckeywheel/HistoryLuckyWheel";
import Welcome from "../pages/welcome";
import AccountManager from "../pages/account";
import HomeWCM from "../pages/home/homeWCM";
import FirstWelcome from "../pages/welcome/welcomeLienKet";
import Campain from "../pages/luckeywheel/Campain";
import Layout from "../components/layout/layout";
import BottomNavigationPage from "./BottomNavigation";
import HistoryLuckyWheelGift from "../pages/luckeywheel/HistoryLuckyWheelGift";
import HomeDemo from "../pages/home/HomeDemo";
import DetailAward from "../pages/awards/DetailAward";
import SubWrap from "../pages/awards/subwrap";
import Header from "./layout/Header";
import ContainBooking from "../pages/containBooking";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <Header />
            <AnimationRoutes>
              <Route
                path="/"
                element={<Layout viewScreen={<HomePage></HomePage>}></Layout>}
              ></Route>

              <Route path="/about/:id" element={<About></About>}></Route>
              <Route path="/form" element={<Form></Form>}></Route>
              <Route path="/subwrap" element={<SubWrap></SubWrap>}></Route>
              <Route path="/user" element={<User></User>}></Route>
              <Route
                path="/post"
                element={<Layout viewScreen={<Post></Post>}></Layout>}
              ></Route>
              <Route
                path="/home"
                element={<Layout viewScreen={<Home></Home>}></Layout>}
              ></Route>
              <Route
                path="/event"
                element={<Layout viewScreen={<Event></Event>}></Layout>}
              ></Route>
              <Route path="/survey" element={<Survey></Survey>}></Route>
              <Route
                path="/homeWCM"
                element={<Layout viewScreen={<HomeWCM></HomeWCM>}></Layout>}
              ></Route>
              <Route
                path="/homeDemo"
                element={<Layout viewScreen={<HomeDemo></HomeDemo>}></Layout>}
              ></Route>

              <Route
                path="/me"
                element={
                  <Layout
                    viewScreen={<AccountManager></AccountManager>}
                  ></Layout>
                }
              ></Route>
              <Route
                path="/detail-event"
                element={
                  <Layout viewScreen={<DetailEvent></DetailEvent>}></Layout>
                }
              ></Route>
              <Route
                path="/detail-award"
                element={<DetailAward></DetailAward>}
              ></Route>
              <Route
                path="/detail-survey"
                element={
                  <Layout viewScreen={<DetailSurvey></DetailSurvey>}></Layout>
                }
              ></Route>
              <Route
                path="/detailPost"
                element={
                  <Layout viewScreen={<DetailPost></DetailPost>}></Layout>
                }
              ></Route>
              {/* ----- Vòng quay may mắn ------- */}
              <Route
                path="/welcomeWheelGift/:campainCode"
                element={<Welcome></Welcome>}
              ></Route>
              <Route
                path="/luckywheel/:campainCode"
                element={
                  <Layout viewScreen={<LuckeyWheel></LuckeyWheel>}></Layout>
                }
              ></Route>
              <Route
                path="/firstWelcome"
                element={<FirstWelcome></FirstWelcome>}
              ></Route>
              <Route
                path="/awardRules"
                element={
                  <Layout viewScreen={<AwardRules></AwardRules>}></Layout>
                }
              ></Route>
              <Route
                path="/awardLuckyWheel"
                element={
                  <Layout
                    viewScreen={<AwardLuckyWheel></AwardLuckyWheel>}
                  ></Layout>
                }
              ></Route>

              <Route
                path="/historyLuckyWheel"
                element={
                  <Layout
                    viewScreen={<HistoryLuckyWheel></HistoryLuckyWheel>}
                  ></Layout>
                }
              ></Route>

              <Route
                path="/historyLuckyWheelGift"
                element={
                  <Layout
                    viewScreen={<HistoryLuckyWheelGift></HistoryLuckyWheelGift>}
                  ></Layout>
                }
              ></Route>

              <Route
                path="/first_welcome"
                element={
                  <Layout viewScreen={<FirstWelcome></FirstWelcome>}></Layout>
                }
              ></Route>

              <Route
                path="/campain"
                element={<Layout viewScreen={<Campain></Campain>}></Layout>}
              ></Route>

              {/* Booking Flight */}
              <Route
                path="/contain_booking"
                element={
                  <Layout
                    viewScreen={<ContainBooking></ContainBooking>}
                  ></Layout>
                }
              ></Route>
            </AnimationRoutes>
            <BottomNavigationPage></BottomNavigationPage>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
