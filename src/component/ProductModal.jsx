import { useEffect } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import axios from "axios";
import { createAdminProductsApi, updateAdminProductsApi } from "../services/product";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import useMessage from "../hooks/useMessage";

function ProductModal({ modalType, templateData, closeModal, getProducts }) {
  // 處理Modal編輯內容。
  const emptyForm = {
    id: "",
    title: "",
    titleEn: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [""],
    careGuide: {
      light: "",
      watering: "",
      temperature: "",
      humidity: "",
      size: "",
      petSafety: "",
      supportRepotting: "",
      difficulty: "",
    },
    detailedIntro: {
      features: [""],
      careNotes: [""],
      benefits: [""],
    },
    placementScenes: [{ scene: "", phrases: [""] }],
    customerReviews: [""],
  };

  const {
    register, // 用來註冊表單元素
    control,
    handleSubmit, // 用來處理表單提交
    reset,
  } = useForm({
    defaultValues: emptyForm,
  });

  const title = useWatch({ control, name: "title" });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const imagesUrl = useWatch({
    control,
    name: "imagesUrl",
  });
  const features = useWatch({
    control,
    name: "detailedIntro.features",
  });
  const careNotes = useWatch({
    control,
    name: "detailedIntro.careNotes",
  });
  const benefits = useWatch({
    control,
    name: "detailedIntro.benefits",
  });
  const placementScenes = useWatch({
    control,
    name: "placementScenes",
  });

  // Field Array
  const imagesFA = useFieldArray({ control, name: "imagesUrl" });
  const featuresFA = useFieldArray({ control, name: "detailedIntro.features" });
  const careNotesFA = useFieldArray({ control, name: "detailedIntro.careNotes" });
  const benefitsFA = useFieldArray({ control, name: "detailedIntro.benefits" });
  const scenesFA = useFieldArray({
    control,
    name: "placementScenes",
  });

  const { showError } = useMessage();
  // const {
  //   fields: imagesFields,
  //   append: appendImage,
  //   remove: removeImage,
  // } = useFieldArray({
  //   control,
  //   name: "imagesUrl",
  // });

  //當點擊新的產品改變templateData後 需要重新設定Modal暫存值。
  useEffect(() => {
    if (!templateData?.id && modalType !== "create") return;
    if (modalType === "create") {
      reset(emptyForm);
    } else {
      // 資料傳入後 重設表單
      reset({
        id: templateData.id,
        title: templateData.title,
        titleEn: templateData.titleEn,
        category: templateData.category,
        origin_price: templateData.origin_price,
        price: templateData.price,
        unit: templateData.unit,
        description: templateData.description,
        content: templateData.content,
        is_enabled: templateData.is_enabled,
        imageUrl: templateData.imageUrl,
        imagesUrl: templateData.imagesUrl,
        careGuide: templateData.careGuide,
        detailedIntro: templateData.detailedIntro,
        placementScenes: templateData.placementScenes,
        customerReviews: templateData.customerReviews,
      });
    }
  }, [templateData, reset]);

  // 刪除產品
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      getProducts();
      closeModal();
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const sendSubmit = async (data) => {
    const productData = {
      data: {
        ...data,
        origin_price: Number(data.origin_price),
        price: Number(data.price),
        is_enabled: data.is_enabled ? 1 : 0,
        imagesUrl: [...data.imagesUrl.filter((url) => url !== "")],
      },
    };
    try {
      if (modalType === "edit") {
        await updateAdminProductsApi(productData);
      } else {
        await createAdminProductsApi(productData);
      }

      getProducts();
      closeModal();
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  return (
    <>
      <div id="productModal" className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <form onSubmit={handleSubmit(sendSubmit)}>
              {/* 調整 Modal 標題顏色 */}
              <div className={`modal-header bg-${modalType === "delete" ? "danger text-white" : "info"}`}>
                {/* 調整 Modal 標題 */}
                <h5 id="productModalLabel" className="modal-title">
                  {modalType === "delete" ? "刪除產品" : modalType === "edit" ? "編輯產品" : "新增產品"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* 調整 Modal 顯示內容 */}
                  {modalType === "delete" ? (
                    <>
                      {/* 刪除則顯示原標題 不提供編輯 */}
                      <h2 className="h2 text-center text-danger">確定刪除{title}?</h2>
                    </>
                  ) : (
                    <>
                      <div className="col-sm-4">
                        <div className="mb-2">
                          <div className="mb-3">
                            {/* 調整 圖片 */}
                            <label htmlFor="imageUrl" className="form-label">
                              輸入圖片網址(主圖)
                            </label>
                            <input type="text" id="imageUrl" name="imageUrl" className="form-control" placeholder="請輸入圖片連結" {...register("imageUrl")} />
                          </div>
                          {imageUrl && <img className="img-fluid" src={imageUrl} alt="主圖" />}
                        </div>
                        <div>
                          {imagesFA.fields.map((field, index) => (
                            <div key={field.id}>
                              <label htmlFor="imageUrl" className="form-label">
                                輸入圖片網址{index + 1}
                              </label>
                              <input type="text" className="form-control" {...register(`imagesUrl.${index}`)} placeholder={`圖片網址 ${index + 1}`} />
                              {imagesUrl?.[index] && <img className="img-fluid mt-2" src={imagesUrl[index]} alt={`副圖${index + 1}`} />}
                            </div>
                          ))}
                          {/* 大於等於5張時不可以再新增 */}
                          <button type="button" className="btn btn-outline-primary btn-sm d-block w-100" onClick={() => imagesFA.append("")} disabled={imagesUrl.length >= 5}>
                            新增圖片
                          </button>
                        </div>
                        <div>
                          {/* 少於等於1張時不可以刪除 */}
                          <button type="button" className="btn btn-outline-danger btn-sm d-block w-100" onClick={() => imagesFA.remove(imagesUrl.length - 1)} disabled={imagesUrl.length <= 1}>
                            刪除圖片
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            產品名稱(中文)
                          </label>
                          <input name="title" id="title" type="text" className="form-control" placeholder="請輸入產品名稱(中文)" {...register("title")} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="titleEn" className="form-label">
                            產品名稱(英文)
                          </label>
                          <input name="titleEn" id="titleEn" type="text" className="form-control" placeholder="請輸入產品名稱(中文)" {...register("titleEn")} />
                        </div>
                        <div className="row">
                          <div className="mb-3 col-md-6">
                            <label htmlFor="category" className="form-label">
                              分類
                            </label>
                            <input name="category" id="category" type="text" className="form-control" placeholder="請輸入分類" {...register("category")} />
                          </div>
                          <div className="mb-3 col-md-6">
                            <label htmlFor="unit" className="form-label">
                              單位
                            </label>
                            <input name="unit" id="unit" type="text" className="form-control" placeholder="請輸入單位" {...register("unit")} />
                          </div>
                        </div>

                        <div className="row">
                          <div className="mb-3 col-md-6">
                            <label htmlFor="origin_price" className="form-label">
                              原價
                            </label>
                            <input name="origin_price" id="origin_price" type="number" min="0" className="form-control" placeholder="請輸入原價" {...register("origin_price")} />
                          </div>
                          <div className="mb-3 col-md-6">
                            <label htmlFor="price" className="form-label">
                              售價
                            </label>
                            <input name="price" id="price" type="number" min="0" className="form-control" placeholder="請輸入售價" {...register("price")} />
                          </div>
                        </div>
                        <hr />

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            產品描述
                          </label>
                          <textarea name="description" id="description" className="form-control" placeholder="請輸入產品描述" {...register("description")}></textarea>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="content" className="form-label">
                            說明內容
                          </label>
                          <textarea name="content" id="content" className="form-control" placeholder="請輸入說明內容" {...register("content")}></textarea>
                        </div>
                        <div className="mb-3">
                          <div className="form-check">
                            <input name="is_enabled" id="is_enabled" className="form-check-input" type="checkbox" {...register("is_enabled")} />
                            <label className="form-check-label" htmlFor="is_enabled">
                              是否啟用
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h5 className="h5">照顧指南</h5>
                          <label htmlFor="light" className="form-label">
                            光線需求
                          </label>
                          <textarea name="light" id="light" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.light")}></textarea>
                          <label htmlFor="watering" className="form-label">
                            澆水頻率
                          </label>
                          <textarea name="watering" id="watering" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.watering")}></textarea>
                          <label htmlFor="temperature" className="form-label">
                            適合溫度
                          </label>
                          <textarea name="temperature" id="temperature" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.temperature")}></textarea>
                          <label htmlFor="humidity" className="form-label">
                            濕度需求
                          </label>
                          <textarea name="humidity" id="humidity" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.humidity")}></textarea>
                          <label htmlFor="size" className="form-label">
                            尺寸需求
                          </label>
                          <textarea name="size" id="size" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.size")}></textarea>
                          <label htmlFor="petSafety" className="form-label">
                            寵物安全
                          </label>
                          <textarea name="petSafety" id="petSafety" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.petSafety")}></textarea>
                          <label htmlFor="supportRepotting" className="form-label">
                            支撐/換盆建議:
                          </label>
                          <textarea name="supportRepotting" id="supportRepotting" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.supportRepotting")}></textarea>
                          <label htmlFor="difficulty" className="form-label">
                            照顧難度
                          </label>
                          <textarea name="difficulty" id="difficulty" className="form-control" placeholder="請輸入說明內容" {...register("careGuide.difficulty")}></textarea>
                        </div>
                        <div className="mb-3">
                          <h5 className="h5 mb-3">詳細介紹</h5>
                          {/* 最後一筆是空值時不能新增特色 */}
                          <button type="button" className="btn btn-primary-700" onClick={() => featuresFA.append("")} disabled={features[featuresFA.fields.length - 1] === ""}>
                            + 新增特色
                          </button>
                          {featuresFA.fields.map((field, index) => (
                            <div key={field.id} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <label htmlFor={`features-${index}`} className="form-label mb-0">
                                  植物特色-{index + 1}
                                </label>
                                <button type="button" className="btn btn-outline-danger" onClick={() => featuresFA.remove(index)} disabled={featuresFA.fields.length === 1}>
                                  刪除
                                </button>
                              </div>
                              <textarea id={`features-${index}`} className="form-control" placeholder="請輸入說明內容" {...register(`detailedIntro.features.${index}`)} />
                            </div>
                          ))}
                          <button type="button" className="btn btn-primary-700" onClick={() => careNotesFA.append("")} disabled={careNotes[careNotesFA.fields.length - 1] === ""}>
                            + 新增照顧注意事項
                          </button>
                          {careNotesFA.fields.map((field, index) => (
                            <div key={field.id} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <label htmlFor={`careNotes-${index}`} className="form-label mb-0">
                                  照顧注意事項-{index + 1}
                                </label>
                                <button type="button" className="btn btn-outline-danger" onClick={() => careNotesFA.remove(index)} disabled={careNotesFA.fields.length === 1}>
                                  刪除
                                </button>
                              </div>
                              <textarea id={`careNotes-${index}`} className="form-control" placeholder="請輸入說明內容" {...register(`detailedIntro.careNotes.${index}`)} />
                            </div>
                          ))}
                          <button type="button" className="btn btn-primary-700" onClick={() => benefitsFA.append("")} disabled={benefits[benefitsFA.fields.length - 1] === ""}>
                            + 新增為你帶來的好處
                          </button>
                          {benefitsFA.fields.map((field, index) => (
                            <div key={field.id} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <label htmlFor={`benefits-${index}`} className="form-label mb-0">
                                  為你帶來的好處-{index + 1}
                                </label>
                                <button type="button" className="btn btn-outline-danger" onClick={() => benefitsFA.remove(index)} disabled={benefitsFA.fields.length === 1}>
                                  刪除
                                </button>
                              </div>
                              <textarea id={`benefits-${index}`} className="form-control" placeholder="請輸入說明內容" {...register(`detailedIntro.benefits.${index}`)} />
                            </div>
                          ))}
                          {/* 調整場景 */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="h5 mb-0">適用場景</h5>
                              <button type="button" className="btn btn-primary-700" onClick={() => scenesFA.append({ scene: "", phrases: [""] })} disabled={placementScenes[scenesFA.fields.length - 1]?.scene === ""}>
                                + 新增場景
                              </button>
                            </div>
                            {scenesFA.fields.map((field, index) => (
                              <div key={field.id}>
                                <SceneItem index={index} control={control} register={register} removeScene={scenesFA.remove} disableRemoveScene={scenesFA.fields.length === 1} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                {modalType === "delete" ? (
                  <>
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => closeModal()}>
                      取消
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteProduct(templateData.id)}>
                      刪除
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => closeModal()}>
                      取消
                    </button>
                    <button type="submit" className="btn btn-primary">
                      確認
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProductModal;

function SceneItem({ index, control, register, removeScene, disableRemoveScene }) {
  // ✅ 巢狀 phrases 的 FieldArray
  const phrasesFA = useFieldArray({
    control,
    name: `placementScenes.${index}.phrases`,
  });

  // ✅ 監聽該場景的 phrases，用來做「最後一筆空白就不能新增」之類的防呆
  const phrases = useWatch({
    control,
    name: `placementScenes.${index}.phrases`,
  });

  return (
    <div className="mb-4 border rounded p-3">
      {/* 場景標題 + 刪除場景 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">場景 {index + 1}</h6>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeScene(index)} disabled={disableRemoveScene}>
          刪除場景
        </button>
      </div>

      {/* scene 欄位 */}
      <label className="form-label">場景名稱</label>
      <textarea className="form-control mb-3" placeholder="例如：客廳角落" {...register(`placementScenes.${index}.scene`)} />

      {/* phrases 區塊 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">擺放建議（phrases）</h6>
        <button
          type="button"
          className="btn btn-primary-700 btn-sm"
          onClick={() => phrasesFA.append("")}
          disabled={phrases?.[phrasesFA.fields.length - 1] === ""} // 最後一筆空白就不給加
        >
          + 新增建議
        </button>
      </div>

      {phrasesFA.fields.map((field, phraseIndex) => (
        <div key={field.id} className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label mb-0">建議 {phraseIndex + 1}</label>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => phrasesFA.remove(phraseIndex)} disabled={phrasesFA.fields.length === 1}>
              刪除
            </button>
          </div>

          <input type="text" className="form-control" placeholder="例如：距離窗戶 1–2 公尺最佳" {...register(`placementScenes.${index}.phrases.${phraseIndex}`)} />
        </div>
      ))}
    </div>
  );
}
