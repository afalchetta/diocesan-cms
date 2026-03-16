import React from "react";
import Corrs from "./Corrs";
import { Container } from "semantic-ui-react";
import CorrSearch from "./CorrSearch";

export default function RemindersDashboard() {
  return (
    <Container>
    <CorrSearch />
        <Corrs />
    </Container>
  );
}
