import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";

export default function Page404() {
  return (
    <Segment inverted vertical textAlign="center" className="masthead">
      <Container>
        <Header color="blue" as="h2">
          404 Error: this page does not exist, please return home.
        </Header>
        <Link style={{ color: "#fff" }} to="/">
          Home
        </Link>
      </Container>
    </Segment>
  );
}
