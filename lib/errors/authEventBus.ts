export type AuthFailureReason = "UNAUTHORIZED";

type Listener = (reason: AuthFailureReason) => void;

class AuthEventBus {
  private listeners = new Set<Listener>(); //Has a set(HashSet) of listeners that are subscribed to the event bus.

  //Subscribe means start listening to the event bus. 
  // This is a function that takes a callback function and returns a function that unsubscribes from the event bus.
  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
//Emit means send an event to the event bus.
// This is a function that takes a reason and sends it to all the listeners.
  emit(reason: AuthFailureReason): void {
    for (const cb of this.listeners) cb(reason); //For each listener, call the callback function with the reason.
  }
}
//Create a new instance of the AuthEventBus class.
export const authEventBus = new AuthEventBus();
//Export the authEventBus instance so it can be used in other files.
