import React from "react"; 
import { useDispatch, useSelector } from "react-redux";
import useFirestoreDoc from "../../../hooks/useFirestoreDoc";
import { useParams, useNavigate } from "react-router-dom";
import { listenToCorrFromFirestore } from "../../../firestore/firestoreService";
import { listenToCorrs } from "../redux/CorrsAction";
import RepliesDashboard from "../replies/RepliesDashboard";
import AddReplyForm from "../replies/AddReplyForm";
import CorrMainInfo from "./CorrMainInfo";

import {
  Grid,
  Button,
  Container,
  Segment,
  Icon,
  Header,
  Divider
} from "semantic-ui-react";

import "./CorrDetailsPage.css";

export default function CorrDetailsPage() {
  const { id } = useParams();
  const { currentUserProfile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const corr = useSelector((state) =>
    state.corrs.corrs.find((r) => r.id === id)
  );

  useFirestoreDoc({
    query: () => listenToCorrFromFirestore(id),
    data: (corr) => dispatch(listenToCorrs([corr])),
    deps: [id, dispatch],
  });

  if (!corr)
    return <Header as="h4" content="Loading Correspondence..." textAlign="center" />;

  return (
    <Container className="corr-details-page">
      {/* Top Bar */}
      <Segment basic textAlign="left">
        <Button
          icon
          labelPosition="left"
          basic
          onClick={() => navigate("/corrs")}
        >
          <Icon name="arrow left" />
          Back to All Correspondences
        </Button>
      </Segment>

      {/* Main Content */}
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            {/* Corr Info Panel */}
            <CorrMainInfo corr={corr} />

            <Divider />

            {/* Add Reply Form */}
            <AddReplyForm
              corrId={id}
              assigned={corr.assignedEmails}
              userName={currentUserProfile?.displayName}
              userEmail={currentUserProfile?.email}
              agentEmail={corr.agentEmail}
              subject={corr.subject}
            />

            <Divider />

            {/* Replies */}
            <RepliesDashboard corr={corr} userEmail={currentUserProfile?.email} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
