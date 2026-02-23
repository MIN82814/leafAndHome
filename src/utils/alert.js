import Swal from 'sweetalert2';
/**
 * 統一的錯誤提示工具
 * @param {string} title 
 * @param {text} text
 *  @param {err} err
 */
export const showErrorAlert = (title, err,text) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#d33',
    confirmButtonText: '確定',
  });
};