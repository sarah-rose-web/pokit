import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  updateDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} Jar
 * @property {string}          id
 * @property {string}          name
 * @property {'lidded'|'open'} type   — lidded = honey jar (savings), open = honey pot (spending)
 * @property {number}          target — allocation amount per paycheck
 * @property {number}          balance
 * @property {string}          [dueDate]  — ISO string, for bill jars
 * @property {string}          emoji
 * @property {string}          createdAt
 */

/**
 * @typedef {Object} JarsState
 * @property {Jar[]}            jars
 * @property {boolean}          loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void} subscribe
 * @property {() => void}            unsubscribe
 * @property {(uid: string, data: Omit<Jar, 'id'|'createdAt'>) => Promise<void>} addJar
 * @property {(uid: string, id: string, data: Partial<Jar>) => Promise<void>}    updateJar
 * @property {(uid: string, id: string, amount: number) => Promise<void>}        topUpJar
 * @property {(uid: string, id: string) => Promise<void>}                        deleteJar
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<JarsState>>} */
export const useJarsStore = create((set, get) => ({
  jars:    [],
  loading: true,
  _unsub:  null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'jars', (docs) => {
      set({ jars: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'asc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ jars: [], loading: true, _unsub: null })
  },

  addJar: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'jars', id, {
      ...data,
      id,
      balance: 0,
      createdAt: new Date().toISOString(),
    })
  },

  updateJar: (uid, id, data) =>
    updateDocument(uid, 'jars', id, data),

  topUpJar: (uid, id, amount) => {
    const jar = get().jars.find((j) => j.id === id)
    if (!jar) return Promise.resolve()
    return updateDocument(uid, 'jars', id, { balance: (jar.balance ?? 0) + amount })
  },

  deleteJar: (uid, id) =>
    deleteDocument(uid, 'jars', id),
}))
