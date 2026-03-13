import { useState } from "react";
import { uploadImageApi } from "../../services/upload";
import useMessage from "../../hooks/useMessage";

function Update() {
  const [fileData, setFileData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { showError } = useMessage();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFileData(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileData) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", fileData);
      const response = await uploadImageApi(formData);
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="py-11 py-md-14 bg-neutral-100">
        <div className="container">
          <h3 className="h3 mb-5">請注意，僅限使用 jpg、jpeg 與 png 格式，檔案大小限制為 3MB 以下。</h3>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label h6 mb-3">
              請選擇上傳的圖片
            </label>
            <input className="form-control mb-3" type="file" id="formFile" onChange={handleFileChange} />
            <h6 className="h6 mb-5">{fileData ? `已選擇：${fileData.name} ${Math.ceil(fileData.size / 1024)} KB` : ""}</h6>
            <h6 className="h6 mb-5">{imageUrl ? `${imageUrl}` : ""}</h6>
            <button type="submit" className="btn btn-primary-700" onClick={handleUpload}>
              確認上傳
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Update;
