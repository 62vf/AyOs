"use server";

import { askVoidMind } from "@/ai/flows/ask-voidmind";

export async function askVoidMindAction(query: string): Promise<string> {
  try {
    const result = await askVoidMind({ query });
    return result.response;
  } catch (error) {
    console.error("Error calling askVoidMind:", error);
    return "An error occurred while contacting the AI. Please check the server logs.";
  }
}
