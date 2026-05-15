export type Session = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
};

const sessions = new Map<string, Session>();

export function getSession(id: string): Session | undefined {
	return sessions.get(id);
}

export function setSession(id: string, session: Session): void {
	sessions.set(id, session);
}

export function deleteSession(id: string): void {
	sessions.delete(id);
}
