import { body } from "express-validator";
import { AvailableTaskStatus, AvailableUserRole } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("new password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembersToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator = () => [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("status")
    .optional()
    .isIn(AvailableTaskStatus)
    .withMessage("Invalid task status"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid assigned user id"),
];

const updateTaskValidator = () => [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(AvailableTaskStatus)
    .withMessage("Invalid task status"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid assigned user id"),
];

const createSubTaskValidator = () => [
  body("title").trim().notEmpty().withMessage("Sub task title is required"),
];

const updateSubTaskValidator = () => [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be boolean"),
];

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembersToProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
};
