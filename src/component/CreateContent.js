/** @format */

import styled from 'styled-components';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import React, { Component, useState } from 'react';
import useStores from '../hooks/useStores';
import { useObserver } from 'mobx-react';
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Modal } from 'antd';
import { Button, Input, Select } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const CreateContent = ({ visible, onCancle }) => {
    const { contentStore, UserStore } = useStores();
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');

    const handleChange = (value) => {
        contentStore.setSelectTopic(value);
        setTopic(value);
        console.log(value);
    };
    const handleContent = (e) => {
        setContent(e.target.value);
    };
    const handleTitle = (e) => {
        setTitle(e.target.value);
    };
    const handleCancle = () => {
        onCancle();
    };
    const handleCreate = async() => {
        //TODO: 내용 등록할때
        const queryObj = {
            title: title,
            content: content,
            topicId: topic,
        };
        //console.log("content: ", queryObj);
        const token = UserStore.getUserToken();
        try {
            const response = await axios.post('/board', queryObj, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
            if (response.data.msg === 'success') {
                alert('성공!');
                onCancle();
            }
        } catch (error) {
            console.log('createContent fail', error);
        }
    };
    return useObserver(() => {
        return (
            <CreateLayout
                visible={visible}
                footer={[
                    <Button
                        style={{ color: '#FFFFFF', background: '#ffb367',border:"0px solid" }}
                        onClick={handleCreate}>
                        등록하기
                    </Button>,
                    <Button onClick={handleCancle}>취소하기</Button>,
                ]}>
                <SelectLayout>
                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}>
                    {contentStore.topicList.map((topic) => {
                        return (
                            <Option value={topic.id}>
                                {topic.name}
                            </Option>
                        );
                    })}
                </Select>
                </SelectLayout>
                <TextLayout>
                <TitleInput 
                    name="title"
                    rows={1}
                    onChange={handleTitle}
                    placeholder="제목을 입력해주세요"
                    />
                    <ContentInput 
                    name="content"
                    rows={20}
                    onChange={handleContent}
                    placeholder="내용을 입력해주세요"
                    />
                </TextLayout>
            </CreateLayout>
        );
    });
};
const CreateLayout = styled(Modal)`
    display: flex;
    flex-direction: column;
`;
const SelectLayout = styled.div`
    display: flex;
    flex-direction: column;
`;
const TitleInput = styled(TextArea)` 
    margin:1rem 0rem 0rem 0rem;
`
const ContentInput = styled(TextArea)` 
    margin:1rem 0rem 0rem 0rem;
`
const TextLayout = styled.div`
    display: flex;
    flex-direction: column;
`;
const ButtonLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;
export default CreateContent;
