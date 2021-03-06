import { useSelector, useDispatch } from "react-redux";
import useOrder from "../orderHooks/useOrder";
import {
  selectCarts,
  selectError,
  selectLoading,
  deleteCartItemsBySeller,
  deleteCartItem,
  selectIsSelect,
  selectIsPaying,
  selectFilter,
  selectPrice,
  selectPayWay,
  selectComplete,
  selectOrderNumber,
  selectQuantity,
  selectAdd,
  selectUpdate,
  selectChecked,
  setPrice,
  setChecked,
  setErrorMessage,
  setIsSelect,
  addQuantity,
  minusQuantity,
  setIsPaying,
  setFilter,
  setUpdate,
  setPayWay,
  setComplete,
  createOrder,
  getCartItem,
  setQuantity,
  setHasAdd,
  addCartItem,
} from "../../redux/slices/cartSlice/cartSlice";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../redux/slices/orderSlice/orderSlice";
import { getProduct } from "../../redux/slices/productSlice/productSlice";
import { AppDispatch } from '../../state';
import { useTranslation } from 'react-i18next'

export default function useCart() {
  const { user } = useOrder();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat();
  const carts = useSelector(selectCarts);
  const errorMessage = useSelector(selectError);
  const isLoading = useSelector(selectLoading);
  const isSelect = useSelector(selectIsSelect);
  const isPaying = useSelector(selectIsPaying);
  const filter = useSelector(selectFilter);
  const price = useSelector(selectPrice);
  const payWay = useSelector(selectPayWay);
  const completeOrder = useSelector(selectComplete);
  const orderNumber = useSelector(selectOrderNumber);
  const isSelectQuantity = useSelector(selectQuantity);
  const hasAdd = useSelector(selectAdd);
  const update = useSelector(selectUpdate);
  const checked = useSelector(selectChecked);

  const handleDeleteProductInCart = (id) => {
    // todo for simon
    deleteCartItem(id)(dispatch);
  };
  const handleDeleteCart = (id) => {
    deleteCartItemsBySeller(id)(dispatch);
  };
  const handleClose = () => {
    dispatch(setErrorMessage(false));
  };
  const handleSelect = (id, totalAmount) => {
    dispatch(setIsSelect(id));
    dispatch(setChecked(!checked));
    dispatch(setPrice(totalAmount));
    if (checked === true) {
      dispatch(setPrice(0));
    }
  };
  const handleError = () => {
    dispatch(
      setErrorMessage(
        "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
      )
    );
  };
  const handlePlus = (cartQuantity, cartItemId, productQuantity) => {
    if (cartQuantity >= productQuantity) {
      dispatch(
        setErrorMessage("?????????????????????????????????" + productQuantity + "???")
      );
      return;
    }
    addQuantity(cartQuantity, cartItemId)(dispatch);
  };
  const handleMinus = (cartQuantity, cartItemId) => {
    if (cartQuantity <= 1) {
      dispatch(setErrorMessage("???????????????????????????1???"));
      return;
    }
    minusQuantity(cartQuantity, cartItemId)(dispatch);
  };
  const handleCloseError = () => {
    dispatch(setErrorMessage(false));
  };

  const handlePay = (productId) => {
    if (checked === true) {
      dispatch(setIsPaying(true));
      dispatch(setFilter("select"));
      getUser()(dispatch);
      getProduct(productId)(dispatch);
    } else {
      dispatch(setErrorMessage("??????????????????????????????????????????"));
    }
  };
  const handleUpdateInfo = () => {
    dispatch(setUpdate(false));
  };
  const handleUpdateBuyer = (e, setBuyer) => {
    setBuyer(e.target.value);
  };
  const handleUpdateAddress = (e, setReceiveAddress) => {
    setReceiveAddress(e.target.value);
  };
  const handleUpdateReceiver = (e, setReceiver) => {
    setReceiver(e.target.value);
  };
  const handleCloseUpdate = () => {
    dispatch(setUpdate(false));
  };
  const handleUpdateReceiveInfo = () => {
    dispatch(setUpdate(true));
  };
  const handlePayWay = () => {
    dispatch(setPayWay(true));
  };
  const handleToCheckOutCartPage = (readyToOrderItems) => {
    if (payWay === true) {
      navigate("/cart/checkout");
      dispatch(setComplete(true));
      createOrder(readyToOrderItems)(dispatch);
    } else {
      dispatch(setErrorMessage("????????????????????????????????????????????????"));
    }
  };
  const reset = () => {
    dispatch(setIsPaying(false));
    dispatch(setIsSelect(false));
    dispatch(setFilter("all"));
    dispatch(setChecked(false));
  };
  const handleGetCart = () => {
    reset();
    getCartItem()(dispatch);
    dispatch(setPayWay(false));
    dispatch(setComplete(false));
  };
  const handleToCart = () => {
    reset();
    dispatch(setPrice(0));
  };

  const handleToHomePage = () => {
    navigate("/nft");
    getCartItem()(dispatch);
    reset();
  };
  const handleSelectQuantity = (e) => {
    dispatch(setQuantity(e.target.value));
  };
  const handleAddProduct = (productId, quantity, userId, price,orderid) => {
    (addCartItem(productId, quantity, userId, price,orderid)(dispatch)).then((res) => {
      if (res.ok === 1 || quantity === 1) {
        dispatch(setHasAdd(true));
      }
    });
  };
  const handleCloseAddProduct = () => {
    dispatch(setHasAdd(false));
    dispatch(setErrorMessage(false));
  };
  const {t} = useTranslation();
  const handleAlert = () => {
    if (!user) {
      dispatch(setErrorMessage(t('Please Login Wallet')));
    }
  };
  return {
    update,
    isSelect,
    completeOrder,
    price,
    isPaying,
    checked,
    payWay,
    filter,
    carts,
    formatter,
    errorMessage,
    isLoading,
    orderNumber,
    isSelectQuantity,
    hasAdd,

    handleDeleteProductInCart,
    handleDeleteCart,
    handleClose,
    handleSelect,
    handleError,
    handlePlus,
    handleMinus,
    handleCloseError,
    handlePay,
    handleUpdateInfo,
    handleUpdateBuyer,
    handleUpdateAddress,
    handleUpdateReceiver,
    handleCloseUpdate,
    handleUpdateReceiveInfo,
    handlePayWay,
    handleToCheckOutCartPage,
    handleGetCart,
    handleToCart,
    handleToHomePage,
    handleSelectQuantity,
    handleAddProduct,
    handleCloseAddProduct,
    handleAlert,
  };
}
