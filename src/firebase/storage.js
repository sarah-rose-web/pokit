import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

/**
 * Upload a receipt image for an expense.
 * @param {string} uid
 * @param {string} expenseId
 * @param {File} file
 * @returns {Promise<string>} download URL
 */
export async function uploadReceipt(uid, expenseId, file) {
  const ext = file.name.split('.').pop()
  const path = `users/${uid}/receipts/${expenseId}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Get the download URL for an existing file.
 * @param {string} path  — storage path e.g. users/{uid}/receipts/{id}.jpg
 * @returns {Promise<string>}
 */
export function getFileUrl(path) {
  return getDownloadURL(ref(storage, path))
}

/**
 * Upload a card skin image for an account.
 * @param {string} uid
 * @param {string} accountId
 * @param {File} file
 * @returns {Promise<string>} download URL
 */
export async function uploadCardSkin(uid, accountId, file) {
  const ext = file.name.split('.').pop()
  const path = `users/${uid}/card-skins/${accountId}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Delete a file by its storage path.
 * @param {string} path
 * @returns {Promise<void>}
 */
export function deleteFile(path) {
  return deleteObject(ref(storage, path))
}
