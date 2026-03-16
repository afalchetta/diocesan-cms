import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Corr from "./Corr";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { listenToCorrsFromFirestore } from "../../firestore/firestoreService";
import { listenToCorrs } from "./redux/CorrsAction";
import { Dimmer, Loader, Header, Divider } from "semantic-ui-react";

export default function Corrs() {
  const dispatch = useDispatch();
  const { corrs } = useSelector((state) => state.corrs);
  const { loading } = useSelector((state) => state.async);
  const { currentUser } = useSelector((state) => state.auth);


  // 🔹 Firestore listener (all corrs)
  useFirestoreCollection({
    query: () => listenToCorrsFromFirestore(), // keep your current listener
    data: (corrs) => dispatch(listenToCorrs(corrs)),
    deps: [dispatch],
  });

const userCanSeeCorr = (c) =>
  c.agentEmail === currentUser.email ||
  (c.assignedEmails && c.assignedEmails.includes(currentUser.email)) ||
  c.createdBy === currentUser.email;

const userOpenCorrs = corrs.filter(
  (c) => c.ticketStatus === "open" && userCanSeeCorr(c)
);

const userClosedCorrs = corrs.filter(
  (c) => c.ticketStatus === "closed" && userCanSeeCorr(c)
);

  return (
    <>
      {loading ? (
        <Dimmer active inverted>
          <Loader inverted>Loading!</Loader>
        </Dimmer>
      ) : (
        <>
          {/* ---------- OPEN SECTION ---------- */}
          {userOpenCorrs.length > 0 ? (
            userOpenCorrs.map((corr) => <Corr key={corr.id} corr={corr} />)
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
