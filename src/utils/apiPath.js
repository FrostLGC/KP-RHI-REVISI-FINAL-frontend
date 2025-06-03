export const BASE_URL = "https://kp-rhi-revisi-final-backend-production.up.railway.app";

export const API_PATH = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE_PHOTO: `${BASE_URL}/api/auth/profile/photo`, // Add this line
  },

  USERS: {
    GET_ALL_USERS: `${BASE_URL}/api/users`,
    GET_USER_BY_ID: (userId) => `${BASE_URL}/api/users/${userId}`,
    CREATE_USER: `${BASE_URL}/api/users`,
    UPDATE_USER: (userId) => `${BASE_URL}/api/users/${userId}`,
    DELETE_USER: (userId) => `${BASE_URL}/api/users/${userId}`,
  },

  TASK: {
    GET_DASHBOARD_DATA: `${BASE_URL}/api/tasks/dashboard-data`,
    GET_USER_DASHBOARD_DATA: `${BASE_URL}/api/tasks/user-dashboard-data`,
    GET_ALL_TASKS: `${BASE_URL}/api/tasks`,
    GET_TASK_BY_ID: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    CREATE_TASK: `${BASE_URL}/api/tasks`,
    UPDATE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `${BASE_URL}/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `${BASE_URL}/api/tasks/${taskId}/todo`,
    USERS_TASKS_GROUPED: `${BASE_URL}/api/tasks/users/tasks-grouped`,
  },

  TASK_ASSIGNMENT: {
    CHECK_HIGH_PRIORITY_TASKS: `${BASE_URL}/api/task-assignment/check-high-priority-tasks`,
    GET_USER_REQUESTS: `${BASE_URL}/api/task-assignment/user-requests`,
    RESPOND_TO_REQUEST: (requestId) =>
      `${BASE_URL}/api/task-assignment/${requestId}/respond`,
    GET_ALL_REQUESTS: `${BASE_URL}/api/task-assignment/all-requests`,
  },

  REPORT: {
    EXPORT_TASK: `${BASE_URL}/api/reports/export/tasks`,
    EXPORT_USER: `${BASE_URL}/api/reports/export/users`,
  },

  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },
};
