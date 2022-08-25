import { Collapse } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
const { Panel } = Collapse;

const Home = () => {
  return (
    <Collapse>
      <Panel header="Home Page Control" key="1">
        <Link to='/mainSliderControl'>Main slider Control</Link><br />
        <Link to='/mainLists'>Main Lists Control</Link><br />
        <Link to='/mainListsProducts'>Main Lists (products) Control</Link>
      </Panel>
    </Collapse>
  );
};

export default Home