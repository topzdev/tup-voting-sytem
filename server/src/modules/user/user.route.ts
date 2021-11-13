import express from "express";
import userController from "./user.controller";
const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.create);
router.put("/", userController.update);
router.delete("/:id", userController.remove);
router.put("/:id", userController.restore);

const userRoute = router;

export default userRoute;
