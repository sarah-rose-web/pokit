import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'

/**
 * @typedef {Object} Expense
 * @property {string}  id
 * @property {number}  amount
 * @property {string}  sourceAccountId
 * @property {string}  [jarId]
 * @property {string}  [note]
 * @property {string}  [receiptUrl]
 * @property {string}  createdAt
 */

/**
 * Subscribe to all expenses for a given account, sorted newest-first.
 * Returns an empty array (not an error) if the expenses collection doesn't exist yet.
 *
 * @param {string | null | undefined} uid
 * @param {string | null | undefined} accountId
 * @returns {{ transactions: Expense[], loading: boolean }}
 */
export function useAccountTransactions(uid, accountId) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid || !accountId) {
      setTransactions([])
      setLoading(false)
      return
    }

    const col = collection(db, `users/${uid}/expenses`)
    // Single where — no composite index needed.
    // We sort client-side to avoid needing a Firestore index.
    const q = query(col, where('sourceAccountId', '==', accountId))

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        // Sort newest-first in memory
        docs.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
        setTransactions(docs)
        setLoading(false)
      },
      () => {
        // Collection doesn't exist yet — that's fine
        setTransactions([])
        setLoading(false)
      }
    )

    return () => unsub()
  }, [uid, accountId])

  return { transactions, loading }
}
