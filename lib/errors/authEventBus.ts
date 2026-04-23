export type AuthFailureReason = "UNAUTHORIZED";

type Listener = (reason: AuthFailureReason) => void;

class AuthEventBus {
  private listeners = new Set<Listener>();

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  emit(reason: AuthFailureReason): void {
    for (const cb of this.listeners) cb(reason);
  }
}

export const authEventBus = new AuthEventBus();

