import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

/**
 * Base path for all user data.
 * @param {string} uid
 * @returns {string}
 */
const userPath = (uid) => `users/${uid}`

/**
 * Get a single document.
 * @param {string} uid
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<Record<string, any> | null>}
 */
export async function getDocument(uid, collectionName, docId) {
  const ref = doc(db, userPath(uid), collectionName, docId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Get all documents in a subcollection.
 * @param {string} uid
 * @param {string} collectionName
 * @param {{ orderByField?: string, direction?: 'asc' | 'desc' }} [options]
 * @returns {Promise<Array<Record<string, any>>>}
 */
export async function getCollection(uid, collectionName, options = {}) {
  const col = collection(db, userPath(uid), collectionName)
  const q = options.orderByField
    ? query(col, orderBy(options.orderByField, options.direction ?? 'desc'))
    : col
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Set (create or overwrite) a document.
 * @param {string} uid
 * @param {string} collectionName
 * @param {string} docId
 * @param {Record<string, any>} data
 * @returns {Promise<void>}
 */
export async function setDocument(uid, collectionName, docId, data) {
  const ref = doc(db, userPath(uid), collectionName, docId)
  return setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

/**
 * Update specific fields on a document.
 * @param {string} uid
 * @param {string} collectionName
 * @param {string} docId
 * @param {Record<string, any>} data
 * @returns {Promise<void>}
 */
export async function updateDocument(uid, collectionName, docId, data) {
  const ref = doc(db, userPath(uid), collectionName, docId)
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

/**
 * Delete a document.
 * @param {string} uid
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<void>}
 */
export async function deleteDocument(uid, collectionName, docId) {
  const ref = doc(db, userPath(uid), collectionName, docId)
  return deleteDoc(ref)
}

/**
 * Subscribe to realtime updates on a subcollection.
 * @param {string} uid
 * @param {string} collectionName
 * @param {(docs: Array<Record<string, any>>) => void} callback
 * @param {{ orderByField?: string, direction?: 'asc' | 'desc' }} [options]
 * @returns {() => void} unsubscribe
 */
export function listenToCollection(uid, collectionName, callback, options = {}) {
  const col = collection(db, userPath(uid), collectionName)
  const q = options.orderByField
    ? query(col, orderBy(options.orderByField, options.direction ?? 'desc'))
    : col
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

/**
 * Get or set the user's profile document at /users/{uid}/profile.
 * @param {string} uid
 * @returns {Promise<Record<string, any> | null>}
 */
export const getProfile = (uid) =>
  getDocument(uid, 'profile', 'profile')

/**
 * @param {string} uid
 * @param {Record<string, any>} data
 * @returns {Promise<void>}
 */
export const setProfile = (uid, data) =>
  setDocument(uid, 'profile', 'profile', data)

export { serverTimestamp, Timestamp }
