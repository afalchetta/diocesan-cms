import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Input,
  Segment,
  Header,
  Dropdown,
  Grid,
  Button,
  Icon,
  Transition,
} from "semantic-ui-react";
import Corr from "./Corr";

export default function CorrSearch() {
  const { currentUser } = useSelector((state) => state.auth);
  const { corrs } = useSelector((state) => state.corrs);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const statusOptions = [
    { key: "all", text: "All", value: "all" },
    { key: "open", text: "Open", value: "open" },
    { key: "closed", text: "Closed", value: "closed" },
  ];
const filteredCorrs = useMemo(() => {
  if (!currentUser) return [];

  const userEmail = currentUser.email.toLowerCase();

  // 🔐 Step 1: ONLY corrs where user is involved
  let results = corrs.filter((corr) => {
    const agentMatch =
      corr.agentEmail &&
      corr.agentEmail.toLowerCase() === userEmail;

    const assignedMatch =
      corr.assignedEmails &&
      corr.assignedEmails.some(
        (email) => email.toLowerCase() === userEmail
      );

    return agentMatch || assignedMatch;
  });

  // 🟡 Step 2: Status Filter (if used)
  if (statusFilter !== "all") {
    results = results.filter(
      (corr) => corr.ticketStatus === statusFilter
    );
  }

  // 🔎 Step 3: Search Filter (if used)
  if (searchTerm.trim()) {
    const lowerSearch = searchTerm.toLowerCase();

    results = results.filter((corr) => {
      const agentMatch =
        corr.agentEmail &&
        corr.agentEmail.toLowerCase().includes(lowerSearch);

      const assignedMatch =
        corr.assignedEmails &&
        corr.assignedEmails.some((email) =>
          email.toLowerCase().includes(lowerSearch)
        );

      const subjectMatch =
        corr.subject &&
        corr.subject.toLowerCase().includes(lowerSearch);

      const addressedToMatch =
        corr.addressedTo &&
        corr.addressedTo.toLowerCase().includes(lowerSearch);

      return (
        agentMatch ||
        assignedMatch ||
        subjectMatch ||
        addressedToMatch
      );
    });
  }

  return results;
}, [corrs, searchTerm, statusFilter, currentUser]);



  return (
    <>
      {/* 🔎 Toggle Button */}
      <Button
        icon
        basic
        labelPosition="left"
        color="blue"
        onClick={() => setOpen(!open)}
        style={{ marginBottom: "1em" }}
      >
        <Icon name="search" />
        {open ? "Hide Search" : "Search"}
      </Button>

      {/* 🎬 Animated Panel */}
      <Transition visible={open} animation="slide down" duration={300}>
        <Segment>
          <Header as="h3">Search Correspondence</Header>

          <Grid stackable>
            <Grid.Row columns={2}>
              <Grid.Column width={10}>
                <Input
                  fluid
                  icon="search"
                  placeholder="Search by email, subject, or addressed to..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid.Column>

              <Grid.Column width={6}>
                <Dropdown
                  fluid
                  selection
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e, data) =>
                    setStatusFilter(data.value)
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <div style={{ marginTop: "2em" }}>
            {!searchTerm && statusFilter === "all" ? (
              <Header as="h4" color="grey">
                Start typing or select a status to search.
              </Header>
            ) : filteredCorrs.length > 0 ? (
              filteredCorrs.map((corr) => (
                <Corr key={corr.id} corr={corr} />
              ))
            ) : (
              <Header as="h4" color="grey">
                No matching correspondence found.
              </Header>
            )}
          </div>
        </Segment>
      </Transition>
    </>
  );
}
