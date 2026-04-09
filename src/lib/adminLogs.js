import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const authLogCollection = 'admin_auth_logs'
const paymentLogCollection = 'admin_payment_logs'

const normalizeSnapshot = (snapshot) =>
  snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }))

const ensureFirestore = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase belum dikonfigurasi untuk audit log admin.')
  }
}

const createLogPayload = (payload) => ({
  ...payload,
  createdAt: serverTimestamp(),
})

const normalizeAuthPayload = (payload) => ({
  type: payload.type || 'login',
  userEmail: payload.userEmail || '',
  userName: payload.userName || '',
  loggedInAt: payload.loggedInAt || '',
})

const normalizePaymentPayload = (payload) => ({
  orderId: payload.orderId || '',
  type: payload.type || 'payment_event',
  paymentStatus: payload.paymentStatus || '',
  fraudStatus: payload.fraudStatus || '',
  packageCode: payload.packageCode || '',
  packageName: payload.packageName || '',
  amount: Number(payload.amount || 0),
  customerName: payload.customerName || '',
  customerEmail: payload.customerEmail || '',
  customerPhone: payload.customerPhone || '',
  notes: payload.notes || '',
  loggedInUser: payload.loggedInUser || '',
  redirectUrl: payload.redirectUrl || '',
  transactionId: payload.transactionId || '',
  errorMessage: payload.errorMessage || '',
})

const writeAuthLog = async (payload) => {
  ensureFirestore()

  return addDoc(collection(db, authLogCollection), createLogPayload(normalizeAuthPayload(payload)))
}

const writePaymentLog = async (payload) => {
  ensureFirestore()

  return addDoc(
    collection(db, paymentLogCollection),
    createLogPayload(normalizePaymentPayload(payload)),
  )
}

const fetchAuthLogs = async (maxItems = 25) => {
  ensureFirestore()

  const snapshot = await getDocs(
    query(collection(db, authLogCollection), orderBy('createdAt', 'desc'), limit(maxItems)),
  )

  return normalizeSnapshot(snapshot)
}

const fetchPaymentLogs = async (maxItems = 25) => {
  ensureFirestore()

  const snapshot = await getDocs(
    query(collection(db, paymentLogCollection), orderBy('createdAt', 'desc'), limit(maxItems)),
  )

  return normalizeSnapshot(snapshot)
}

export { fetchAuthLogs, fetchPaymentLogs, writeAuthLog, writePaymentLog }
