import { cloneDeep, remove } from 'lodash';

//删除对象中的空值
export const bodyFormat = (payload: any) => {
  for (const index in payload) {
    if (!payload[index] && payload[index] !== 0 && typeof payload[index] !== 'boolean') {
      delete payload[index];
    }
    if (payload[index] && Array.isArray(payload[index]) && payload[index].length === 0) {
      delete payload[index];
    }
  }
  return payload;
};

//Table组件（通用）：rowSelection勾选的逻辑处理
export const currencyRowSelection = (props: any) => {
  const {
    type = 'checkbox', //默认为多选
    selectedRowKeys, //必填
    setSelectedRowKeys, //必填
    selectedRows, //选填
    setSelectedRows, //选填
  } = props;
  const rowKeys = cloneDeep(selectedRowKeys);
  const rowData = cloneDeep(selectedRows);
  if (type === 'radio') {
    return {
      type,
      selectedRowKeys: rowKeys,
      fixed: 'left',
      onChange: (keys: any, rows: any) => {
        setSelectedRowKeys(keys.concat());
        if (rowData) setSelectedRows(rows.concat());
      },
    };
  }
  return {
    type,
    selectedRowKeys: rowKeys,
    fixed: 'left',
    onChange: (keys: any, rows: any, info: any) => {
      if (info.type === 'none') {
        if (rowKeys) setSelectedRowKeys([]);
        if (rowData) setSelectedRows([]);
      }
    },
    onSelect: (record: any, selected: boolean) => {
      //单选或取消时的逻辑处理
      const index = rowKeys.indexOf(record.id);
      if (selected) {
        if (index < 0) {
          rowKeys.push(record.id);
          if (rowData) rowData.push(record);
        }
      } else {
        if (index >= 0) {
          rowKeys.splice(index, 1);
          if (rowData) remove(rowData, record);
        }
      }
      setSelectedRowKeys(rowKeys.concat());
      if (rowData) setSelectedRows(rowData.concat());
    },
    onSelectAll: (selected: boolean, rows: any, changeRows: any) => {
      //全选或取消时的逻辑处理
      changeRows.map((record: any) => {
        const index = rowKeys.indexOf(record.id);
        if (selected) {
          if (index < 0) {
            rowKeys.push(record.id);
            if (rowData) rowData.push(record);
          }
        } else {
          if (index >= 0) {
            rowKeys.splice(index, 1);
            if (rowData) remove(rowData, record);
          }
        }
        setSelectedRowKeys(rowKeys.concat());
        if (rowData) setSelectedRows(rowData.concat());
      });
    },
  };
};

// 下载文件，buffer二进制流
export const downFile = (buffer: any, fienName = 'fienName.xlsx') => {
  const blob = new Blob([buffer], {
    type: 'application/application/octet-stream',
  });
  const fileName = fienName;
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
};
