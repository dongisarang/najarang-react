/** @format */

import styled from 'styled-components';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import React, { Component, useState, useEffect, useCallback,useContext } from 'react';
import useStores from '../hooks/useStores';
import { useObserver } from 'mobx-react';
import ListComponent from './ListComponent';
import { Tabs,Button,Input } from 'antd';
import ListContext from '../contexts/listContext'
const ListPage = () => {
    const { contentStore } = useStores();
    const [topic, setTopic] = useState([]);
    const [clickTopic, setClickTopic] = useState(
        contentStore.selectTopic.split('_')[0]
    );
    const [states, setStates] = useState({
        tabContent:[],
        filterTabContent:[],
        keyword:''
    });
    const {tabContent,filterTabContent,keyword} = states;
    //const {topicName,setTopicName} = useContext(ListContext);
    //토픽에 애초에 본인이 선택한 토픽만 나오도록 해야함
    useEffect(() => {
        async function fetchContent() {
            const data = await contentStore.setContentList(contentStore.selectTopic.split('_')[1]);
            setStates({
                tabContent:data,
                filterTabContent:data
            })
        }
        fetchContent();
        setTopic(contentStore.topicList); //토픽 리스트 셋팅
        contentStore.currentTopic = contentStore.selectTopic.split('_')[0]
    }, []);
    useEffect(()=>{
        if(keyword){
            setStates({
                ...states,
                filterTabContent:tabContent.filter((data)=> {
                    return data.title.includes(keyword)        
                })
            })
        }
        else if(contentStore.searchKeyword){
            setStates({
                ...states,
                filterTabContent:tabContent.filter((data)=> {
                    return data.title.includes(contentStore.searchKeyword)        
                })
            })
        }
        else{
            setStates({
                ...states,
                filterTabContent:tabContent
            })
        }
        
    },[tabContent,keyword])
    const handleSearch = useCallback((e)=>{
        setStates({
            ...states,
            keyword:e.target.value
        })
    },[keyword])
    const handleTabClick = useCallback(async(topicId)=>{
        const data = await contentStore.setContentList(topicId);
        setTabContent(data)
    },[tabContent])
    return useObserver(() => {
        return (
            <ListLayout>
                <CategoryLayout>
                    <div>
                        {
                            topic.map((item,idx)=>{
                                return <TabButton onClick={()=>handleTabClick(item.id)}>{item.name}</TabButton>
                            })
                        }
                    
                    </div>
                    <SearchInput
                        placeholder="내용 검색"
                        type="text"
                        className="form-control"
                    // onChange={onChange}
                    onPressEnter={handleSearch}
                ></SearchInput>
                </CategoryLayout>
                <ContentLayout>
                {filterTabContent && filterTabContent.map((data,idx)=>{
                    return (
                        <ListViewLayout>
                            <MainLayout>
                                <Link to='/listRead'>
                                    <ListComponent
                                        content={data}
                                        index={idx}
                                        clickTopic={clickTopic}></ListComponent>
                                </Link>
                            </MainLayout>
                        </ListViewLayout>
                    );
                                    })}
                </ContentLayout>
            </ListLayout>
        );
    });
};
const ListLayout = styled.div`
    display: flex;
    flex-direction: column;
`;
const ContentLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem 0rem 0rem 0rem;
`;
const ListViewLayout = styled.div`
    display: flex;
    flex-direction: row;
    width: 80rem;
    margin: 0rem 0rem 0rem 18.5rem;
`;
const MainLayout = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    border-bottom: 1px solid #d3d3d3;
    height: 9rem;
    a {
        text-decoration: none;
        color: black;
    }
    p {
        display: flex;
        margin-left: 5px;
    }
    h2 {
        display: flex;
        margin: 0px 0px 1px 5px;
    }
    h4 {
        display: flex;
        margin: 0px 0px 1px 5px;
    }
    h5 {
        margin: 0px 0px 1px 5px;
    }
    .row {
        display: flex;
        flex-direction: row;
        .icon {
            flex: 3;
        }
        .bookMark {
            margin-left: 10px;
            flex: 1;
        }
    }
`;
const CategoryLayout = styled.div`
    display: flex;
    width:auto;
    border:1px solid #d3d3d3;
    margin:1rem 0rem 0rem 0rem;
    justify-content:center;
    padding: 0.4rem;
    /* margin-left: 100px;
    margin-right: 100px; */
    div{
        display:flex;
        margin:0rem 50rem 0rem 0rem;
        flex-direction:row;
    }
    p {
        flex: 1;
        border-bottom: 1px solid black;
        justify-content: center;
        padding: 10px;
        align-items: center;
    }
`;
const SearchInput = styled(Input)` 
    width: 15rem;
`
const TabButton = styled(Button)` 
    border:0rem solid;
    font-family: 1.2em "Fira Sans", sans-serif;
    font-weight: bold;
    color: #58b4ae;
    font-size:20px;
    text-align:center;
    width:5rem;
    display:flex;
    align-items:center;
    justify-content:center;
`
const TabWapper = styled(Tabs)`
    width: auto;
    flex:display;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;

    .ant-tabs-tab.ant-tabs-tab-active {
    border-bottom: 2px solid #ffb367 !important;
    background-color:#ffb367 !important;
    color:#ffffff;
    z-index: 2;
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
        color:#ffffff;
    }
    /* .ant-tabs-tab-btn{
        color:#ffffff;
    } */
    .ant-tabs-tab{
        width:20rem;
        text-align:center;
        display:flex;
        justify-content:center;
    }
    
`
export default ListPage;
