import { Button, Divider, Form, Space } from "antd";
import React, { useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, getBase64 } from "../../utils";
import { useEffect } from "react";
import * as message from "../Message/Message";

import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import OrderAdminDetail from "../OrderAdminDetail/OrderAdminDetail";
import { useNavigate } from "react-router-dom";

const OrderAdmin = ({ orderId, setOrderId }) => {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  useEffect(() => {
    if ((orderId = null)) {
      getAllOrder();
    }
  }, [orderId]);

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  console.log("orders.data", orders.data);

  console.log("orderId", orderId);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleOrderAdminDetail = (id) => {
    setOrderId(id);
  };

  const renderAction = (id) => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          // onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={() => handleOrderAdminDetail(id)}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record) => renderAction(record._id),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  return (
    <>
      {orderId ? (
        <OrderAdminDetail orderId={orderId} />
      ) : (
        <div>
          <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
          <div style={{ height: 200, width: 200 }}>
            <PieChartComponent data={orders?.data} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <TableComponent
              id={orders?.data?._id}
              columns={columns}
              isLoading={isLoadingOrders}
              data={dataTable}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAdmin;
