import { db } from './google'

const getIntegrationsByFormId = async (formId: string) => {
  const automations = await db.collection('Integrations').doc(formId).get()
  return automations.data() as any
}

const getFormById = async (formId: string) => {
  const form = await db.collection('Forms').doc(formId).get()

  return form.data() as any
}

const getGoogleAuthTokenFromDB = async (googleUserId: string) => {
  const token = await db.collection('GoogleTokens').doc(googleUserId).get()
  return token.data()
}

export { getIntegrationsByFormId, getFormById, getGoogleAuthTokenFromDB }
