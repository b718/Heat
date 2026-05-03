import { serverUrl } from "@/consts/api";
import { AccessToken } from "@heat/types";

export const loginUrl = `${serverUrl}/auth/login`;

export async function fetchToken(): Promise<string> {
	const res = await fetch(`${serverUrl}/auth/token`);
	const data: AccessToken = await res.json();
	return data.access_token ?? "";
}
