import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input
} from 'reactstrap';
import Icon from 'react-icons-kit';
import { search } from 'react-icons-kit/fa/search';

import strings from "../../../localisation";

export default () => (
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <div className="input-group-text">
        <Icon icon={search} />
      </div>
    </InputGroupAddon>
    <Input placeholder={strings.searchDatabase} />
  </InputGroup>
);