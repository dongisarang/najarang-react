import React, { Component, useEffect, useState, useCallback } from "react";
import "./TopLayout.css";
import TopicLayout from "./TopicLayout";
import NewTopicLayout from "./NewTopicLayout";
import ListPage from "./ListPage";
import styled from "styled-components";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import { useObserver } from "mobx-react";
import { Modal, Button, Input } from "antd";
import CreateContent from "./CreateContent";
import useStores from "../hooks/useStores";
import { useHistory } from "react-router-dom";
import MainListComponent from "./MainListComponent";
import { CrownOutlined } from '@ant-design/icons';
/*
TODO: local state로 데이터 관리하기 -> ListRead에 어떻게 보낼지 고민해보기
*/
const HotTopicComponent = ({contentList,handleClick}) =>{

  return(
    <ListLayout>
          {contentList
            ? contentList.map((list, index) => {
                return (
                  <HotTopicListLayout>
                    <Link to="/listRead">
                      <div
                        onClick={() => {
                          handleClick(index);
                        }}
                      >
                        <p className="topicBox">{list.topic.name}</p>
                        <p className="topicTitle">{list.title}</p>
                      </div>
                    </Link>
                  </HotTopicListLayout>
                );
              })
            : null}
        </ListLayout>
  )
}
const TopLayout = () => {
  const { contentStore } = useStores();
  const [write, setWrite] = useState(false);
  const [input, setInput] = useState("");
  const history = useHistory();
  useEffect(() => {
    contentStore.setContentList();
    contentStore.setTopicList();
  }, []);
  const showModal = useCallback(() => {
    setWrite(true);
  }, [write]);
  const [open, setOpen] = useState(false);
  const handleClick = useCallback((index) => {
    contentStore.setClickContentIndex(index);
  }, [contentStore]);
  const handleTopicClick = useCallback((name, index) => {
    contentStore.setSelectMainTopic(`${name}_${index}`);
  }, [contentStore]);
  const handleCancle = useCallback(() => {
    setWrite(false);
  }, [write]);
  const onChange = useCallback((e) => {
    setInput(e.target.value);
    contentStore.searchKeyword = e.target.value;
  }, [input]);
  const handleRowClick = useCallback(async (boardId) => {
    await contentStore.getBoard(boardId);
  }, [contentStore]);
  const handleSearchClick = useCallback(() => {
    //TODO: MainPage에서 검색해서 list로 갈때 라우터 이용해서 할 수있는 방법 찾기
    history.push("/list");
  }, []);
  return useObserver(() => {
    return (
      <MainLayout>
        <TopLayoutWapper>
          <LeftLayoutWapper>
              <Input
                placeholder="관심있는 내용을 검색하세요!"
                type="text"
                className="form-control"
                onChange={onChange}
                onPressEnter={handleSearchClick}
                style={{margin:"3rem 0rem 0rem 23rem",width:"50%" ,height:"10%",borderRadius:"25px",border:"1px solid"}}
              ></Input>
              <HotTopicLayout>
                <div>
                <CrownOutlined />
                <span>핫토픽 리스트</span>
                </div>
              </HotTopicLayout>
              <HotTopicComponent contentList={contentStore.contentList} handleClick={handleClick}/>
          </LeftLayoutWapper>
          <TopicLayoutWapper>
          <TopicComponent>
            {/* <p className="title">나의 자랑거리</p> */}
            {contentStore.topicList.map((topic, index) => {
            if (index > 3) return <></>;
            return (
              <Link to="/list">
                <TopicCircle
                  onClick={() => {
                    handleTopicClick(topic.name, index+1);
                  }}
                >
                  <p className="topicName">{topic.name}</p>
                </TopicCircle>
              </Link>
            );
          })}
          <Button onClick={showModal} style={{margin:"5rem 0rem 0rem 1rem"}}>글쓰기</Button>
          </TopicComponent>
          </TopicLayoutWapper>
        </TopLayoutWapper>
        <BottomLayoutWapper>
          <HotTopicLayout>
            <div>
            <CrownOutlined />
            <span>핫토픽 리스트</span>
            </div>
          </HotTopicLayout>
          <HotTopicComponent contentList={contentStore.contentList} handleClick={handleClick}/>
        </BottomLayoutWapper>
        <CreateContent visible={write} onCancle={handleCancle} onClose={handleCancle}></CreateContent>
      </MainLayout>
    );
  });
};

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #cccccc;
  padding: 1px 1px 1px 0px;
  height:  100%;
`;
const TopLayoutWapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 35rem;
  width: 100%;
`;
const TopicLayoutWapper = styled.div`
  display: flex;
  flex:2;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;
const LeftLayoutWapper = styled.div`
  display: flex;
  flex:3;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const TopicComponent = styled.div`
  width: 38%;
  margin:1rem 0rem 0rem 0rem;
  background-color: #f0f0f0;
  font-family: "Roboto", "Noto Sans KR" ,"AppleSDGothicNeo-Regular" ,"Malgun Gothic" ,"맑은 고딕", "dotum" ,"돋움" ,sans-serif;
  font-size: 20px;
  font-weight: bold;
  .title{
    margin:2rem 0rem 0rem 1rem;
    /* text-align:center; */
  }
`;
const BottomLayoutWapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 40rem;
  width: 60%;
  margin:3rem 0rem 0rem 0rem;
`;
const TopicCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: #ffb367; */
    border: 0px solid #8885a4;
    width: 10rem;
    height: 3rem;
    margin:0rem 0rem 0.1rem 0rem;
    /* padding: 10px; */
    color: #000000;
    .topicName{
      width: 100%;
      margin:2rem 0rem 0rem 1rem;
      font-size: 20px;
    }

`;
const HotTopicLayout = styled.div`
    display: flex;
    flex-direction: column;
    div {
        display: flex;
        width: 30rem;
        margin: 3rem 0rem 0rem 23rem;
        align-items: center;
        padding: 0px 0px 10px 20px;
        font-family: 1.2em "Fira Sans", sans-serif;
        font-size: 17px;
        font-weight: bold;
        border-bottom: 1px solid #d3d3d3;
    }
    span {
      margin: 0rem 0rem 0rem 0.5rem;
    }
`;
const ListLayout = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: center;
    align-items: center; */
`;
const HotTopicListLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    a {
        text-decoration: none;
        color: black;
    }
    div {
        display: flex;
        width: 25rem;
        margin: 0rem 0rem 0rem 0rem;
        display: flex;
        flex-direction: row;
    }
    .topicBox {
        border: 1px solid #cccccc;
        border-radius: 5px;
        padding: 4px;
        margin:0.6rem 0rem 0rem 1.4rem;
        font-family: helvetica, sans-serif;
        font-size: 12px;
        color: #000000;
    }
    .topicTitle {
        font-family: helvetica, sans-serif;
        margin: 14px 0px 0px 20px;
        width: auto;
    }
`;
export default TopLayout;
