import { create } from 'zustand'
import { onAuthChange } from '@/firebase/auth'
import { getProfile, setProfile } from '@/firebase/firestore'

/**
 * @typedef {Object} AuthState
 * @property {import('firebase/auth').User | null} user
 * @property {Record<string, any> | null} profile
 * @property {boolean} loading
 * @property {(user: import('firebase/auth').User) => Promise<void>} loadProfile
 * @property {(data: Record<string, any>) => Promise<void>} updateProfile
 * @property {() => () => void} subscribeToAuthChanges
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AuthState>>} */
export const useAuthStore = create((set, get) => ({
  user:    null,
  profile: null,
  loading: true,

  /**
   * Load the user's Firestore profile into the store.
   * @param {import('firebase/auth').User} user
   */
  loadProfile: async (user) => {
    const profile = await getProfile(user.uid)
    set({ profile })
  },

  /**
   * Merge-update the profile in Firestore and local state.
   * @param {Record<string, any>} data
   */
  updateProfile: async (data) => {
    const { user, profile } = get()
    if (!user) return
    await setProfile(user.uid, data)
    set({ profile: { ...profile, ...data } })
  },

  /**
   * Wire up Firebase onAuthStateChanged.
   * Call once in App.jsx. Returns the unsubscribe fn.
   * @returns {() => void}
   */
  subscribeToAuthChanges: () =>
    onAuthChange(async (user) => {
      if (user) {
        await get().loadProfile(user)
        set({ user, loading: false })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    }),
}))
