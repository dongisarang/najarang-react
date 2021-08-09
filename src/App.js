import React, { Component } from 'react'
import TopLayout from './component/TopLayout'
import LoginPage from './component/LoginPage'
import NaverLogin from 'react-naver-login'
import ListPage from './component/ListPage'
import ListRead from './component/ListRead'
import ListComponent from './component/ListComponent'
import CreateContent from './component/CreateContent'
import styled from 'styled-components'
import SignUpPage from './component/SignUpPage'
import { Link, Route, BrowserRouter as Router } from 'react-router-dom'
import useStores from './hooks/useStores'
import { observer, useObserver } from 'mobx-react'
import ListProvider from '../src/component/ListProvider'
import 'antd/dist/antd.css' // css를 가져온다
import { Button } from 'antd'
const App = () => {
    const { UserStore } = useStores()
    const handleSignClick = () => {
        UserStore.setCreateAccount(true)
    }
    document.cookie = 'same-site-cookie=foo; SameSite=Lax'
    document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure'
    return useObserver(() => {
        return (
            <Router>
                <Layout>
                    <HomeLayout>
                        <Link
                            to="/"
                            style={{
                                color: 'black',
                                margin: '0rem 0rem 0rem 13rem',
                            }}
                        >
                            Najarang
                        </Link>
                    </HomeLayout>
                    <Link to="/login">
                        <Btn onClick={handleSignClick}>회원가입</Btn>
                    </Link>
                    <Link to="/login">
                        {UserStore.getLogin() ? (
                            <LoginBtn>로그아웃</LoginBtn>
                        ) : (
                            <LoginBtn>로그인</LoginBtn>
                        )}
                    </Link>
                </Layout>

                <Route
                    path="/"
                    render={(props) => {
                        return <TopLayout />
                    }}
                    exact={true}
                />
                <Route path="/login" component={LoginPage} exact={true} />
                <Route path="/list" exact={true}>
                    <ListProvider>
                        <ListPage />
                    </ListProvider>
                </Route>
                <Route path="/signup" component={SignUpPage} exact={true} />
                <Route
                    path="/createContent"
                    component={CreateContent}
                    exact={true}
                />
                <Route path="/listRead" exact={true}>
                    <ListProvider>
                        <ListRead />
                    </ListProvider>
                </Route>
            </Router>
        )
    })
}
const Layout = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    padding: 2px 2px 6px 2px;
    a {
        text-decoration: none;
        color: white;
    }
`
const HomeLayout = styled.div`
    /* flex: 5; */
    align-items: center;
    display: flex;
    margin-left: 10px;
    font-size: 30px;
    font-family: 1.2em 'Fira Sans', sans-serif;
    font-weight: bold;
    width: 60%;
    height: 5rem;
    background-color: #ffffff;
    margin: 0rem 0rem 0rem 10rem;
`

const Btn = styled(Button)`
    margin: 1.5rem 1rem 0rem 0rem;
    border: 2px solid #ffb367;
    background-color: #ffb367;
    padding: 1.2rem;
    display: flex;
    justify-content: center;
    font-family: 1.2em 'Fira Sans', sans-serif;
    align-items: center;
    color: #ffffff;
    button:hover {
        color: #58b4ae;
    }
`
const LoginBtn = styled(Button)`
    margin: 1.5rem 30.5rem 0rem 0rem;
    border: 2px solid #ffb367;
    background-color: #ffffff;
    padding: 1.2rem;
    display: flex;
    justify-content: center;
    font-family: 1.2em 'Fira Sans', sans-serif;
    align-items: center;
    color: #000000;
    button:hover {
        color: #58b4ae;
    }
`
export default App
//background-color:#8885a4;
//render={props =>{ return( <Login/> )}}
