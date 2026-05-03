import { serverUrl } from "@/consts/api";
import { AccessToken } from "@heat/types";

export const loginUrl = `${serverUrl}/auth/login`;

export async function fetchToken(): Promise<string> {
	const response = await fetch(`${serverUrl}/auth/token`);
	const data: AccessToken = await response.json();
	return data.access_token ?? "";
}
