export async function readApiJson(response) {
  const body = await response.text()
  try {
    return JSON.parse(body)
  } catch {
    const isSourceCode = /^\s*(?:import|export)\s/.test(body)
    throw new Error(isSourceCode
      ? 'The API returned source code instead of JSON. Deploy this app with its serverless API functions enabled.'
      : `The API returned an invalid response (HTTP ${response.status}). Check that the serverless API functions are deployed.`)
  }
}
