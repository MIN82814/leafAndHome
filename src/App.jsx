import { createHashRouter, RouterProvider } from "react-router";
import routes from "./router";
import MessageToaste from "./component/MessageToast";

const router = createHashRouter(routes);
function App() {
  return (
    <>
      <MessageToaste />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
