import { Col, Image, InputNumber, Rate, Row } from "antd";
import React, { useState } from "react";
import imageProduct from "../../assets/images/large1.webp";
import imageProductSmall from "../../assets/images/small1.webp";
import {
  WrapperAddressProduct,
  WrapperBtnQualityProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useSelector } from "react-redux";

const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(0);
  const user = useSelector((state) => state.user)

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else if (type === "decrease") {
      if(numProduct > 0) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  return (
    <Loading isPending={isPending}>
      <Row style={{ padding: "16px", background: "#fff", borderRadius: `4px` }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: `8px` }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={false}
          />
          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image product small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: `10px` }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
            <WrapperStyleTextSell> | Đã bán 34</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {productDetails?.price.toLocaleString()}đ
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến</span>
            <span className="address"> {user?.address}</span>
            <span className="change-address"> Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div
            style={{
              margin: `10px 0 20px`,
              padding: `10px 0`,
              borderTop: `1px solid #e5e5e5`,
              borderBottom: `1px solid #e5e5e5`,
            }}
          >
            <div style={{ marginBottom: `10px` }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => handleChangeCount("decrease")}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                size="small"
                value={numProduct}
              />
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => handleChangeCount("increase")}
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ButtonComponent
              size={40}
              styleButton={{
                background: `rgb(255,57,69)`,
                height: `48px`,
                width: `220px`,
                border: `none`,
                borderRadius: `4px`,
              }}
              textButton={"Chọn mua"}
              styleTextButton={{
                color: "#fff",
                fontSize: `15px`,
                fontWeight: `700`,
              }}
            />
            <ButtonComponent
              size={40}
              styleButton={{
                background: `#fff`,
                height: `48px`,
                width: `220px`,
                border: `1px solid rgb(13,92,182)`,
                borderRadius: `4px`,
              }}
              textButton={"Mua trả sau"}
              styleTextButton={{ color: "rgb(13,92,182)", fontSize: `15px` }}
            />
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailComponent;
