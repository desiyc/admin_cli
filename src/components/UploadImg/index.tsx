import { Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { bindHeader, requestFile } from '@/utils/dva17';
import { useState } from 'react';
import { find, remove } from 'lodash';
import './index.less';

//maxCount = 最大上传数量
//files = 已上传的文件数组
//setFiles = 更新文件数组的函数
//mini = 小尺寸上传组件：64*64，反之则为108*108
export default (props: any) => {
  const { maxCount, files = [], setFiles, mini = false, onChange, uploadAccept } = props;
  const [loading, setLoading] = useState(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8, color: '#666', fontSize: mini ? '12px' : '14px' }}>点击上传</div>
    </div>
  );
  return (
    <div className={`upload_contain ${mini ? 'upload_contain_mini' : ''}`}>
      <Upload
        {...props}
        listType="picture-card"
        accept={uploadAccept ? uploadAccept : 'image/*'}
        multiple={maxCount === 1 ? false : true}
        maxCount={maxCount || '-'}
        fileList={files}
        onRemove={(file: any) => {
          const old: any = find(files, { uid: file.uid });
          if (old) {
            remove(files, old);
            setFiles(files.concat());
            if (onChange) onChange(files);
          }
        }}
        beforeUpload={async (file: any) => {
          try {
            setLoading(true);
            bindHeader('filename', encodeURI(file.name));
            const res = await requestFile('mi/uploadFile', file);
            setLoading(false);
            if (maxCount === 1) {
              setFiles([{ uid: 0, name: res.url, thumbUrl: res.url, url: res.url }]);
              if (onChange) onChange(files);
            } else {
              files.push({ uid: files.length, name: res.url, thumbUrl: res.url, url: res.url });
              setFiles(files.concat());
              if (onChange) onChange(files);
            }
          } catch (err) {
            setLoading(false);
          }
          bindHeader('filename', null);
          return false;
        }}
      >
        {maxCount && files.length >= maxCount ? null : uploadButton}
      </Upload>
    </div>
  );
};
