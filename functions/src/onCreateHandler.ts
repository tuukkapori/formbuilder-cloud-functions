/* eslint-disable */
import * as functions from 'firebase-functions'
import {
  getIntegrationsByFormId,
  getFormById,
  getGoogleAuthTokenFromDB,
} from './services/database'
import { appendDataToSheet, getGoogleAuthClient } from './services/google'

export const onCreateHandler = functions
  .region('europe-west1')
  .firestore.document('AllAnswers/{formId}/Answers/{answerId}')
  .onCreate(async (snap) => {
    try {
      functions.logger.info('onCreate handler starting')
      const newValue = snap.data()
      const { formId, answers, submittedAt } = newValue
      const [form, integrations] = await Promise.all([
        getFormById(formId),
        getIntegrationsByFormId(formId),
      ])

      if (integrations) {
        if (form && integrations.googleSheets?.enabled) {
          try {
            console.log('google sheets enabled')
            const answersAsArray = form.fields
              .map((field: any) => field.id)
              .map((fieldId: any) => {
                const value = answers[fieldId]

                return value ? value : '-'
              })
            // Convert to correct time zone
            const threeHoursInMilliseconds = 10800000
            const submitDate = new Date(submittedAt + threeHoursInMilliseconds)
            const answersWithSubmitTime = [
              submitDate.toString(),
              ...answersAsArray,
            ]

            const spredsheetId = integrations.googleSheets.sheetId
            const googleUserId = integrations.googleSheets.googleUserId

            const { refreshToken } = (await getGoogleAuthTokenFromDB(
              googleUserId
            )) as any

            const oauthClient = await getGoogleAuthClient()

            oauthClient.setCredentials({ refresh_token: refreshToken })

            const result = await appendDataToSheet(
              oauthClient,
              spredsheetId,
              'A:A',
              answersWithSubmitTime
            )

            functions.logger.info(
              `Result from Google sheet operation: ${JSON.stringify(result)}`
            )
          } catch (error: any) {
            functions.logger.error(
              `Error from google sheets integration: ${error.message}`
            )
          }
        }
      }

      functions.logger.info('onCreate handled automations successfully')
    } catch (error: any) {
      functions.logger.error(
        `Error happeded on onCreate handler: ${error.message}`
      )
    }
  })
