import type { PaginationProps } from 'antd';
import { Pagination, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import type { FC } from 'react';

type TableProps = {
  columns?: any;
  data?: any;
  total?: number;
  rowKey?: boolean;
  pageIndex?: number;
  pageSize?: number;
  onChangePage?: any;
  scroll?: any;
};


const TableComponent:FC<TableProps> =  React.memo((props)=>{
    const { columns, data, total, rowKey = false, pageIndex, pageSize, onChangePage, scroll } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const startRenderTime = performance.now();
  
  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    console.log('Selected Row Keys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  // useMemo để tránh tính toán lại object rowSelection
  const rowSelection: TableRowSelection<any> | undefined = useMemo(
    () =>
      rowKey
        ? {
            selectedRowKeys,
            onChange: onSelectChange,
          }
        : undefined,
    [rowKey, selectedRowKeys, onSelectChange]
  );

  const showTotal: PaginationProps['showTotal'] = (total) =>
    `Tổng ${total}`;

  useEffect(() => {
    const endRenderTime = performance.now();
    console.log(`🕒 TableComponent render time: ${(endRenderTime - startRenderTime).toFixed(2)}ms`);
  });
    return <Fragment>
    <Table<any>
      columns={columns}
      dataSource={data?.length > 0 ? data : []}
      pagination={false}
      rowSelection={rowSelection}
      rowKey={(record) => record.id}
      size="small"
      scroll={scroll}
      bordered
      sticky 
    />
   <div className="mt-2">
   <Pagination
      
      size="default"
      align="end"
      showSizeChanger
      current={pageIndex}
      pageSize={pageSize}
      total={total}
      showTotal={showTotal}
      onChange={onChangePage}
      pageSizeOptions={[25, 50, 100, 200, 500, 1000]}
    />
   </div>
  </Fragment>
})

export default TableComponent