import { serverUrl } from "@/consts/api";
import { AccessToken } from "@heat/types";

export const loginUrl = `${serverUrl}/auth/login`;

export async function fetchToken(): Promise<string> {
	const response = await fetch(`${serverUrl}/auth/token`);
	if (!response.ok) throw new Error("Unable to authenticate user, please try again later :(");
	const data: AccessToken = await response.json();
	return data.access_token ?? "";
}
