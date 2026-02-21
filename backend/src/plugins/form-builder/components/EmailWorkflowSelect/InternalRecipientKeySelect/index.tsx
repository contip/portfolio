import type { UIFieldServerComponent } from 'payload'
import EmailWorkflowSelectClient from '../Client'
import { getEmailConfigSelectOptions } from '../shared'

const InternalRecipientKeySelect: UIFieldServerComponent = async ({ data }) => {
  const options = await getEmailConfigSelectOptions()
  const initialValue =
    typeof data?.emailWorkflow?.internalRecipientKey === 'string'
      ? data.emailWorkflow.internalRecipientKey
      : ''

  return (
    <EmailWorkflowSelectClient
      path="emailWorkflow.internalRecipientKey"
      label="Internal Recipient Route"
      description="Select the recipient route key from Global > Email Config > Internal Recipient Routes."
      options={options.recipients}
      initialValue={initialValue}
    />
  )
}

export default InternalRecipientKeySelect
