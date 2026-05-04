import type {
  AuthResponse,
  FileDraft,
  PaginatedProjects,
  PaginatedQuestions,
  Project,
  ProjectDetail,
  Question,
  User,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Request failed.";
    throw new ApiError(detail, response.status);
  }

  return data as T;
}

export const api = {
  signup: (body: { email: string; password: string; display_name?: string }) =>
    request<AuthResponse>("/auth/signup", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body }),
  logout: () => request<{ detail: string }>("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),
  listProjects: (page = 1, pageSize = 10) =>
    request<PaginatedProjects>(`/projects?page=${page}&page_size=${pageSize}`),
  createProject: (body: { name: string; description?: string }) =>
    request<Project>("/projects", { method: "POST", body }),
  getProject: (projectId: number) => request<ProjectDetail>(`/projects/${projectId}`),
  deleteProject: (projectId: number) => request<void>(`/projects/${projectId}`, { method: "DELETE" }),
  addFiles: (projectId: number, files: FileDraft[]) =>
    request<{ files: unknown[] }>(`/projects/${projectId}/files`, { method: "POST", body: { files } }),
  analyzeProject: (projectId: number) =>
    request<ProjectDetail["latest_analysis"]>(`/projects/${projectId}/analyze`, { method: "POST" }),
  askQuestion: (projectId: number, question: string) =>
    request<Question>(`/projects/${projectId}/questions`, { method: "POST", body: { question } }),
  listQuestions: (projectId: number, page = 1, pageSize = 10) =>
    request<PaginatedQuestions>(`/projects/${projectId}/questions?page=${page}&page_size=${pageSize}`),
};

export function getApiUrl() {
  return API_URL;
}
