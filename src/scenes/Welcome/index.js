import React, { Component } from "react";

import "./styles.css";

import CardComponent from "./components/Card";
import SearchBar from "./components/SearchBar";

import { Container, Row, Col } from "reactstrap";

import { CARD_STATIC } from "./strings.js";

import strings from "../../localisation";
class Welcome extends Component {
    render() {
        return (
            <Container style={{paddingTop: "15px"}}>
                <Row>
                    <Col xs="12" lg="6" className="margin-auto">
                        <h3>{strings.welcome}</h3>
                    </Col>
                    <Col xs="12" lg="6">
                        <SearchBar />
                    </Col>
                </Row>
                <hr />
                <div>
                    {CARD_STATIC.map((info, idx) => <CardComponent info={info} key={idx}></CardComponent>)}
                </div>
            </Container>
        );
    }
}

export default Welcome;
