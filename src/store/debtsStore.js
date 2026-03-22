import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  updateDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} Debt
 * @property {string} id
 * @property {string} name
 * @property {number} principal
 * @property {number} apr
 * @property {number} minPayment
 * @property {string} dueDate      — ISO string
 * @property {number} paidSoFar
 * @property {string} createdAt
 */

/**
 * @typedef {Object} DebtsState
 * @property {Debt[]}            debts
 * @property {'snowball'|'avalanche'} strategy
 * @property {boolean}           loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void} subscribe
 * @property {() => void}            unsubscribe
 * @property {'snowball'|'avalanche'} strategy
 * @property {(s: 'snowball'|'avalanche') => void} setStrategy
 * @property {(uid: string, data: Omit<Debt,'id'|'createdAt'|'paidSoFar'>) => Promise<void>} addDebt
 * @property {(uid: string, id: string, data: Partial<Debt>) => Promise<void>}                updateDebt
 * @property {(uid: string, id: string, amount: number) => Promise<void>}                     recordPayment
 * @property {(uid: string, id: string) => Promise<void>}                                     deleteDebt
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<DebtsState>>} */
export const useDebtsStore = create((set, get) => ({
  debts:    [],
  strategy: /** @type {'snowball'|'avalanche'} */ (localStorage.getItem('pokit-debt-strategy') ?? 'avalanche'),
  loading:  true,
  _unsub:   null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'debts', (docs) => {
      set({ debts: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'asc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ debts: [], loading: true, _unsub: null })
  },

  setStrategy: (s) => {
    localStorage.setItem('pokit-debt-strategy', s)
    set({ strategy: s })
  },

  addDebt: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'debts', id, {
      ...data,
      id,
      paidSoFar: 0,
      createdAt: new Date().toISOString(),
    })
  },

  updateDebt: (uid, id, data) =>
    updateDocument(uid, 'debts', id, data),

  recordPayment: (uid, id, amount) => {
    const debt = get().debts.find((d) => d.id === id)
    if (!debt) return Promise.resolve()
    return updateDocument(uid, 'debts', id, {
      paidSoFar: (debt.paidSoFar ?? 0) + amount,
    })
  },

  deleteDebt: (uid, id) =>
    deleteDocument(uid, 'debts', id),
}))
