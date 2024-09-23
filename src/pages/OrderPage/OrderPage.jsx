import React, { useEffect, useMemo, useState } from "react";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
  WrapperStyleHeaderDelivery,
} from "./style";
import { Checkbox, Form } from "antd";
import { PlusOutlined, DeleteOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { WrapperInputNumber } from "../../components/ProductDetailComponent/style";
import {
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import Loading from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";

const OrderPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, condition) => {
    if (type === "increase") {
      if(condition) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else if (type === "decrease") {
      if(condition)
      dispatch(decreaseAmount({ idProduct }));
    }
  };

  const handleOnChangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected.reduce((total, cur) => {
      const discount = cur.discount ?? 0;
      return total + (cur.price * cur.amount * discount) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (order?.orderItemsSelected.length === 0 || priceMemo > 500000) {
      return 0;
    } else if (priceMemo < 200000) {
      return 20000;
    } else if (priceMemo > 200000 && priceMemo <= 500000) {
      return 10000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  const handleRemoveAllProduct = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user.address || !user.phone || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const { isPending, data } = mutationUpdate;

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "0 VND",
      description: "Trên 500.000 VND",
    },
  ];

  return (
    <div style={{ background: "#f5f5f5", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent
                items={itemsDelivery}
                current={
                  order?.orderItemsSelected.length === 0
                    ? 3
                    : deliveryPriceMemo === 20000
                    ? 0
                    : deliveryPriceMemo === 10000
                    ? 1
                    : 2
                }
              />
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox
                  onChange={handleOnChangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span>Tất cả ({order.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllProduct}
                ></DeleteOutlined>
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4",
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></Checkbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: "260px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("decrease", order?.product, order?.amount > 1)
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("increase", order?.product, order?.amount < order.countInStock)
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rgb(255,66,78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <span style={{ fontSize: "13px" }}>Địa chỉ: </span>
                <span
                  style={{ fontWeight: "bold", fontSize: "13px" }}
                >{`${user?.address} ${user?.city}`}</span>
                <span
                  onClick={handleChangeAddress}
                  style={{ color: "blue", cursor: "pointer", fontSize: "13px" }}
                >
                  Thay đổi
                </span>
              </WrapperInfo>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceDiscountMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(deliveryPriceMemo)}
                  </span>
                </div>
              </WrapperInfo>

              <WrapperTotal>
                <span style={{ fontSize: "13px" }}>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254,56,52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gòm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              textbutton={"Mua hàng"}
              styletextbutton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        forceRender
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            {/* Name */}
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            {/* City */}
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Please input your city",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.city}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>

            {/* phone */}
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            {/* address */}
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your address",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
