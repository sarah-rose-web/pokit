import { create } from 'zustand'
import { nanoid } from 'nanoid'
import {
  listenToCollection,
  setDocument,
  updateDocument,
  deleteDocument,
} from '@/firebase/firestore'

/**
 * @typedef {Object} Contribution
 * @property {string} date    — ISO string
 * @property {number} amount
 * @property {string} note
 */

/**
 * @typedef {Object} Goal
 * @property {string}         id
 * @property {string}         name
 * @property {number}         targetAmount
 * @property {number}         savedAmount
 * @property {string}         targetDate     — ISO string
 * @property {Contribution[]} contributions
 * @property {string}         createdAt
 */

/**
 * @typedef {Object} GoalsState
 * @property {Goal[]}            goals
 * @property {boolean}           loading
 * @property {(() => void)|null} _unsub
 * @property {(uid: string) => void} subscribe
 * @property {() => void}            unsubscribe
 * @property {(uid: string, data: Omit<Goal,'id'|'createdAt'|'savedAmount'|'contributions'>) => Promise<void>} addGoal
 * @property {(uid: string, id: string, data: Partial<Goal>) => Promise<void>}                                  updateGoal
 * @property {(uid: string, id: string, amount: number, note?: string) => Promise<void>}                        contribute
 * @property {(uid: string, id: string) => Promise<void>}                                                       deleteGoal
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<GoalsState>>} */
export const useGoalsStore = create((set, get) => ({
  goals:   [],
  loading: true,
  _unsub:  null,

  subscribe: (uid) => {
    const unsub = listenToCollection(uid, 'goals', (docs) => {
      set({ goals: docs, loading: false })
    }, { orderByField: 'createdAt', direction: 'asc' })
    set({ _unsub: unsub })
  },

  unsubscribe: () => {
    get()._unsub?.()
    set({ goals: [], loading: true, _unsub: null })
  },

  addGoal: (uid, data) => {
    const id = nanoid()
    return setDocument(uid, 'goals', id, {
      ...data,
      id,
      savedAmount:   0,
      contributions: [],
      createdAt: new Date().toISOString(),
    })
  },

  updateGoal: (uid, id, data) =>
    updateDocument(uid, 'goals', id, data),

  contribute: (uid, id, amount, note = '') => {
    const goal = get().goals.find((g) => g.id === id)
    if (!goal) return Promise.resolve()
    const entry = { date: new Date().toISOString(), amount, note }
    return updateDocument(uid, 'goals', id, {
      savedAmount:   (goal.savedAmount ?? 0) + amount,
      contributions: [...(goal.contributions ?? []), entry],
    })
  },

  deleteGoal: (uid, id) =>
    deleteDocument(uid, 'goals', id),
}))
