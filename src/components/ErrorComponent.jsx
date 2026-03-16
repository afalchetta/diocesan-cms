import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";

export default function ErrorComponent() {
  // const { error } = useSelector((state) => state.async);
  return (
    <Segment className="masthead" placeholder>
      <Header textAlign="center" content={"There has been an error"} />
      <Button
        as={Link}
        to="/"
        primary
        style={{ marginTop: 20 }}
        content="Return to corrs"
      />
    </Segment>
  );
}

// content={error?.message || "There has been an error"}
