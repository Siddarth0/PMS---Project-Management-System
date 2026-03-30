import { Router } from "express";
import {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createSubTaskValidator,
  createTaskValidator,
  updateSubTaskValidator,
  updateTaskValidator,
} from "../validators/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/project/:projectId").get(getTasks).post(createTaskValidator(), validate, createTask);
router
  .route("/:taskId")
  .get(getTaskById)
  .patch(updateTaskValidator(), validate, updateTask)
  .delete(deleteTask);

router
  .route("/:taskId/subtasks")
  .post(createSubTaskValidator(), validate, createSubTask);
router
  .route("/:taskId/subtasks/:subTaskId")
  .patch(updateSubTaskValidator(), validate, updateSubTask)
  .delete(deleteSubTask);

export default router;
