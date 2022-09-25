/* eslint-disable import/no-unresolved */
import { initializeApp, getApps } from 'firebase-admin/app'
if (!getApps().length) {
  initializeApp()
}
import * as dotenv from 'dotenv'
import { onCreateHandler } from './onCreateHandler'

dotenv.config()

exports.onCreateHandler = onCreateHandler
