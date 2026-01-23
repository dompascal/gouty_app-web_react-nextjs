import { EventEmitter } from 'events';

// This is a simple event emitter that can be used to broadcast errors
// from anywhere in the app. A listener component will catch these and
// display a toast notification.
export const errorEmitter = new EventEmitter();
