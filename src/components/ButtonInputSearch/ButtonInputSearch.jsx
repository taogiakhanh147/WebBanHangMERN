import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13,92,182)",
    colorButton = "#fff",
  } = props;
  return (
    <div style={{ display: "flex", background: "#fff" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{
          background: backgroundColorInput,
          border: "none",
          borderRadius: "0",
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        icon={<SearchOutlined color={colorButton} />}
        styleButton={{
          background: backgroundColorButton,
          border: "none",
          borderRadius: "0",
          color: colorButton,
        }}
        textbutton={textbutton}
      />
    </div>
  );
};

export default ButtonInputSearch;
