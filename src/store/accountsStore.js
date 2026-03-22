import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  updateDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} Account
 * @property {string}  id
 * @property {string}  name
 * @property {'cash'|'bank'|'credit'|'ewallet'} type
 * @property {number}  balance
 * @property {string}  [lastFour]
 * @property {string}  [cardSkin]   — CSS class name for skeuomorphic card style
 * @property {string}  createdAt    — ISO string
 */

/**
 * @typedef {Object} AccountsState
 * @property {Account[]} accounts
 * @property {boolean}   loading
 * @property {(() => void) | null} _unsub
 * @property {(uid: string) => void}              subscribe
 * @property {() => void}                         unsubscribe
 * @property {(uid: string, data: Omit<Account, 'id' | 'createdAt'>) => Promise<void>} addAccount
 * @property {(uid: string, id: string, data: Partial<Account>) => Promise<void>}       updateAccount
 * @property {(uid: string, id: string) => Promise<void>}                               deleteAccount
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AccountsState>>} */
export const useAccountsStore = create((set, get) => ({
  accounts: [],
  loading:  true,
  _unsub:   null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'accounts', (docs) => {
      set({ accounts: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'asc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ accounts: [], loading: true, _unsub: null })
  },

  addAccount: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'accounts', id, {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    })
  },

  updateAccount: (uid, id, data) =>
    updateDocument(uid, 'accounts', id, data),

  deleteAccount: (uid, id) =>
    deleteDocument(uid, 'accounts', id),
}))
