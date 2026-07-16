import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

export const sendMessageToAI = async (messages: any[]) => {
  const res = await handleRequest(API.post("/ai/chat", { messages }));
  return res;
};

export const sendProjectAIMessage = async (
  projectId: string,
  message: string,
  messages: { role: string; content: string }[],
) => {
  const res = await handleRequest(
    API.post(`/ai/projects/${projectId}/ai/chat`, { message, messages }),
  );
  return res;
};
