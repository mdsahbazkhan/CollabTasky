import { API } from "@/src/lib/axios";

// ✅ Project messages
export const getProjectMessages = async (projectId: string) => {
  const res = await API.get(`/messages/project/${projectId}`);
  return res.data;
};

// ✅ DM messages
export const getConversationMessages = async (conversationId: string) => {
  const res = await API.get(`/messages/conversation/${conversationId}`);
  return res.data;
};

// ✅ Create / get conversation
export const createConversation = async (receiverId: string) => {
  const res = await API.post("/conversations", { receiverId });
  return res.data;
};
