/** @format */

import styled from 'styled-components';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import React, { Component, useEffect, useState, useCallback,useContext } from 'react';
import ListHeader from './ListHeader';
import { FaEye } from 'react-icons/fa';
import { FaRegThumbsUp } from 'react-icons/fa';
import { BsChatDots, BsJustify } from 'react-icons/bs';
import { BsBookmark } from 'react-icons/bs';
import { observer, inject } from 'mobx-react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useObserver } from 'mobx-react';
import useStores from '../hooks/useStores';
import { Button, Input, Select } from 'antd';
import ListContext from '../contexts/listContext';
import { values } from 'mobx';
import { useHistory } from "react-router-dom";
const { Option } = Select;
const { TextArea } = Input;
/*
TODO: 수정 / 취소
*/
const ListRead = () => {
    const { contentStore, UserStore } = useStores();
    const [user, setUser] = useState();
    const [modify, setModify] = useState(false);
    const [inputs, setInputs] = useState({
        topic: '',
        title: '',
        contents: '',
    });
    const history = useHistory();
    // const [content,setContent] = useState([]);
    // const [index,setIndex] = useState([]);
    // const [list,setList] = useState([]);
    // const {topicName,setTopicName} = useContext(ListContext);
    useEffect(() => {
        setUser(contentStore.getUserEmail());
        function settingList(){
            // const list = contentStore.getContentList();
            // const index = contentStore.getClickContentIndex();
            // setList(contentStore.getContentList().filter((content)=>content.topic.name === contentStore.currentTopic))
            // setIndex(contentStore.getClickContentIndex());
            // setContent(list[index])
        }
        settingList();
    }, []);
    //TODO: useEffect로 초기화할때 함수로 넣어주기
    const list = contentStore.getContentList().filter((content)=>content.topic.name === contentStore.currentTopic);
    const index = contentStore.getClickContentIndex();
    const content = list[index];
    console.log('content', content);
    const handleModify = useCallback(() => {
        setModify(true);
    }, []);
    const handleModifyClick = useCallback(async () => {
        const token = UserStore.getUserToken();
        const obj = {
            id: content.id,
            title: inputs.title,
            content: inputs.contents,
            topicId: inputs.topic,
        };
        //   {
        //     ...content,
        //     inputs,
        // }
        const data = await contentStore.modifyContent(content.id,obj,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [inputs]);
    const handleModifyCancel = useCallback(() => {
        setModify(false);
    }, []);
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };
    const handleContentChange = (e) =>{
        const { value } = e.target;
        setInputs({
            ...inputs,
            contents:value
        })
    }
    const handleSelectChange = (value) => {
        setInputs({
            ...inputs,
            topic: value,
        });
    };
    const handleDelete = useCallback(async()=>{
        const data = await contentStore.deleteContent(content.id);
        if(data){
            //성공했을시
            history.push("/list");
        }
    },[])
    return useObserver(() => {
        return (
            <PageLayout>
                {modify && (
                    <>
                        <CategoryLayout>
                            <Select
                                style={{ width: 120 }}
                                onChange={handleSelectChange}>
                                {contentStore.topicList.map((topic) => {
                                    return (
                                        <Option value={topic.id}>
                                            {topic.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </CategoryLayout>
                        <TitleLayout>
                            <Input
                                name='title'
                                placeholder='제목을 쓰세요.'
                                onChange={handleChange}
                                // value={title}
                            />
                        </TitleLayout>

                        <ContentsLayout>
                            <TextArea
                                name='contents'
                                rows={30}
                                onChange={handleContentChange}
                                // value={contents}
                            />
                        </ContentsLayout>
                        <SaveLayout>
                            <Button onClick={handleModifyClick}>저장</Button>
                            <Button onClick={handleModifyCancel}>취소</Button>
                        </SaveLayout>
                    </>
                )}
                {modify === false && (
                    <>
                        <CategoryLayout>
                            <span>토픽</span>
                        </CategoryLayout>
                        <TitleLayout>
                            <h1>{content?.title}</h1>
                        </TitleLayout>
                        <UserLayout>
                            <span>{content?.user_id}</span>
                        </UserLayout>
                        <TimeLayout>
                            <AiOutlineClockCircle></AiOutlineClockCircle>
                            <span>{content?.created}</span>
                            <FaEye className='eye'></FaEye>
                            <span>{content?.hit_count}</span>
                            <BsChatDots className='reply'></BsChatDots>
                            <span>{content?.like_count}</span>
                            {user === content?.user?.email && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}>
                                    <ButtonComponent onClick={handleModify}>
                                        수정
                                    </ButtonComponent>
                                    <ButtonComponent onClick={handleDelete}>삭제</ButtonComponent>
                                </div>
                            )}
                        </TimeLayout>
                        <ContentsLayout>
                            <span>{content?.content}</span>
                        </ContentsLayout>
                    </>
                )}
            </PageLayout>
        );
    });
};

const ButtonComponent = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
`;
const CategoryLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0px 1px 20px;
    span {
    }
`;
const TitleLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0px 1px 20px;
`;
const UserLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px 0px 10px 20px;
    span {
        font-size: 1px;
    }
`;
const SaveLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0px 1px 20px;
`;
const TimeLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px 0px 0px 20px;
    padding: 0px 0px 20px 0px;
    border-bottom: 1px solid;
    span {
        font-size: 1px;
        margin: 0px 0px 0px 5px;
    }
    .eye {
        margin: 0px 0px 0px 15px;
    }
    .reply {
        margin: 0px 0px 0px 15px;
    }
`;
const ContentsLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 0px 10px 20px;
    height: 100px;
    border-bottom: 1px solid;
    span {
        margin: 20px 0px 10px 20px;
        font-size: 10px;
    }
`;
export default ListRead;
