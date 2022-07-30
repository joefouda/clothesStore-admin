import { Collapse } from 'antd';
import { Link } from 'react-router-dom'
import React from 'react';
const { Panel } = Collapse;

const OtherControls = () => {

  return (
    <Collapse>
      <Panel header="Home Page" key="1">
        <Link to='/mainSliderControl'>Home Page Main Slider</Link>
      </Panel>
    </Collapse>
  );
};

export default OtherControls;