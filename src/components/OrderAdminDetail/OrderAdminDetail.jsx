import React from "react";
import { convertPrice, getBase64 } from "../../utils";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import { WrapperHeader } from "./style";
import TableDetailComponent from "../TableDetailComponent/TableDetailComponent";
import { useQuery } from "@tanstack/react-query";

const OrderAdminDetail = ({ orderId }) => {
  const user = useSelector((state) => state?.user);

  const getDetailsOrderAdmin = async () => {
    const res = await OrderService.getDetailsOrderAdmin(orderId);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orderDetail"],
    queryFn: getDetailsOrderAdmin,
  });
  const { isLoading: isLoadingOrders, data: orderDetails } = queryOrder;

  const infoCustomerColumns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
    },
  ];

  const infoProductColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (image) => <img src={image} alt="Product" style={{ width: "70px", height: "70px" }} />,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
    },
    {
      title: "Giá",
      dataIndex: "price",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
    },
  ];

  const dataInfoCustomerTable = orderDetails?.data
    ? [
        {
          key: orderDetails.data._id,
          fullName: orderDetails.data.shippingAddress?.fullName,
          address: orderDetails.data.shippingAddress?.address,
          city: orderDetails.data.shippingAddress?.city,
          phone: orderDetails.data.shippingAddress?.phone,
        },
      ]
    : [];

  const dataProductTable = Array.isArray(orderDetails?.data?.orderItems)
    ? orderDetails.data.orderItems.map((orderItem) => ({
        key: orderItem._id,
        name: orderItem.name,
        image: orderItem.image,
        amount: orderItem.amount,
        price: convertPrice(orderItem.price),
        discount: orderItem.discount,
      }))
    : orderDetails?.data?.orderItems
    ? [
        {
          key: orderDetails.data.orderItems._id,
          name: orderDetails.data.orderItems.name,
          image: orderDetails.data.orderItems.image,
          amount: orderDetails.data.orderItems.amount,
          price: convertPrice(orderDetails.data.orderItems.price),
          discount: orderDetails.data.orderItems.discount,
        },
      ]
    : [];

  return (
    <div>
      <WrapperHeader>Chi tiết đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <WrapperHeader>Thông tin người mua</WrapperHeader>
        <TableDetailComponent
          columns={infoCustomerColumns}
          isLoading={isLoadingOrders}
          data={dataInfoCustomerTable}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <WrapperHeader>Thông tin sản phẩm</WrapperHeader>
        <TableDetailComponent
          columns={infoProductColumns}
          isLoading={isLoadingOrders}
          data={dataProductTable}
        />
      </div>
    </div>
  );
};

export default OrderAdminDetail;
