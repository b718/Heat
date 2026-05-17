"use client";

import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

interface SessionContextValue {
	sessionId: string | null;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
	const [sessionId, setSessionId] = useState<string | null>(() => sessionStorage.getItem("session_id"));

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sessionIdFromUrl = params.get("session_id");
		if (sessionIdFromUrl) {
			sessionStorage.setItem("session_id", sessionIdFromUrl);
			setSessionId(sessionIdFromUrl);
		}
	}, []);

	return <SessionContext.Provider value={{ sessionId }}>{children}</SessionContext.Provider>;
}

export function useSession() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
}
