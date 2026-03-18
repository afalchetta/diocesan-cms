import React, { useState } from "react"; 
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CorrFilesDashboard from "../CorrFiles/CorrFilesDashboard";
import { Header, Button, Grid, Icon, Segment, Divider, Card, Popup, Label } from "semantic-ui-react";
import { openModal } from "../../modals/modalReducer";
import { useDispatch } from "react-redux";
import { toggleTicketStatus, deleteCorrFromFirestore } from "../../../firestore/firestoreService";
import { toast } from "react-toastify";
import './CorrDetailsPage.css';

export default function CorrMainInfo({ corr }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const corrColor = () => {
    if (corr.priority === "High") return "red";
    if (corr.priority === "Medium") return "yellow";
    return "teal";
  };

  const assignedEmailsArray = Array.isArray(corr.assignedEmails)
    ? corr.assignedEmails
    : typeof corr.assignedEmails === "string"
    ? corr.assignedEmails.split(",").map((e) => e.trim())
    : [];

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await toggleTicketStatus(corr);
    } catch (error) {
      console.error("Error toggling ticket status:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDetails = () => {
    if (!corr.details) return "No details provided.";
    if (showFullDetails || corr.details.length <= 500) return corr.details;
    return corr.details.slice(0, 500) + "...";
  };

  return (
    <>
      <Segment padded="very" raised className="corr-main-info">
        {/* Header Section */}
        <Header as="h2" className="corr-subject">
          {corr.subject || "No Subject"}
          <Header.Subheader>Subject</Header.Subheader>
        </Header>

        <Header as="h4">Type of Correspondence: {corr.type}</Header>
        <Header as="h5" color={corrColor()}>
          Priority: {corr.priority}
        </Header>

        <Divider />

        {/* Main Info Grid */}
        <Grid stackable columns={3} className="corr-info-grid">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3">
                {moment(corr.dateReceived).format("MMMM Do, YYYY")}
                <Header.Subheader>Date Received</Header.Subheader>
              </Header>

              <Header as="h3" className="overflow-wrap">
                {corr.addressedTo || "No Address"}
                <Header.Subheader>Addressed To</Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3" className="overflow-wrap">
                {corr.senderContact || "N/A"}
                <Header.Subheader>Sender's Contact Info</Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">
                {corr.dueDate ? moment(corr.dueDate).format("MMMM Do, YYYY") : "N/A"}
                <Header.Subheader>Due By</Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Details Section */}
        {/* Details Section */}
<Segment className="details-segment">
  <Header as="h3">
    <Header.Subheader>Details</Header.Subheader>
    <p
      className={`corr-details ${showFullDetails ? "expanded" : ""}`}
    >
      {renderDetails()}
    </p>
  </Header>
  {corr.details && corr.details.length > 500 && (
    <Button
      basic
      icon
      labelPosition="right"
      size="small"
      onClick={() => setShowFullDetails(!showFullDetails)}
      className="toggle-details-button"
    >
      {showFullDetails ? "Show Less" : "Show More"}
      <Icon name={showFullDetails ? "arrow up" : "arrow down"} />
    </Button>
  )}
</Segment>
{/* Edit & File Buttons */}
        <Button
          icon
          labelPosition="left"
          color="teal"
          onClick={() =>
            dispatch(openModal({ modalType: "EditCorr", modalProps: corr }))
          }
        >
          <Icon name="edit" />
          Edit
        </Button>

        <CorrFilesDashboard corr={corr} />
        <Button
          icon
          labelPosition="left"
          color="orange"
          to='#replies'
        >
          <Icon name="angle down" />
          Replies
        </Button>
      </Segment>
      {/* ---------- Assigned Emails ---------- */}
{assignedEmailsArray.length > 0 && (
  <Segment className="assigned-emails-segment">
    <Header as="h4">Correspondence Assigned To:</Header>
    <div className="assigned-emails-list">
      {assignedEmailsArray.map((email, idx) => (
        <Label key={idx} color="teal" style={{ marginBottom: "0.3em", marginRight: "0.3em" }}>
          <Icon name="mail" />
          {email}
        </Label>
      ))}
    </div>
  </Segment>
)}

      <div className="corr-columns">
  {/* Agent Info Card */}
  <Card className="agent-card">
    <Card.Content>
      <Card.Meta>Correspondence created by:</Card.Meta>
      <Card.Header className="overflow-wrap">{corr.agentEmail}</Card.Header>
      <Header color="grey" as="h5" className="created-at">
        Created at: {moment(corr.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
      </Header>
    </Card.Content>
  </Card>

  {/* Status & Delete Buttons */}
  <Segment className="status-delete-segment">
    <Popup
      content={`Mark as ${corr.ticketStatus === "open" ? "closed" : "open"}`}
      trigger={
        <Button
          color={corr.ticketStatus === "open" ? "red" : "green"}
          content={
            corr.ticketStatus === "open"
              ? "Click to close correspondence"
              : "Click to open correspondence"
          }
          onClick={handleToggleStatus}
          loading={loading}
        />
      }
    />

    <Button
      floated="right"
      icon
      labelPosition="left"
      color="red"
      onClick={() => {
        if (
          window.confirm(
            "Are you sure you want to permanently delete this correspondence?"
          )
        ) {
          deleteCorrFromFirestore(corr.id);
          toast.success(
            "Your correspondence and its files have been deleted permanently."
          );
          navigate("/corrs");
        }
      }}
    >
      <Icon name="trash" />
      Delete Correspondence
    </Button>
  </Segment>
</div>

<div id="replies"></div>
    </>
  );
}
