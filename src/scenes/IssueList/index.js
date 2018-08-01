import React, { Component, Fragment } from "react";

import "./styles.css";

import { NAV_BRAND } from "./strings";
import Navigation from "../../components/Navigation";
import Tab from "../../components/Tab";
import {
    Container,
    Row,
    Col
} from "reactstrap";


class IssueList extends Component {
    render() {
        return (
            <Fragment>
                <Navigation brand={NAV_BRAND} />
                <Container>
                    <Row>
                        <Col>
                            <Tab active="issues" />
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default IssueList;
