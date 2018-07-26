import React, { Component } from 'react';

import Icon from 'react-icons-kit';
import { mapMarker } from 'react-icons-kit/fa/mapMarker';

class TargetLocation extends Component {
    render() {
        return (
            <div className="es-marker-wrapper">
                <div className="es-marker">
                    <Icon icon={mapMarker} />
                </div>
            </div>
        );
    }
}

export default TargetLocation;
