import { fetchToken } from "@/services/auth";
import useSWR from "swr";

export function useToken() {
	const { data, error, isLoading } = useSWR<string, Error>("fetch-token", fetchToken);
	return { data, error, isLoading };
}
