import { useSession } from "@/context/SessionContext";
import { fetchToken } from "@/services/auth";
import useSWR from "swr";

export function useToken() {
	const { sessionId } = useSession();

	const { data, error, isLoading } = useSWR<string, Error, [string, string] | null>(
		sessionId ? ["fetch-token", sessionId] : null,
		([_, id]) => fetchToken(id),
	);

	return { data: data ?? "", error, isLoading };
}
