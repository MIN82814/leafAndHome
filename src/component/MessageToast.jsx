import { useSelector } from "react-redux";

function MessageToaste() {
  const messages = useSelector((state) => state.message);
  return (
    <div className="position-fixed bottom-0 end-0 p-3 z-3">
      {/* 固定在右下角 */}
      {messages.map((message) => (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" key={message.id}>
          {/* 加入show 預設開啟， 再透過actions 進行操作 */}

          <div className={`toast-header text-white bg-${message.type}`}>
            {/* 改變告警顏色  success or danger*/}
            <strong className="me-auto">{message.title}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToaste;
