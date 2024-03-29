import React, { Component, useState } from "react";
import styled from "styled-components";
import googleLogin from "./googleLogin";
//import { StyledText } from '../style';
import KaKaoLogin from "react-kakao-login";
import { observer, inject } from "mobx-react";
import GoogleLogin from "react-google-login";
import useStores from "../hooks/useStores";
import {
  Link,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import SignUpPage from "./SignUpPage";
import axios from "axios";
// @inject("topic")
// @observer
const KakaoSignUp = ({ history }) => {
  const { contentStore, UserStore } = useStores();
  const [login, setLogin] = useState([]);
  const responseKaKao = async (res) => {
    res.provider = "kakao";
    contentStore.setUserEmail(res.profile.kakao_account.email);
    console.log("data: ", res, "  ", contentStore.getUserEmail());
    if (UserStore.createAccount) {
      history.push("/signup");
    } else {
      //로그인할때
      const queryObj = {
        email: contentStore.getUserEmail(),
        provider: "kakao",
      };
      const response = await contentStore.signIn(queryObj);
      if (response) {
        UserStore.setLogin(true);
        UserStore.setUserToken(response.data.result);
        history.push("/");
      }
      console.log("response: ", response);
    }
  };

  const responseFail = (err) => {
    //alert("아아아");
  };
  const responseGoogle = (response) => {
    console.log(response);
    response.provider = "google";
    fetch("http://localhost:3000/oauth").then(function (response) {
      return response.json();
    });
    //여기서 access_token=XX&provider=kakao 이런식으로 처리해서 서버로 보내주기
  };

  return (
    <div>
      <MainLayout>
        <h1> 로그인 방식을 선택해 주세요 </h1>{" "}
      </MainLayout>{" "}
      <MiddleLayout>
        <div className="content">
          <KaKaoBtn
            jsKey={"91e67ebb3e98ff0accfa0539dbe9698e"}
            onSuccess={responseKaKao}
            onFailure={responseFail}
            getProfile={true}
          >
            <p> 카카오로 회원가입 </p>{" "}
          </KaKaoBtn>{" "}
          <h6> 카카오로 인증하여 회원가입 </h6>{" "}
        </div>{" "}
      </MiddleLayout>{" "}
      <MiddleLayout>
        <div className="content">
          <GoogleBtn
            clientId="223281605678-qblodmohj92uq9ju7i1i4k624ui4u8hs.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseFail}
            cookiePolicy={"single_host_origin"}
          ></GoogleBtn>
          <h6> 구글로 인증하여 회원가입 </h6>{" "}
        </div>{" "}
      </MiddleLayout>{" "}
    </div>
  );
};
const MainLayout = styled.div`
  display: flex;
  justify-content: center;
`;
const MiddleLayout = styled.div`
  display: flex;
  width: 500px;
  height: 50px;
  margin: 0 auto;
  margin-top: 60px;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  flex-direction: column;
  .content {
    margin-left: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    h4 {
      margin: 0 auto;
    }
    h6 {
      margin-left: 30px;
      margin-top: 5px;
    }
  }
`;

// const StKaKaoLogin = styled.div`
//     cursor: pointer;
//     /* border-radius:10px; */
//     /* width: 200px; */
//     /* &:hover{
//         box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19);
//     } */
// `;

const GoogleBtn = styled(GoogleLogin)`
  width: 190px;
  height: 30px;
  margin: 0rem 0rem 2rem 0rem;
`;
const KaKaoBtn = styled(KaKaoLogin)`
  width: 190px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  font-family: "Noto Sans C JK KR";
  background-color: #fee500;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2);
  }
  p {
    margin: 0 auto;
  }
`;

export default KakaoSignUp;

{
  /* <NaverLogin 
                            clientId = "Aqpwh33bx4irAD87YKY8"
                            callbackUrl = "http://127.0.0.1:3000"
                                render={(props) => <MiddleLayout onClick={props.onClick}
                                >
                                    <div className="content">
                                    <button onClick={this.responseNaver}>네이버로 회원가입</button>
                                    <h6>네이버로 인증하여 회원가입</h6>
                                </div>
                                </MiddleLayout>}
                            onSuccess={(naverUser) => console.log('안녕안녕',naverUser)}
                            onFailure={(result) => console.log(result)}
                        /> */
}
