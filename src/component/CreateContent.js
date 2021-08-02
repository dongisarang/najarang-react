/** @format */

import styled from 'styled-components';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import React, { Component, useEffect, useState } from 'react';
import useStores from '../hooks/useStores';
import { useObserver } from 'mobx-react';
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Modal } from 'antd';
import API from '../lib/API'
import { Button, Input, Select, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import qs from 'query-string'
const { Option } = Select;
const { TextArea } = Input;
const CreateContent = ({ visible, onCancle }) => {
    const { contentStore, UserStore } = useStores();
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState([]);
    const [form] = Form.useForm();
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
    const handleCreate = async () => {
        //TODO: 내용 등록할때
        const newTitle = form.getFieldValue('title')
        form.validateFields().then(async (values) => {
            //onSubmit(values);
            let form = new FormData();
            console.log('values:', values)
            form.append('title', values.title);
            form.append('content', values.content);
            form.append('topicId', topic);
            if (values.uploadFile)
                form.append('files', values.uploadFile.file.originFileObj);
            try {
                const response = await API.post('/boards', form, {
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": 'multipart/form-data'
                        // 'Accept': 'application/json; charset=utf-8'
                    },
                    withCredentials: true

                });
                //const response = await contentStore.createContent(form);
                console.log(response)
                if (response) {
                    alert('성공!');
                    onCancle();
                }
            } catch (error) {
                console.log('createContent fail', error);
            }
        })
        // const queryObj = {
        //     title: title,
        //     content: content,
        //     topicId: topic,
        //     file:file
        // };
        // let form = new FormData();
        // form.append('title',title);
        // form.append('content',content);
        // form.append('topicId',topic);
        // //file.forEach((item) => form.append("file", item))
        // form.append('file', JSON.stringify(file));
        // //console.log("content: ", queryObj);
        // const token = UserStore.getUserToken();
        // try {
        //     console.log('값변환',qs.stringify(queryObj))
        //     const response = await axios.post('/board',form, {
        //         headers: {
        //             // Authorization: `Bearer ${token}`,
        //             "Content-Type": 'multipart/form-data'
        //             // 'Accept': 'application/json; charset=utf-8'
        //         },
        //         withCredentials: true 

        //     });
        //     console.log(response)
        //     if (response.data.msg === 'success') {
        //         alert('성공!');
        //         onCancle();
        //     }
        // } catch (error) {
        //     console.log('createContent fail', error);
        // }
    };
    const props = {
        multiple: true,
        beforeUpload(newFile) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(newFile);
                // reader.readAsBinaryString(newFile)
                reader.onload = () => {
                    //   let baseStirng = reader.result.substr(reader.result.indexOf('base64,') + 7)
                    setFile([reader.result])
                    resolve(reader.result)
                };
                reader.onerror = reject;
            });
        },

    };
    const handleFinish = (value) => {
        console.log('handleFinish: ', value)
    }
    return useObserver(() => {
        return (
            <CreateLayout
                visible={visible}
                footer={[
                    <Button
                        style={{ color: '#FFFFFF', background: '#ffb367', border: "0px solid" }}
                        onClick={handleCreate}
                        key="submit"
                        type="primary"
                        htmlType="submit"
                    >
                        등록하기
                    </Button>,
                    <Button onClick={handleCancle}>취소하기</Button>,
                ]}>
                <Form
                    onFinish={handleFinish}
                    form={form}
                >
                    <Form.Item
                        label="topicId"
                        name="topicId"
                    >
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
                    </Form.Item>
                    <Form.Item
                        label="title"
                        name="title"
                    >
                        <TitleInput
                            name="title"
                            rows={1}
                            onChange={handleTitle}
                            placeholder="제목을 입력해주세요"
                        />
                    </Form.Item>
                    <Form.Item
                        label="uploadFile"
                        name="uploadFile"
                    >
                        <Upload {...props} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>이미지 업로드</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="content"
                        name="content"
                    >
                        <TextLayout>
                            <ContentInput
                                name="content"
                                rows={20}
                                onChange={handleContent}
                                placeholder="내용을 입력해주세요"
                            />
                        </TextLayout>
                    </Form.Item>
                </Form>
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
