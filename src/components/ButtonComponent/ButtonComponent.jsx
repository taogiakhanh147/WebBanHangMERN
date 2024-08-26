import React from "react";
import { Button } from "antd";

const ButtonComponent = ({ size, styleButton, textButton, ...rest }) => {
  return (
    <Button size={size} {...rest} style={styleButton}>
      <span>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
