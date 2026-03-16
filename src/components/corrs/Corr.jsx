import React, { useMemo, useState } from "react"; 
import moment from "moment";
import { NavLink } from "react-router-dom";
import { Button, Header, Segment, Popup, Label, Icon } from "semantic-ui-react";
import { toggleTicketStatus } from "../../firestore/firestoreService";


export default function Corr({ corr }) {
    const [loading, setLoading] = useState(false);
  const priority = corr?.priority || "Low";

  const priorityMeta = useMemo(() => {
  switch (priority) {
    case "High":
      return { color: "red", icon: "warning circle" };
    case "Medium":
      return { color: "yellow", icon: "exclamation circle" };
    default:
      return { color: "teal", icon: "info circle" };
  }
}, [priority]);


  const formattedDate = corr?.dueDate
    ? moment(corr.dueDate).format("MMMM Do, YYYY")
    : "No due date";

  const subject =
    corr?.subject?.length > 40
      ? corr.subject.slice(0, 40) + "…"
      : corr?.subject || "No subject";

  // Now handle empty state AFTER hooks
  if (!corr) {
    return (
      <Header style={{ marginTop: 140 }} as="h3" textAlign="center" color="grey">
        You currently have no correspondences to attend to.
      </Header>
    );
  }
   // 🔹 Handle status toggle
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

  return (
    <Segment
      as={NavLink}
      to={`/corr/${corr.id}`}
      padded
      raised
      color={priorityMeta.color}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      className="corr-card"
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>
        <Header as="h3" style={{ marginBottom: "0.4rem" }}>
          {subject}
        </Header>

        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          <div><strong>Addressed To:</strong> {corr.addressedTo || "—"}</div>
          <div><strong>Due Date:</strong> {formattedDate}</div>
        </div>
      </div>

      {/* PRIORITY BADGE */}
     <Label color={priorityMeta.color} size="large">
  <Icon name={priorityMeta.icon} />
  {priority}
</Label>

      {/* ACTION */}
      <Button.Group>
        <Popup
          content={`Mark as ${corr.ticketStatus === "open" ? "closed" : "open"}`}
          trigger={
            <Button
              size="mini"
              basic
              color={corr.ticketStatus === "open" ? "green" : "grey"}
              content={corr.ticketStatus === "open" ? "open" : "closed"}
              onClick={handleToggleStatus}
              loading={loading}
            />
          }
        />
      </Button.Group>
    </Segment>
  );
}
