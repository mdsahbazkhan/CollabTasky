import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

// backend returns messages array directly: res.json(messages)
export const getProjectMessages = async (projectId: string) => {
  const res = await handleRequest(API.get(`/messages/project/${projectId}`));
  return Array.isArray(res) ? res : [];
};

// backend returns messages array directly: res.json(messages)
export const getConversationMessages = async (conversationId: string) => {
  const res = await handleRequest(API.get(`/messages/conversation/${conversationId}`));
  return Array.isArray(res) ? res : [];
};

// backend returns conversation object directly: res.json(conversation)
export const createConversation = async (receiverId: string) => {
  const res = await handleRequest(API.post("/conversations", { receiverId }));
  return res || null;
};
