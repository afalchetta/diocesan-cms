import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useFirestoreCollection  from '../../../hooks/useFirestoreCollection';
import { listenToRepliesFromFirestoreSafe, deleteReplyFromFirestore } from "../../../firestore/firestoreService";
import { listenToReplies } from "./repliesActions";
import {  Comment, Icon } from "semantic-ui-react";
import moment from "moment";

export default function RepliesDashboard({corr, userEmail}) {
  const {id} = corr
  const dispatch = useDispatch();
  const replies = useSelector((state) => state.replies?.replies || []);
  
  useFirestoreCollection({
    query: () => {
      return listenToRepliesFromFirestoreSafe(id); 
    },
    data: (docs) => {
      if (!docs) return;
      dispatch(listenToReplies(docs));
    },
    deps: [id, dispatch],
  });

  return (
    <Comment.Group>
  {[...replies]
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest first
    })
    .map((reply) => (
      <Comment key={reply.id}>
        <Comment.Content>
          <Comment.Author>{reply.createdBy || ""}</Comment.Author>
          <Comment.Text style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {reply.reply || ""}
          </Comment.Text>
          <Comment.Metadata>
            {reply.createdAt
              ? moment(reply.createdAt).format('MMMM Do YYYY, h:mm a')
              : "Unknown time"} | {reply.createdAt ? moment(reply.createdAt).fromNow() : ""}
          </Comment.Metadata>
          {reply.createdByEmail === userEmail && (
            <Comment.Actions>
              <Comment.Action onClick={() => deleteReplyFromFirestore(reply.id)}>
                <Icon name='trash' /> Delete Reply
              </Comment.Action>
            </Comment.Actions>
          )}
        </Comment.Content>
      </Comment>
    ))}
</Comment.Group>

  );
}
