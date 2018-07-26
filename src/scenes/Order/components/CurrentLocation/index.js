import React, { Component } from 'react';

import Icon from 'react-icons-kit';
import { dotCircleO } from 'react-icons-kit/fa/dotCircleO';

class CurrentLocation extends Component {
    render() {
        return (
            <div className="es-marker-wrapper">
                <div className="es-marker">
                    <Icon icon={dotCircleO} />
                </div>
            </div>
        );
    }
}

export default CurrentLocation;
