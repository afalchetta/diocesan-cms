import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Icon,  } from "semantic-ui-react";
import useFirestoreDoc from "../../hooks/useFirestoreDoc";
import { getUserProfile } from "../../firestore/firestoreService";
import { listenToSelectedUserProfile } from "./profileActions";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUserProfile } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.async);

  useFirestoreDoc({
    query: () => getUserProfile(id),
    data: (profile) => dispatch(listenToSelectedUserProfile(profile)),
    deps: [dispatch, id],
  });

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
    return <LoadingComponent content="Loading profile..." />;

  return (
  <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

    
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* BACK BUTTON */}
      <Button
        basic
        icon
        labelPosition="left"
        as={NavLink}
        to="/corrs"
      >
        <Icon name="arrow left" />
        Back to Dashboard
      </Button>

      {/* PAGE TITLE */}
      <h2 style={{ margin: 0, fontWeight: 500 }}>
        Profile
      </h2>
    </div>

    {/* PROFILE CONTENT */}
    <ProfileContent
      profile={selectedUserProfile}
      isCurrentUser={currentUser.uid === selectedUserProfile.id}
    />

  </div>
);

}
