import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div
      style={{ padding: `0 120px`, background: "#efefef", height: "1000px" }}
    >
      <p style={{fontSize: '14px', paddingTop: '10px'}}>
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
  );
};

export default ProductDetailPage;
