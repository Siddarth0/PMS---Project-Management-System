import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      throw new ApiError(404, "Assigned user not found");
    }
  }

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate("assignedTo", "_id username fullName avatar")
    .populate("assignedBy", "_id username fullName avatar");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await Subtask.find({ task: task._id }).populate(
    "createdBy",
    "_id username fullName avatar",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...task.toObject(),
        subtasks,
      },
      "Task fetched successfully",
    ),
  );
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      throw new ApiError(404, "Assigned user not found");
    }
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(assignedTo !== undefined
        ? { assignedTo: new mongoose.Types.ObjectId(assignedTo) }
        : {}),
      ...(status !== undefined ? { status } : {}),
    },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Subtask.deleteMany({ task: task._id });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: task._id,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Sub task created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { taskId, subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const subtask = await Subtask.findOneAndUpdate(
    { _id: subTaskId, task: taskId },
    {
      ...(title !== undefined ? { title } : {}),
      ...(isCompleted !== undefined ? { isCompleted } : {}),
    },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Sub task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Sub task updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { taskId, subTaskId } = req.params;

  const subtask = await Subtask.findOneAndDelete({ _id: subTaskId, task: taskId });

  if (!subtask) {
    throw new ApiError(404, "Sub task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Sub task deleted successfully"));
});

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
