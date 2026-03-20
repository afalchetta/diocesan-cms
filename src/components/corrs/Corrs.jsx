import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Corr from "./Corr";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { listenToCorrsFromFirestore } from "../../firestore/firestoreService";
import { listenToCorrs } from "./redux/CorrsAction";
import {
  Dimmer,
  Loader,
  Header,
  Button,
  ButtonGroup,
  Divider,
} from "semantic-ui-react";

export default function Corrs() {
  const dispatch = useDispatch();
  const { corrs } = useSelector((state) => state.corrs);
  const { loading } = useSelector((state) => state.async);
  const { currentUser } = useSelector((state) => state.auth);

  // 🔹 Load saved sort preference OR default to dueDate
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem("corrSort") || "dueDate";
  });

  // 🔹 Persist sort preference
  useEffect(() => {
    localStorage.setItem("corrSort", sortBy);
  }, [sortBy]);

  // 🔹 Firestore listener
  useFirestoreCollection({
    query: () => listenToCorrsFromFirestore(),
    data: (corrs) => dispatch(listenToCorrs(corrs)),
    deps: [dispatch],
  });

  // 🔹 Permissions
  const userCanSeeCorr = (c) =>
    c.agentEmail === currentUser.email ||
    (c.assignedEmails && c.assignedEmails.includes(currentUser.email)) ||
    c.createdBy === currentUser.email;

  // 🔹 Filter open and closed corrs
  const userOpenCorrs = corrs.filter(
    (c) => c.ticketStatus === "open" && userCanSeeCorr(c)
  );
  const userClosedCorrs = corrs.filter(
    (c) => c.ticketStatus === "closed" && userCanSeeCorr(c)
  );

  // 🔥 Smart sorting for open corrs
  const sortedOpenCorrs = useMemo(() => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    return [...userOpenCorrs].sort((a, b) => {
      const now = new Date();
      const aDue = new Date(a.dueDate);
      const bDue = new Date(b.dueDate);
      const aOverdue = aDue < now;
      const bOverdue = bDue < now;

      // 🔴 Overdue first
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;

      // 📅 Due date mode
      if (sortBy === "dueDate") return aDue - bDue;

      // 🔥 Priority mode
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // fallback to due date
      return aDue - bDue;
    });
  }, [userOpenCorrs, sortBy]);

  return (
    <>
      {loading ? (
        <Dimmer active inverted>
          <Loader inverted>Loading!</Loader>
        </Dimmer>
      ) : (
        <>
          {/* ---------- SORT CONTROLS ---------- */}
          <div style={{ marginBottom: "1.5em", textAlign: "right" }}>
            <ButtonGroup size="small">
              <Button
                active={sortBy === "dueDate"}
                onClick={() => setSortBy("dueDate")}
                color="blue"
              >
                Due Date
              </Button>
              <Button
                active={sortBy === "priority"}
                onClick={() => setSortBy("priority")}
                color="red"
              >
                Priority
              </Button>
            </ButtonGroup>
          </div>

          {/* ---------- OPEN SECTION ---------- */}
          {sortedOpenCorrs.length > 0 ? (
            sortedOpenCorrs.map((corr) => <Corr key={corr.id} corr={corr} />)
          ) : (
            <Header
              as="h3"
              textAlign="center"
              color="teal"
              style={{ marginTop: "2.5em" }}
            >
              You have no open correspondences.
            </Header>
          )}

          {/* ---------- CLOSED SECTION ---------- */}
          {userClosedCorrs.length > 0 && (
            <>
              <Divider style={{ margin: "3em 0 2em" }} />
              <Header as="h3" color="grey">
                Closed Correspondence
              </Header>
              {userClosedCorrs.map((corr) => (
                <Corr key={corr.id} corr={corr} />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}