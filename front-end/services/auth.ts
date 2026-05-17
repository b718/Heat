import { serverUrl } from "@/consts/api";
import { AccessToken } from "@heat/types";

export const loginUrl = `${serverUrl}/auth/login`;

export async function fetchToken(sessionId: string): Promise<string | null> {
	const response = await fetch(`${serverUrl}/auth/token?session_id=${encodeURIComponent(sessionId)}`);
	if (response.status === 401) return null;
	if (!response.ok) throw new Error("Unable to authenticate user, please try again later :(");
	const data: AccessToken = await response.json();
	return data.access_token ?? "";
}
