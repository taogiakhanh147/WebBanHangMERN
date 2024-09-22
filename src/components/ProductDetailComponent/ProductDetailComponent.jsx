import { Col, Image, Rate, Row } from "antd";
import React, { useEffect, useState } from "react";
import imageProductSmall from "../../assets/images/small1.webp";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import * as message from "../Message/Message"

const ProductDetailComponent = ({ idProduct }) => {
  const order = useSelector((state) => state.order)
  const [numProduct, setNumProduct] = useState(1);
  const [isErrorOder, setIsErrorOrder] = useState(false)
  const [errorLimitOrder, setErrorLimitOrder] = useState(false)
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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

  useEffect(() => {
    console.log("productDetails?.countInStock", productDetails?.countInStock)
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
    if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && !productDetails?.countInStock)) {
        setErrorLimitOrder(false)
    } else {
        setErrorLimitOrder(true)
    }
},[numProduct])
  
  useEffect(() => {
    if(order.isSuccessOrder) {
      message.success('Thêm vào giỏ hàng thành công')
    }
    return () => {
      dispatch(resetOrder())
    }
  },[order.isSuccessOrder])


  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
      if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock
            },
          })
        );
      } else {
        setErrorLimitOrder(true)
      }
    }
  };

  const handleChangeCount = (type, condition) => {
    if (type === "increase") {
      if(condition) {
        setNumProduct(numProduct + 1);
      } else {
        setIsErrorOrder(true)
      }
    } else if (type === "decrease") {
      if(condition) {
        setIsErrorOrder(false)
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
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleTextSell> | Đã bán 34</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
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
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("decrease", numProduct > 1)}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                size="small"
                value={numProduct}
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("increase", numProduct < productDetails?.countInStock)}
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
            <div style={{marginTop: '10px'}}>
              {(errorLimitOrder) && <span style={{color: 'red'}}>Số lượng hàng tồn kho không đủ</span>}
              {/* {errorLimitOrder && <span style={{color: 'red'}}>Số lượng hàng tồn kho không đủ</span>} */}
            </div>
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
              onClick={handleAddOrderProduct}
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
