import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUpEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

/**
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInGoogle = () =>
  signInWithPopup(auth, googleProvider)

/**
 * @returns {Promise<void>}
 */
export const signOut = () => firebaseSignOut(auth)

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email)

/**
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback)
