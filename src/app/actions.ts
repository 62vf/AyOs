"use server";

import { askVoidMind, askVoidMindUncensored } from "@/ai/flows/ask-voidmind";

export async function askVoidMindAction(query: string): Promise<string> {
  try {
    const result = await askVoidMind({ query });
    return result.response;
  } catch (error) {
    console.error("Error calling askVoidMind:", error);
    return "An error occurred while contacting the AI. Please check the server logs.";
  }
}

export async function askVoidMindUncensoredAction(query: string): Promise<string> {
    try {
      const result = await askVoidMindUncensored({ query });
      return result.response;
    } catch (error) {
      console.error("Error calling askVoidMindUncensored:", error);
      return "An error occurred while contacting the AI. Please check the server logs.";
    }
}
