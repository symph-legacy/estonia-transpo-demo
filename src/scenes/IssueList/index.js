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

import { toProperCase } from "../../services/helpers";

import { getIssues, removeIssueItem } from "./actions"

import { getAllIssues, deleteIssue } from '../../services/api'


import Icon from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';

import "./styles.css";
import moment from 'moment';

class IssueList extends Component {

    componentDidMount() {
        getAllIssues().then(response => {
            this.props.getIssues(response);
        })
    }

    renderRow = props => (
        <tr>
            <td>{props.issue.id}</td>
            <td>{ moment(props.issue.created).format("lll") }</td>
            <td>{ toProperCase(props.issue.reporter) }</td>
            <td>{props.issue.description}</td>
            <td>{props.issue.address}</td>
            <td><img className='es-img-thumb' alt='attachment' src={props.issue.attachments} /></td>
            <td>{props.issue.status}</td>
            <td>
                <button
                    value
                    className="btn btn-danger"
                    onClick={(e) => {
                        if (window.confirm(`Are you sure you want to delete issue #${props.issue.id}? This can't be undone.`)) {
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
                            <Table className="es-table mt20" responsive bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date Submitted</th>
                                        <th>Reporter</th>
                                        <th>Description</th>
                                        <th>Address</th>
                                        <th>Attachments</th>
                                        <th>Status</th>
                                        <th>Action</th>
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
