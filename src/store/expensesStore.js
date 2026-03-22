import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} Expense
 * @property {string} id
 * @property {number} amount
 * @property {string} sourceAccountId
 * @property {string} [jarId]
 * @property {string} [note]
 * @property {string} [receiptUrl]
 * @property {string} createdAt   — ISO string
 */

/**
 * @typedef {Object} ExpensesState
 * @property {Expense[]}         expenses
 * @property {boolean}           loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void} subscribe
 * @property {() => void}            unsubscribe
 * @property {(uid: string, data: Omit<Expense,'id'|'createdAt'>) => Promise<void>} addExpense
 * @property {(uid: string, id: string) => Promise<void>}                           deleteExpense
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ExpensesState>>} */
export const useExpensesStore = create((set, get) => ({
  expenses: [],
  loading:  true,
  _unsub:   null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'expenses', (docs) => {
      set({ expenses: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'desc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ expenses: [], loading: true, _unsub: null })
  },

  addExpense: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'expenses', id, {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    })
  },

  deleteExpense: (uid, id) =>
    deleteDocument(uid, 'expenses', id),
}))
