import React, { Component } from 'react';

import Icon from 'react-icons-kit';
import { search } from 'react-icons-kit/fa/search';
import { InputGroup, InputGroupAddon, Input } from "reactstrap";

class SearchBar extends Component {
    render() {
        return (
            <InputGroup className="mb10">
                <InputGroupAddon addonType="prepend">
                    <div className="input-group-text">
                        <Icon icon={search} />
                    </div>
                </InputGroupAddon>
                <Input placeholder="Find a topic" />
            </InputGroup>
        );
    }
}

export default SearchBar;
