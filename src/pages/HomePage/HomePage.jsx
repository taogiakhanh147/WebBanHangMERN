import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.png";
import slider2 from "../../assets/images/slider2.png";
import slider3 from "../../assets/images/slider3.png";
import slider4 from "../../assets/images/slider4.png";
import slider5 from "../../assets/images/slider5.png";
import slider6 from "../../assets/images/slider6.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [pending, setPending] = useState(false);
  const [limit, setLimit] = useState(6);
  const  [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async() => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === "OK") {
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  const {
    isPending,
    data: products,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: keepPreviousData,
  });

  return (
    <Loading isPending={isPending || pending}>
      <div style={{ width: `1270px`, margin: `0 auto` }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        style={{ width: "100%", height: "16px", backgroundColor: "#efefef" }}
      ></div>

      <div
        className="body"
        style={{ width: `100%`, backgroundColor: `#efefef`, height: '100%', paddingBottom: '20px' }}
      >
        <div
          id="container"
          style={{
            height: "100%",
            width: "1270px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "1270px",
              height: "360px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
            }}
          >
            <SliderComponent
              arrImages={[slider1, slider2, slider3, slider4, slider5, slider6]}
            />
          </div>
          <div
            style={{
              width: "1270px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
            }}
          >
            <WrapperProducts
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "30px",
                flexWrap: "wrap",
                marginTop: "16px",
                padding: "20px",
              }}
            >
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProducts>
          </div>
          <div style={{display:'flex', justifyContent: 'center', marginTop: '20px'}}>
          <WrapperButtonMore
            textButton={isPlaceholderData ? "Load more" : "Xem thêm"}
            type="outline"
            styleButton={{
              border: `${products?.total === products?.data.length ? 'none' : '1px solid rgb(11,116,229)'}`,
              color: `${
                products?.total === products?.data.length
                  ? "#ccc"
                  : "rgb(11,116,229)"
              }`,
              width: `240px`,
              height: `38px`,
              boderRadius: `4px`,
            }}
            disabled={
              products?.total === products?.data.length ||
              products?.totalPage === 1
            }
            styleTextButton={{
              fontWeight: 500,
              color: products?.total === products?.data.length && "#fff",
            }}
            onClick={() => setLimit((prev) => prev + 6)}
          />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
