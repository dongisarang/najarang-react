/** @format */

import styled from 'styled-components';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import React, { Component, useEffect, useState, useCallback, useContext } from 'react';
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
import { FieldTimeOutlined, EyeOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';

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
    const [content, setContent] = useState([]);
    useEffect(() => {
        setUser(contentStore.getUserEmail());
        function settingList() {
            const list = contentStore.getContentList();
            const index = contentStore.getClickContentIndex();
            setContent(list[index])
        }
        settingList();
    }, []);
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
        const data = await contentStore.modifyContent(content.id, obj, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [inputs, content]);
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
    const handleContentChange = (e) => {
        const { value } = e.target;
        setInputs({
            ...inputs,
            contents: value
        })
    }
    const handleSelectChange = (value) => {
        setInputs({
            ...inputs,
            topic: value,
        });
    };
    const handleDelete = useCallback(async () => {
        const data = await contentStore.deleteContent(content.id);
        if (data) {
            //성공했을시
            history.push("/list");
        }
    }, [content])
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
                            <span>{content?.topic?.name}</span>
                        </CategoryLayout>
                        <TitleLayout>
                            <h1>{content?.title}</h1>
                        </TitleLayout>
                        <UserLayout>
                            <span>{content?.user_id}</span>
                        </UserLayout>
                        <TimeLayout>
                            <FieldTimeOutlined style={{ margin: "0.3rem 0rem 0rem 1.3rem" }} />
                            <span>{content?.created}</span>
                            <EyeOutlined style={{ margin: "0.3rem 0rem 0rem 0.3rem" }} />
                            <span>{!content?.hit_count ? '0' : content?.hit_count}</span>
                            <MessageOutlined style={{ margin: "0.3rem 0rem 0rem 0.3rem" }} />
                            <span>{!content?.like_count ? '0' : content?.like_count}</span>
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
                        <ContentsLayout>
                            {
                                content?.imageUrls && <>
                                    {
                                        content.imageUrls.map(url => {
                                            return <img src={`https://image.najarang.com/${url}`} />
                                        })
                                    }
                                </>
                            }
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
        width: 3rem;
        display:flex;
        justify-content:center;
        border: 0px solid #8885a4;
        border-radius: 5px;
        background-color: #ffb367;
        padding: 4px;
        margin:0.6rem 0rem 0rem 1.4rem;
        font-size: 12px;
        color: #ffffff;
    }
`;
const TitleLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1rem 0rem 0rem 2.3rem;
    font-family: 1.2em "Fira Sans", sans-serif;
    font-weight: bold;

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
    border-bottom: 1px solid #d3d3d3;
    width: 100rem;
    span{
        font-family: 1.2em "Fira Sans", sans-serif;
        color: #a9a9a9;
        margin: 0rem 0rem 0rem 0.3rem;
    }
`;
const ContentsLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 0px 10px 20px;
    height: 15rem;
    width: 100rem;
    border-bottom: 1px solid #d3d3d3;
    font-family: 1.2em "Fira Sans", sans-serif;

    span {
        margin: 20px 0px 10px 20px;
        font-size: 15px;
    }
`;
export default ListRead;
