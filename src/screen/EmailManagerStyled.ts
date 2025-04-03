import { Collapse } from "antd";
import styled from "styled-components";

export const MainContainer = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px; 

    .search-input{
        width: 100%; 
        margin-bottom:10px; 
    }

    .ant-btn:hover {
        border: none;
    }

    .grouped-email{
            text-align: justify;
    }
`
export const EmailListItems = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
`

export const EmailCollapseContainer = styled(Collapse)`
    border: none;
    background: none;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .ant-collapse-content{
        border-top: none;
    }

    .ant-collapse-item{
    .ant-collapse-header {
        padding: 0;
}}
`