import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  updateDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} CalendarEvent
 * @property {string}  id
 * @property {string}  title
 * @property {string}  date        — ISO string (due date)
 * @property {number}  [amount]
 * @property {'bill'|'debt'|'goal'|'reminder'} type
 * @property {string}  [linkedId]  — id of the related jar/debt/goal
 * @property {boolean} isDone
 * @property {string}  createdAt
 */

/**
 * @typedef {Object} CalendarState
 * @property {CalendarEvent[]}   events
 * @property {boolean}           loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void} subscribe
 * @property {() => void}            unsubscribe
 * @property {(uid: string, data: Omit<CalendarEvent,'id'|'createdAt'>) => Promise<void>} addEvent
 * @property {(uid: string, id: string, data: Partial<CalendarEvent>) => Promise<void>}   updateEvent
 * @property {(uid: string, id: string) => Promise<void>}                                 deleteEvent
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<CalendarState>>} */
export const useCalendarStore = create((set, get) => ({
  events:  [],
  loading: true,
  _unsub:  null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'calendar', (docs) => {
      set({ events: docs, loading: false })
    }, { orderByField: 'date', direction: 'asc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ events: [], loading: true, _unsub: null })
  },

  addEvent: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'calendar', id, {
      ...data,
      id,
      isDone: false,
      createdAt: new Date().toISOString(),
    })
  },

  updateEvent: (uid, id, data) =>
    updateDocument(uid, 'calendar', id, data),

  deleteEvent: (uid, id) =>
    deleteDocument(uid, 'calendar', id),
}))
