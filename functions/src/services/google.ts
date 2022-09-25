/* eslint-disable import/no-unresolved */
import { google } from 'googleapis'
import * as dotenv from 'dotenv'
import { getFirestore } from 'firebase-admin/firestore'
dotenv.config()

const db = getFirestore()

const getGoogleAuthClient = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  )

  return oAuth2Client
}

const appendDataToSheet = async (
  authClient: any,
  spreadsheetId: string,
  range: string,
  values: any[]
) => {
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      majorDimension: 'ROWS',
      values: [values],
    },
    auth: authClient,
  }

  const response = (await sheets.spreadsheets.values.append(request)).data
  return response
}

const getUserData = async (oauthClient: any) => {
  const googleAuth = google.oauth2({
    version: 'v2',
    auth: oauthClient,
  })

  const googleUserInfo = await googleAuth.userinfo.get()
  return googleUserInfo.data
}

export { getUserData, appendDataToSheet, getGoogleAuthClient, db }
