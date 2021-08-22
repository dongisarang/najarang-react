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
import { observer, inject } from 'mobx-react'
import { MoreOutlined } from '@ant-design/icons'
import { useObserver } from 'mobx-react'
import useStores from '../hooks/useStores'
import { Button, Input, Select, Popover } from 'antd'
import ListContext from '../contexts/listContext'
import { values } from 'mobx'
import { useHistory } from 'react-router-dom'

const { Option } = Select
const { TextArea } = Input
const ReplyComponent = ({ handleReplyChange, handleReplySave }) => {
    return (
        <ReplyCmpWrapper>
            <TextArea
                name="content"
                rows={3}
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
//TODO: 댓글 수정할때 모든 버튼 같이 바뀜
const Reply = ({
    handleReplyChange,
    handleReplySave,
    reply,
    setReply,
    userSelf,
}) => {
    console.log('userSelf: ', reply)
    const { contentStore, UserStore } = useStores()
    const [replyModify, setReplyModify] = useState(false)
    const [inputs, setInputs] = useState(``)
    const handlePlusReply = () => {
        // alert('클릭!')
    }
    const handleModifyChange = (e) => {
        setInputs(e.target.value)
    }
    const hanldeClick = (idx) => {
        setReplyModify(true)
        let newModifyReply = {
            id: reply[idx].id,
            content: <Input onChange={handleModifyChange} />,
        }
        const newReply = [...reply]
        newReply[idx] = newModifyReply
        setReply(newReply)
    }
    const hanldeClickModify = async (idx) => {
        let newModifyReply = {
            id: reply[idx].id,
            content: inputs,
        }
        const newReply = [...reply]
        newReply[idx] = newModifyReply
        setReply(newReply)
        const response = await contentStore.updateReply(reply[idx].id, {
            content: inputs,
        })
    }
    const popoverContent = <div onClick={handlePlusReply}>답글쓰기</div>
    return (
        <ReplyWrapper>
            <ReplyComponent
                handleReplyChange={handleReplyChange}
                handleReplySave={handleReplySave}
            />
            {reply.map((list, idx) => {
                return (
                    <div className="replyWrapper">
                        <span key={idx}>{list?.content}</span>
                        <span className="replyDate">{list?.created}</span>
                        <Popover content={popoverContent}>
                            <MoreOutlined
                                rotate={90}
                                style={{
                                    margin: '0rem 0rem 0rem 0rem',
                                }}
                                on
                            />
                        </Popover>
                        {userSelf && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                {!replyModify && (
                                    <>
                                        <ButtonComponent
                                            onClick={() => hanldeClick(idx)}
                                        >
                                            수정
                                        </ButtonComponent>
                                        <ButtonComponent onClick={''}>
                                            삭제
                                        </ButtonComponent>
                                    </>
                                )}
                                {replyModify && (
                                    <ButtonComponent
                                        onClick={() => hanldeClickModify(idx)}
                                    >
                                        저장
                                    </ButtonComponent>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </ReplyWrapper>
    )
}
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
    height: 8rem;
    margin: 7rem 0rem 0rem 0rem;
    border-bottom: 1px solid #f0f0f0;
    font-family: 'Roboto', 'Noto Sans KR', 'AppleSDGothicNeo-Regular',
        'Malgun Gothic', '맑은 고딕', 'dotum', '돋움', sans-serif;
    .replyWrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
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
    width: '2rem';
    margin: 0rem 0rem 0rem 0rem;
`
export default Reply
