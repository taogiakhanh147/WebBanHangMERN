import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(26,148,255);
`

export const WrapperTextHeader = styled.div`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    height: 100%;
    padding-top:10px;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
`