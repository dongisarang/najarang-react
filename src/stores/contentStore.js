/** @format */

import { observable } from 'mobx'
import contentRepository from './repositories/contentRepository'
const contentStore = observable({
    flag: true,
    topic: '',
    selectTopic: '',
    userEmail: '',
    clickContentIndex: '',
    currentTopic: '',
    contentList: [],
    selectList: '',
    topicList: [],
    searchKeyword: '',
    setSelectMainTopic(selectTopic) {
        this.selectTopic = selectTopic
    },
    getSelectMainTopic() {
        return this.selectTopic
    },
    async setTopicList() {
        const response = await contentRepository.topicListGet()
        if (response?.data?.msg === 'success') {
            this.topicList = response.data.list
            return true
        }
        return false
    },
    async modifyContent(boarderId, queryObj) {
        const response = await contentRepository.boardsUpdate(
            boarderId,
            queryObj,
        )
        if (response?.data.msg === 'success') {
            return true
        }
        return false
    },
    async deleteContent(boarderId) {
        const response = await contentRepository.boardDelete(boarderId)
        if (response?.data.msg === 'success') {
            return true
        }
        return false
    },
    getTopicList() {
        return this.topicList
    },
    setSelectList(selectList) {
        this.selectList = selectList
    },
    getSelectList() {
        return this.selectList
    },
    async setContentList(topicId) {
        const response = await contentRepository.boardsGet(topicId)
        if (response?.data?.msg === 'success') {
            console.log('response.data.list:', response.data.list)
            this.contentList = response.data.list
            return this.contentList
        }
        return false
    },
    async getBoard(boarderId) {
        const response = await contentRepository.boardGet(boarderId)
        if (response?.data?.msg === 'success') {
            console.log('response', response)
        }
        return false
    },
    async signIn(queryObj) {
        const response = await contentRepository.signInCreate(queryObj)
        if (response?.data?.msg === 'success') {
            return response
        }
        return false
    },
    async signUp(queryObj) {
        const response = await contentRepository.signUpCreate(queryObj)
        if (response?.data?.msg === 'success') {
            return response
        }
        return false
    },
    async createContent(form) {
        const response = await contentRepository.createContent(form)
        if (response?.data?.msg === 'success') {
            return true
        }
        return false
    },
    async createReply(queryObj) {
        const response = await contentRepository.replyCreate(queryObj)
        if (response?.data?.msg === 'success') {
            return true
        }
        return false
    },
    async updateReply(commentId, queryObj) {
        const response = await contentRepository.replyUpdate(
            commentId,
            queryObj,
        )
        if (response?.data?.msg === 'success') {
            return true
        }
        return false
    },
    async getReply(boardId) {
        const response = await contentRepository.ReplyGet(boardId)
        if (response?.data?.msg === 'success') {
            return response.data.list
        }
        return false
    },
    getContentList() {
        return this.contentList
    },
    getData() {
        return this.dataList
    },
    //고른 토픽들 넣는 함수
    addTopic(data) {
        const len = this.topic.length
        this.topic[len] = data.name
    },
    setSelectTopic(selectTopic) {
        this.selectTopic = selectTopic
    },
    getTopic() {
        return this.selectTopic
    },
    setUserEmail(userEmail) {
        this.userEmail = userEmail
    },
    getUserEmail() {
        return this.userEmail
    },
    setClickContentIndex(clickContentIndex) {
        this.clickContentIndex = clickContentIndex
    },
    getClickContentIndex() {
        return this.clickContentIndex
    },
    setCurrentTopic(data) {
        this.currentTopic = data
    },
    getCurrentTopic(topic) {
        return this.currentTopic
    },
})
export default contentStore
//export {contentStore}
