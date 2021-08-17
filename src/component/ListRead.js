/** @format */

import styled from 'styled-components'
import { Link, Route, BrowserRouter as Router } from 'react-router-dom'
import React, {
    Component,
    useEffect,
    useState,
    useCallback,
    useContext,
} from 'react'
import ListHeader from './ListHeader'
import { FaEye } from 'react-icons/fa'
import { FaRegThumbsUp } from 'react-icons/fa'
import { BsChatDots, BsJustify } from 'react-icons/bs'
import { BsBookmark } from 'react-icons/bs'
import { observer, inject } from 'mobx-react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useObserver } from 'mobx-react'
import useStores from '../hooks/useStores'
import { Button, Input, Select } from 'antd'
import ListContext from '../contexts/listContext'
import { values } from 'mobx'
import { useHistory } from 'react-router-dom'
import {
    FieldTimeOutlined,
    EyeOutlined,
    MessageOutlined,
    LikeOutlined,
} from '@ant-design/icons'
import { List } from 'antd/lib/form/Form'

const { Option } = Select
const { TextArea } = Input
/*
TODO: 수정 / 취소
*/
const ReplyComponent = ({ handleReplyChange, handleReplySave }) => {
    return (
        <ReplyCmpWrapper>
            <TextArea
                name="content"
                rows={5}
                onChange={handleReplyChange}
                placeholder="댓글을 입력해주세요"
            />
            <Button
                style={{
                    margin: '6rem 0rem 0rem 0.5rem',
                    background: '#ffb367',
                    border: '1px solid #ffb367',
                    color: '#ffffff',
                }}
                onClick={handleReplySave}
            >
                저장
            </Button>
        </ReplyCmpWrapper>
    )
}
const ListRead = () => {
    const { contentStore, UserStore } = useStores()
    const [user, setUser] = useState()
    const [modify, setModify] = useState(false)
    const [inputs, setInputs] = useState({
        topic: '',
        title: '',
        contents: '',
        reply: '',
    })
    const history = useHistory()
    const [content, setContent] = useState([])
    const [reply, setReply] = useState([])
    useEffect(() => {
        setUser(contentStore.getUserEmail())
        async function settingList() {
            const list = await contentStore.getContentList()
            const index = await contentStore.getClickContentIndex()
            setContent(list[index])
            if (list[index]) {
                let replyRes = await contentStore.getReply(list[index].id)
                setReply(replyRes)
            }
        }
        settingList()
    }, [])
    const handleModify = useCallback(() => {
        setModify(true)
    }, [])
    const handleModifyClick = useCallback(async () => {
        const token = UserStore.getUserToken()
        const obj = {
            id: content.id,
            title: inputs.title,
            content: inputs.contents,
            topicId: inputs.topic,
        }
        let form = new FormData()
        console.log('values:', values)
        form.append('id', content.id)
        form.append('title', inputs.title)
        form.append('content', inputs.contents)
        form.append('topicId', inputs.topic)
        if (inputs?.uploadFile)
            form.append('files', inputs?.uploadFile.file.originFileObj)
        const response = await contentStore.modifyContent(content.id, form, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response) {
            history.push('/list')
        }
    }, [inputs, content])
    const handleModifyCancel = useCallback(() => {
        setModify(false)
    }, [])
    //TODO: handleChange 부분 하나로 합치기
    const handleChange = (e) => {
        const { value, name } = e.target
        setInputs({
            ...inputs,
            [name]: value,
        })
    }
    const handleContentChange = (e) => {
        const { value } = e.target
        setInputs({
            ...inputs,
            contents: value,
        })
    }
    const handleReplyChange = (e) => {
        const { value } = e.target
        setInputs({
            ...inputs,
            reply: value,
        })
    }
    const handleSelectChange = (value) => {
        setInputs({
            ...inputs,
            topic: value,
        })
    }
    const handleDelete = useCallback(async () => {
        const data = await contentStore.deleteContent(content.id)
        if (data) {
            //성공했을시
            history.push('/list')
        }
    }, [content])
    const handleReplySave = useCallback(async () => {
        const query = {
            content: inputs.reply,
            boardId: content.id,
        }
        const data = await contentStore.createReply(query)
        if (data) {
            //성공했을시
            console.log('성공')
        }
    })
    return useObserver(() => {
        return (
            <PageLayout>
                {modify && (
                    <Wrapper>
                        <ReadWrapper>
                            <Select
                                style={{
                                    width: 120,
                                    margin: '2rem 0rem 0rem 2rem',
                                }}
                                onChange={handleSelectChange}
                                value={content?.topic?.name}
                            >
                                {contentStore.topicList.map((topic) => {
                                    return (
                                        <Option value={topic.id}>
                                            {topic.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Inputs
                                name="title"
                                placeholder="제목을 쓰세요."
                                onChange={handleChange}
                                style={{
                                    width: '20rem',
                                    margin: '1rem 0rem 0rem 2rem',
                                }}
                                // value={title}
                            />
                            <TextAreas
                                name="contents"
                                rows={30}
                                onChange={handleContentChange}
                                style={{
                                    width: '40rem',
                                    margin: '1rem 0rem 0rem 2rem',
                                }}
                                // value={contents}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    margin: '1rem 0rem 0rem 2rem',
                                    flexDirection: 'row',
                                }}
                            >
                                <ModifyButton onClick={handleModifyClick}>
                                    저장
                                </ModifyButton>
                                <ModifyCancleButton
                                    onClick={handleModifyCancel}
                                >
                                    취소
                                </ModifyCancleButton>
                            </div>
                        </ReadWrapper>
                    </Wrapper>
                )}
                {modify === false && (
                    <Wrapper>
                        <ReadWrapper>
                            <p className="category">{content?.topic?.name}</p>
                            <h1>{content?.title}</h1>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    borderBottom: '1px solid #cccccc',
                                    margin: '0rem 0rem 2rem 0rem',
                                    height: '4rem',
                                }}
                            >
                                <p className="name">
                                    {content?.user_id ?? '익명'}
                                </p>
                                <p className="time">{content?.created}</p>
                                <EyeOutlined
                                    style={{
                                        margin: '0.7rem 0rem 0rem 0.3rem',
                                    }}
                                />
                                <p className="hitCount">
                                    {!content?.hit_count
                                        ? '0'
                                        : content?.hit_count}
                                </p>
                                <MessageOutlined
                                    style={{
                                        margin: '0.7rem 0rem 0rem 0.3rem',
                                    }}
                                />
                                <p className="likeCount">
                                    {!content?.like_count
                                        ? '0'
                                        : content?.like_count}
                                </p>
                                {user === content?.user?.email && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <ButtonComponent onClick={handleModify}>
                                            수정
                                        </ButtonComponent>
                                        <ButtonComponent onClick={handleDelete}>
                                            삭제
                                        </ButtonComponent>
                                    </div>
                                )}
                            </div>
                            <div style={{ margin: '0rem 0rem 0rem 2rem' }}>
                                {content?.content}
                            </div>
                            <div>
                                {content?.imageUrls && (
                                    <>
                                        {content.imageUrls.map((url) => {
                                            return (
                                                <img
                                                    src={`https://image.najarang.com/${url}`}
                                                    alt=""
                                                    style={{
                                                        width: '15rem',
                                                        margin: '2rem 0rem 0rem 0rem',
                                                    }}
                                                />
                                            )
                                        })}
                                    </>
                                )}
                            </div>
                            <ReplyWrapper>
                                <ReplyComponent
                                    handleReplyChange={handleReplyChange}
                                    handleReplySave={handleReplySave}
                                />
                                {reply.map((list) => {
                                    return (
                                        <div className="replyWrapper">
                                            <span>{list.content}</span>
                                            <span className="replyDate">
                                                {list.created}
                                            </span>
                                        </div>
                                    )
                                })}
                            </ReplyWrapper>
                        </ReadWrapper>
                    </Wrapper>
                )}
            </PageLayout>
        )
    })
}
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50rem;
    margin: 0rem 0rem 0rem 1rem;
`
const ReadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    height: 100%;
    font-family: 'Roboto', 'Noto Sans KR', 'AppleSDGothicNeo-Regular',
        'Malgun Gothic', '맑은 고딕', 'dotum', '돋움', sans-serif;
    .category {
        width: 3rem;
        display: flex;
        justify-content: center;
        border: 0px solid #8885a4;
        border-radius: 5px;
        background-color: #ffb367;
        padding: 4px;
        margin: 2rem 0rem 0rem 2rem;
        font-size: 12px;
        color: #ffffff;
    }
    h1 {
        margin: 1rem 0rem 0rem 2rem;
    }
    .name {
        width: 2rem;
        margin: 0.5rem 0rem 0rem 2rem;
    }
    .time {
        width: auto;
        margin: 0.5rem 0rem 0rem 0.5rem;
    }
    .hitCount {
        width: auto;
        margin: 0.5rem 0rem 0rem 0.5rem;
    }
    .likeCount {
        width: auto;
        margin: 0.5rem 0rem 0rem 0.5rem;
    }
`
const ReplyCmpWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: auto;
    margin: 8rem 0rem 0rem 0rem;
    font-family: 'Roboto', 'Noto Sans KR', 'AppleSDGothicNeo-Regular',
        'Malgun Gothic', '맑은 고딕', 'dotum', '돋움', sans-serif;
`
const ReplyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: auto;
    margin: 7rem 0rem 0rem 0rem;
    border-bottom: 1px solid #f0f0f0;
    font-family: 'Roboto', 'Noto Sans KR', 'AppleSDGothicNeo-Regular',
        'Malgun Gothic', '맑은 고딕', 'dotum', '돋움', sans-serif;
    .replyWrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 5rem;
        margin: 0.5rem 0rem 0rem 0.5rem;
        border-bottom: 1px solid #f0f0f0;
    }
    .replyDate {
        margin: 0.5rem 0rem 0rem 0.5rem;
    }
`

const ButtonComponent = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0rem 0rem 0rem 0.5rem;
`
const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
`
const ModifyButton = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    border: 2px solid #ffb367;
    background-color: #ffb367;
    color: #ffffff;
    margin: 0rem 0rem 0rem 0.5rem;
`
const ModifyCancleButton = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    border: 2px solid #ffb367;
    background-color: #ffffff;
    color: #000000;
    margin: 0rem 0rem 0rem 0.5rem;
`
const Inputs = styled(Input)`
    width: 40rem;
`
const TextAreas = styled(TextArea)`
    width: 40rem;
`

export default ListRead
