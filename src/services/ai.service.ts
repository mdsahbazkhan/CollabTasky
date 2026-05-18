import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

export const sendMessageToAI = async (messages: any[]) => {
  const res = await handleRequest(API.post("/ai/chat", { messages }));
  return res;
};
