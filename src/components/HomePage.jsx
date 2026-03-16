import React from "react";
import Logo from "../assets/DMT_LOGO_MAIN.png";
import { Container, Image } from "semantic-ui-react";

export default function HomePage() {
  return (
    <>
        <Container  textAlign="center"
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
          <Image src={Logo} width={550} />
        </Container>
    </>
  );
}
