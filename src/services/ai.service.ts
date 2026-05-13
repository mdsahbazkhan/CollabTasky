import { API } from "@/src/lib/axios";
import { handleRequest } from "../lib/utils";

export const sendMessageToAI = async (message: string) => {
  const res = await handleRequest(API.post("/ai/chat", { message }));
  return res;
};
