import React from 'react';
import { Toolbar, Actionbar, Button, ButtonGroup } from 'react-photonkit';

let Header = () => {
  return (
    <Toolbar>
      <Actionbar>
        <ButtonGroup>
          <Button glyph="home" />
          <Button glyph="github" />
        </ButtonGroup>
      </Actionbar>
    </Toolbar>
  );
};

export default Header;
