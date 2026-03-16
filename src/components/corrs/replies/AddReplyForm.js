import React, { useState } from "react";
import { addReplyToFirestore } from "../../../firestore/firestoreService";
import { Button, Form, TextArea } from "semantic-ui-react";

// Child
export default function AddReplyForm({ corrId, userName, userEmail, assigned, agentEmail, subject }) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    if (!replyText.trim() || !corrId) return;
    try {
      await addReplyToFirestore({
        reply: replyText,
        corrId,
        assigedEmails: assigned, // pass to Firestore
        createdBy: userName,
        createdByEmail: userEmail,
        agentEmail,
        subject
      });
      setReplyText("");
    } catch (error) {
      console.error("Add reply failed:", error);
    }
  };

  return (
    <Form reply onSubmit={handleSubmit}>
      <Form.Field
        control={TextArea}
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
      />
      <Button content="Add Reply" labelPosition="left" icon="edit" primary />
    </Form>
  );
}

