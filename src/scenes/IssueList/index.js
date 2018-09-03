import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";


import { NAV_BRAND } from "./strings";
import Navigation from "../../components/Navigation";
import Tab from "../../components/Tab";
import {
    Container,
    Row,
    Col,
    Table
} from "reactstrap";

import { toProperCase, translateData } from "../../services/helpers";

import { getIssues, removeIssueItem } from "./actions"

import { getAllIssues, deleteIssue } from '../../services/api'


import Icon from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';

import "./styles.css";
import moment from 'moment';
import 'moment/locale/et';

import strings from "../../localisation";

class IssueList extends Component {

    componentDidMount() {
        getAllIssues().then(response => {
            this.props.getIssues(response);
        })
    }

    renderRow = props => (
        <tr>
            <td data-xs-label="ID #">{props.issue.id}</td>
            <td data-xs-label={strings.dateSubmitted}>{ moment(props.issue.created).format("lll") }</td>
            <td data-xs-label={strings.reporter}>{ toProperCase(props.issue.reporter) }</td>
            <td data-xs-label={strings.description}>{props.issue.description}</td>
            <td data-xs-label={strings.address}>{props.issue.address}</td>
            <td data-xs-label={strings.attachments}><img className='es-img-thumb' alt='attachment' src={props.issue.attachments} /></td>
            <td data-xs-label={strings.status}>{translateData(props.issue.status)}</td>
            <td>
                <button
                    value
                    className="btn btn-danger"
                    onClick={(e) => {
                        if (window.confirm(strings.deleteOrder)) {
                            deleteIssue(props.issue.id).then(() => {
                                this.props.removeIssueItem(props.issue.id);
                            });
                        } else {
                            return false;
                        }
                    }}
                ><Icon icon={trash} /></button>
            </td>
        </tr>
    )

    render() {
        const IssueRow = this.renderRow;

        return (
            <React.Fragment>
                <Navigation brand={NAV_BRAND} />
                <Container fluid>
                    <Row>
                        <Col>
                            <Tab active="issues" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table className="es-table mt20 es-table-responsive" responsive bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{strings.dateSubmitted}</th>
                                        <th>{strings.reporter}</th>
                                        <th>{strings.description}</th>
                                        <th>{strings.address}</th>
                                        <th>{strings.attachments}</th>
                                        <th>{strings.status}</th>
                                        <th>{strings.action}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.issueList.map(issue => <IssueRow issue={issue} key={issue.id} />)}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}


IssueList.propTypes = {
    issueList: PropTypes.array.isRequired,
    getIssues: PropTypes.func.isRequired,
    removeIssueItem: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    issueList: state.issueList.issues
});

export default connect(mapStateToProps, {
    getIssues,
    removeIssueItem
})(IssueList);
