import { LOGIN_USER, UNSIGNUP_USER, UPDATE_USER, CHECK_PASSWORD, GET_USER, GET_CHILDRED_USER, ADD_CHILD_USER } from './types'
import { request, requestWithAuth, requestAuth } from '../../utils/axios'
import { createAction } from '@reduxjs/toolkit'

export function requestLoginUser(userInfo){  
  const returnData = request('post', '/login', userInfo)
    .catch(err=>{
      return err.response.status    
    })
  
  return {
    type: LOGIN_USER,
    payload: returnData
  }
}

export function requestUnsignupUser(userId){
  const returnData = requestWithAuth('delete', `/user/delete?id=${userId}`)
  return {
    type: UNSIGNUP_USER,
    payload: returnData
  }
}

export function requestUpdateUser(userInfo){
  let id = userInfo.id
  let param = {
    "email" : userInfo.email,
    "password" : userInfo.password,
    "name": userInfo.name,
    "phone" : userInfo.phone
  }
  const returnData = requestWithAuth('put', `/user/update?id=${id}`, param)
  return{
    type: UPDATE_USER,
    payload: returnData
  }
}

export function requestCheckPassword(userInfo){
  const returnData = requestWithAuth('post', `/user/checkPw`, userInfo)
  return{
    type: CHECK_PASSWORD,
    payload: returnData
  }
}

export function requestGetUser(userId){
  const returnData = requestWithAuth('get', `/user/search?id=${userId}`)
  return {
    type: GET_USER,
    payload: returnData
  }
}

export function requestGetChildren(userId){
  const returnData = requestWithAuth('get', `/user/sub/${userId}`)
  return {
    type: GET_CHILDRED_USER,
    payload: returnData
  }
}

export function requestAddChild(childInfo){
  const returnData = requestWithAuth('post', `/user/sub/add`, childInfo)
  return {
    type: ADD_CHILD_USER,
    payload: returnData
  }
}


export const requestSignupUser = createAction('SIGNUP_USER', function prepare(userInfo) {
  const returnData = request('post', `/join`, userInfo)
  return { payload: returnData }
}) 

export const requestIdConfirmUser = createAction('IDCONFIRM_USER', function prepare(userInfo) {
  const returnData = request('get', `/check?id=${userInfo.id}`)
  return { payload: returnData }
})

export const requestRandomGameByAge = createAction('RANDOM_GAME', function prepare(gameInfo) {
  const { level } = gameInfo
  const returnData = request('get', `/game/follow?level=${level}`)
  return { payload: returnData }
})

export const requestMugunghwaGame = createAction('MUGUNGHWA_GAME', function prepare(info){
  const level = info.level
  const returnData = request('get', `/game/follow?level=${level}`)
  return { payload: returnData }
})

export const requestExp = createAction('EXP', function prepare(userId) {
  const returnData = requestAuth('get', `/user/sub/status?user=${userId}`)
  return { payload: returnData }
})

export const requestRewardList = createAction('PROFILE_REWARD', function prepare(profileId) {
  const returnData = requestAuth('get', `/user/sub/cpslist?sid=${profileId}`)
  return { payload: returnData }
})

//allCharacters
export const requestAllCharacters = createAction('ALL_CHARACTERS', function prepare() {
  const returnData = requestAuth('get', `/user/chars`)
  return { payload: returnData }
})

//PROFILE Characters
export const requestProfileCharacters = createAction('PROFILE_CHARACTERS', function prepare(profileId) {
  const returnData = requestAuth('get', `/user/sub/mych/${profileId}`)
  return { payload: returnData }
})

// mypage
export const requestMypageInfo = createAction('MYPAGE_INFO', function prepare(profileId) {
  const returnData = requestAuth('get', `/user/sub/info?sid=${profileId}`)
  return { payload: returnData }
})

export const requestNextReward = createAction('GET_REWARD', function prepare(profileId) {
  const returnData = requestAuth('post', `/user/sub/req?sid=${profileId}`)
  return { payload: returnData }
})

export const requestNextCharacter = createAction('GET_CHARACTER', function prepare(payload) {
  const returnData = requestAuth('post', `/user/sub/getch`, payload)
  return { payload: returnData }
})