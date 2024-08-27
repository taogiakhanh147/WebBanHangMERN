import React from "react";
import { Button } from "antd";

const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, ...rest }) => {
  return (
    <Button size={size} {...rest} style={styleButton}>
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
