import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} SplitResult
 * @property {number} goals
 * @property {number} bills
 * @property {number} ccMinimums
 * @property {number} debtMinimums
 * @property {number} variableJars
 * @property {number} extraDebtPaydown
 * @property {number} outsideWindowBills
 * @property {number} extraSavings
 * @property {number} leftover
 */

/**
 * @typedef {Object} Paycheck
 * @property {string}      id
 * @property {number}      grossAmount
 * @property {string}      currency     — ISO 4217 e.g. 'PHP', 'USD'
 * @property {string}      gateway      — e.g. 'paypal', 'wise', 'gcash', 'direct'
 * @property {number}      netAmount    — after fees and conversion
 * @property {SplitResult} splits
 * @property {string}      createdAt
 */

/**
 * @typedef {Object} PaycheckState
 * @property {Paycheck[]}        paychecks
 * @property {Paycheck|null}     pendingSplit  — result of running engine, not yet saved
 * @property {boolean}           loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void}                                                subscribe
 * @property {() => void}                                                           unsubscribe
 * @property {(split: Paycheck) => void}                                            setPendingSplit
 * @property {() => void}                                                           clearPendingSplit
 * @property {(uid: string, data: Omit<Paycheck,'id'|'createdAt'>) => Promise<void>} savePaycheck
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<PaycheckState>>} */
export const usePaycheckStore = create((set, get) => ({
  paychecks:    [],
  pendingSplit:  null,
  loading:       true,
  _unsub:        null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'paychecks', (docs) => {
      set({ paychecks: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'desc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ paychecks: [], loading: true, _unsub: null })
  },

  setPendingSplit: (split) => set({ pendingSplit: split }),
  clearPendingSplit: () => set({ pendingSplit: null }),

  savePaycheck: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'paychecks', id, {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    })
  },
}))
