import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";

const TableDetailComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
    exportToExcel
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };
  
  return (
    <Loading isPending={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
      </div>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableDetailComponent;
