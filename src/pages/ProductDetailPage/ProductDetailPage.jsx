import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div style={{height: '100vh', width: '100%', background: '#efefef'}}>
      <div style={{ width: "1270px", height: "100%", margin: "0 auto" }}>
        <p style={{ fontSize: "14px", paddingTop: "10px" }}>
          <span
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Trang chủ
          </span>{" "}
          / Chi tiết sản phẩm
        </p>
        <ProductDetailComponent idProduct={id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
