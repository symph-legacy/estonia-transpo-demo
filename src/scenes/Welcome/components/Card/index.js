import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';

import Icon from 'react-icons-kit';
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
                        <a href={this.props.info.link}>
                            <h6>{this.props.info.title}</h6>
                        </a>
                        <p>
                            {this.props.info.description}
                            <a className="ml5" href={this.props.info.link}>More</a>
                        </p>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default CardComponent;
