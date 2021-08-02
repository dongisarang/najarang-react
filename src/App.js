import React, { Component } from "react";
import TopLayout from "./component/TopLayout";
import LoginPage from "./component/LoginPage";
import NaverLogin from "react-naver-login";
import ListPage from "./component/ListPage";
import ListRead from "./component/ListRead";
import ListComponent from './component/ListComponent'
import CreateContent from "./component/CreateContent";
import styled from "styled-components";
import SignUpPage from "./component/SignUpPage";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import useStores from "./hooks/useStores";
import { observer, useObserver } from "mobx-react";
import ListProvider from '../src/component/ListProvider'
import "antd/dist/antd.css"; // css를 가져온다
import { Button } from 'antd';
const App = () => {
  const { UserStore } = useStores();
  const handleSignClick = () => {
    UserStore.setCreateAccount(true);
  };
  return useObserver(() => {
    return (
      <Router>
        <Layout>
          <HomeLayout>
            <Link to="/">Najarang</Link>
          </HomeLayout>
          <Link to="/login">
            <Btn onClick={handleSignClick}>회원가입</Btn>
          </Link>
          <Link to="/login">
            {UserStore.getLogin() ? <Btn>로그아웃</Btn> : <Btn>로그인</Btn>}
          </Link>
        </Layout>

        <Route
          path="/"
          render={(props) => {
            return <TopLayout />;
          }}
          exact={true}
        />
        <Route path="/login" component={LoginPage} exact={true} />
        <Route
          path="/list"
          exact={true}
        >
          <ListProvider>
            <ListPage />
          </ListProvider>
        </Route>
        <Route path="/signup" component={SignUpPage} exact={true} />
        <Route path="/createContent" component={CreateContent} exact={true} />
        <Route
          path="/listRead"
          exact={true}
        >
          <ListProvider>
            <ListRead />
          </ListProvider>
        </Route>
      </Router>
    );
  });
};
const Layout = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #58b4ae;
  padding: 2px 2px 6px 2px;
  a {
    text-decoration: none;
    color: white;
  }
`;
const HomeLayout = styled.div`
  flex: 10;
  align-items: center;
  display: flex;
  margin-left: 10px;
  font-size: 30px;
  font-family: 1.2em "Fira Sans", sans-serif;
  font-weight: bold;
  color: #58b4ae;
  background-color: #58b4ae;
`;

const Btn = styled(Button)`
  margin: 10px 10px 0px 0px;
  background-color: #ffffff;
  border: 0px solid #58b4ae;
  border-radius: 5px;
  background-color: #58b4ae;
  padding: 5px;
  color: #ffffff;
  button:hover{
    color: #58b4ae;
  }
`;

export default App;
//background-color:#8885a4;
//render={props =>{ return( <Login/> )}}
