import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import FileController from "./app/controllers/FileController";
import DeliverymanController from "./app/controllers/DeliverymanController";
import DeliveryController from "./app/controllers/DeliveryController";
import DeliveryStatusController from "./app/controllers/DeliveryStatusController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

// routes.get("/", (req, res) => {
//   return res.json({ teste: "passou" });
// });

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.post("/recipients", RecipientController.store);
routes.put("/recipients/:id", RecipientController.update);

routes.post("/deliverymen", DeliverymanController.store);
routes.put("/deliverymen/:id", DeliverymanController.update);
routes.get("/deliverymen", DeliverymanController.index);
routes.delete("/deliverymen/:id", DeliverymanController.delete);

routes.get("/delivery", DeliveryController.index);
routes.post("/delivery", DeliveryController.store);
routes.put("/delivery/:id", DeliveryController.update);
routes.delete("/delivery/:id", DeliveryController.delete);

//routes.get("/deliveryman/:id", DeliveryStatusController.index);
routes.get("/deliveryman/:id/deliveries", DeliveryStatusController.index);
routes.put(
  "/deliveryman/:deliveryman_id/delivery/:delivery_id",
  DeliveryStatusController.update
);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
