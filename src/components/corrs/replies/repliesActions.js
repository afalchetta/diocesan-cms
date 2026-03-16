import { FETCH_REPLIES, CREATE_REPLY, DELETE_REPLY } from "./repliesConstants";

export function listenToReplies (replies) {
  return {
    type: FETCH_REPLIES,
  payload: replies,
  }
}

export function createReply(reply) {
  return {
    type: CREATE_REPLY,
  payload: reply,
  }
}

export function deleteReply(replyId) {
  return {
    type: DELETE_REPLY,
  payload: replyId,
  }
}
