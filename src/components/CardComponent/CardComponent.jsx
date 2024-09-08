import { Card } from "antd";
import React from "react";
import {
  StyleNameProduct,
  WrapperReportText,
  WrapperPriceText,
  WrapperDiscountText,
  WrapperCardStyle,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";

const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, selled, discount} = props
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 180, borderRadius: '0 0 5px 5px'}}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{borderRadius: `5px 5px 0 0`}}
        />
      }
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{marginRight: '4px'}}>
          <span>{rating} </span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{marginRight: '8px'}}>{price}</span>
        <WrapperDiscountText>{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
