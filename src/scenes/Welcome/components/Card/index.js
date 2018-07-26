import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';

import Icon from 'react-icons-kit';
import { Link } from 'react-router-dom';
import { bars } from 'react-icons-kit/fa/bars';
class CardComponent extends Component {
    render() {
        return (
            <Card className="mb25 es-card">
                <CardBody className="d-flex">
                    <div className="d-flex flex-column align-items-center mr25">
                        <div className="es-acronym-box mb10" style={{backgroundColor: this.props.info.bgColor}}>
                            <h4 className="es-text">{this.props.info.acronym}</h4>
                        </div>
                        <div>
                            <Icon icon={bars} />
                        </div>
                    </div>
                    <div className="text-left">
                        <Link to={this.props.info.link}>
                            <h6>{this.props.info.title}</h6>
                        </Link>
                        <p>
                            {this.props.info.description}
                            <Link className="ml5" to={this.props.info.link}>More</Link>
                        </p>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default CardComponent;
