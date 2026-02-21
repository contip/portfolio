import type { UIFieldServerComponent } from 'payload'
import EmailWorkflowSelectClient from '../Client'
import { getEmailConfigSelectOptions } from '../shared'

const ClientTemplateKeySelect: UIFieldServerComponent = async ({ data }) => {
  const options = await getEmailConfigSelectOptions()
  const initialValue =
    typeof data?.emailWorkflow?.clientTemplateKey === 'string' ? data.emailWorkflow.clientTemplateKey : ''

  return (
    <EmailWorkflowSelectClient
      path="emailWorkflow.clientTemplateKey"
      label="Client Template"
      description="Select which client-facing acknowledgement template this form uses."
      options={options.clientTemplates}
      initialValue={initialValue}
    />
  )
}

export default ClientTemplateKeySelect
