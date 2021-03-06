import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUser,
} from "../../../redux/slices/orderSlice/orderSlice";
import { ThickNavPage } from "../../../components/Page";
import { getAuthToken } from "../../../NFTutils";
import useOrder from "../../../hooks/orderHooks/useOrder";
import { LoopCircleLoading } from "react-loadingg";
import {
  COLOR,
  FONT,
  MEDIA_QUERY_MD,
  DISTANCE,
} from "../../../constants/style";
import Tabs from '../../../components/Tabs/Index'
import useCart from "../../../hooks/cartHooks/useCart";
import CartItem from "../../../components/cartSystem/CartItem";
import useProduct from "../../../hooks/productHooks/useProduct";
import { truncStr } from '../../../utils/strUtil'
import { useTranslation } from "react-i18next";

const Title = styled.p`
  color: ${COLOR.black};
  font-size: ${FONT.lg};
`;
const Message = styled.p`
  color: ${COLOR.text_2};
  font-size: ${FONT.lg};
  margin: 70px auto;
  text-align: center;
`;
const Container = styled.p`
  margin: 50px auto;
  width: 80%;
  padding: ${DISTANCE.xs};
  min-width: ${MEDIA_QUERY_MD.md};
`;
const Table = styled.table`
  width: 100%;
  min-width: 500px;
  text-align: center;
  table-layout: fixed;
  border-collapse: collapse;
`;
const NameContainer = styled.tr``;
const Name = styled.th`
  font-size: ${FONT.md};
  color: ${COLOR.black};
  border-bottom: solid 1px ${COLOR.cccccc};
  padding: ${DISTANCE.sm};
`;
const ContentContainer = styled.tr``;
const Content = styled.td`
  font-size: ${FONT.md};
  color: ${COLOR.text_2};
  border-bottom: solid 1px ${COLOR.cccccc};
  padding: ${DISTANCE.sm};
  cursor: pointer;
  &:hover:nth-child(1) {
    color: ${COLOR.hover};
  }
`;
const OrderContent = styled(Link)`
  font-size: ${FONT.md};
  color: ${COLOR.text_2};
  border-bottom: solid 1px ${COLOR.cccccc};
  padding: ${DISTANCE.sm};
  cursor: pointer;
  &:hover:nth-child(1) {
    color: ${COLOR.hover};
  }
`;
const LoadingMessage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${COLOR.bg_mask};
  z-index: 2;
`;

const ClientOrdersPage = () => {
  const dispatch = useDispatch();
  const {
    carts,
    handleGetCart,
  } = useCart();

  const { 
    orders, 
    handleGetClientOrder,
    handleGetSellerOrder
  } = useOrder();

  const { handleTokenSwitch } = useProduct()

  useEffect(() => {
    if (getAuthToken()) {
      getUser()(dispatch);
    }
  }, [dispatch]);
  useEffect(() => {
    handleGetCart();
  }, [dispatch]);

  const BID_TAB = 'Bidding Orders'
  const SALE_TAB = 'Sales History'
  const BUY_TAB = 'Purchase History'

  const tabs = [BID_TAB, SALE_TAB, BUY_TAB]
  const [tab, setTab] = useState(BID_TAB)
  const { t } = useTranslation();

  return (
    <>
      <ThickNavPage style={{
        width: '1400px',
        overflow: 'scroll'
      }}>
        <Container>
          <Tabs tabs={tabs} value={tab} handleChange={(v) => {
            switch(v){
              case BID_TAB:
                handleGetCart()
                break;
              case SALE_TAB:
                handleGetSellerOrder()
                break;
              case BUY_TAB:
                handleGetClientOrder()
            }
            setTab(v)
          }} />
          {tab == BID_TAB && carts && (
              carts.map((cart, index) => (
                <CartItem key={'cart' + index} cart={cart} />
              ))
          )}
          { tab != BID_TAB && (
            <Table>
              <NameContainer>
                <Name>{t('Item')}</Name>
                <Name>{t("Order-No")}</Name>
                <Name>{t("Buyer")}</Name>
                <Name>{t("Seller")}</Name>
                <Name>{t("Date")}</Name>
                <Name>{t("Amount")}</Name>
                <Name>{t("Status")}</Name>
              </NameContainer>
              {orders &&
                orders.map((order) => (
                  order.Order_items.map((item) => (
                    <ContentContainer key={order.id}>
                      <img src={order.Order_items[0].product_picture_url} width="100" height="100" />
                      <Content> {order.order_number} </Content>
                      <Content> {truncStr(order.client_name)} </Content>
                      <Content> {truncStr(order.seller_name)} </Content>
                      <Content>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Content>
                      <Content>{item.product_price + handleTokenSwitch(item.Product.extoken)}</Content>
                      <Content>
                        {order.is_completed ? '?????????' : '?????????' }
                      </Content>
                    </ContentContainer>
                  ))
                ))}
            </Table>
          )}
        </Container>
      </ThickNavPage>
    </>
  );
};

export default ClientOrdersPage;
