import styled from "styled-components";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import React, { Component, useContext } from "react";
import ListHeader from "./ListHeader";
import { FaEye } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import useStores from "../hooks/useStores";
import { useObserver } from "mobx-react";
import {EyeOutlined,MessageOutlined,LikeOutlined} from '@ant-design/icons';
const ListComponent = ({ content, index,clickTopic }) => {
  const { contentStore } = useStores();
  const handleClick = () => {
    contentStore.setClickContentIndex(index);
  };
  return useObserver(() => {
    return (
      <ContentLayout>
        <p>{content?.topic?.name}</p>
        <h2 onClick={() => handleClick()} style={{margin:"0.5rem 0rem 0rem 1rem"}}>{content?.title}</h2>
        <h4 style={{margin:"0.5rem 0rem 0rem 1rem"}}>
          {content?.content}
          </h4>
        <div className="iconDiv">
          <LikeOutlined style={{margin:"0.3rem 0rem 0rem 0rem"}}/>
          <h5 className="iconClass">{!content?.like_count ? '0' : content?.like_count}</h5>
          <MessageOutlined style={{margin:"0.3rem 0rem 0rem 0rem"}}/>
          <h5 className="iconClass">{!content?.hit_count ? '0' : content?.hit_count}</h5>
        </div>
      </ContentLayout>
    );
  });
};
const ContentLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0rem 0rem 0rem 0rem;
    font-family: 1.2em "Fira Sans", sans-serif;
    p{
      width: 4rem;
      display:flex;
      justify-content:center;
      border: 1px solid #cccccc;
      border-radius: 5px;
      background-color: #ffffff;
      padding: 4px;
      margin:0.6rem 0rem 0rem 1.4rem;
      font-size: 12px;
      color: #000000;
    }
    h2{
      font-weight: bold;
    }
    .iconClass{
      font-family: 1.2em "Fira Sans", sans-serif;
      margin: 0rem 0.5rem 0rem 0.5rem;
    }
    .iconDiv{
      display:flex;
      flex-direction:row;
      justify-content:center;
      margin: 0.5rem 0rem 0rem 50rem;
    }
`;
export default ListComponent;
