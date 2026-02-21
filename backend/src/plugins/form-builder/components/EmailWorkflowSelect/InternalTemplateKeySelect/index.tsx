import type { UIFieldServerComponent } from 'payload'
import EmailWorkflowSelectClient from '../Client'
import { getEmailConfigSelectOptions } from '../shared'

const InternalTemplateKeySelect: UIFieldServerComponent = async ({ data }) => {
  const options = await getEmailConfigSelectOptions()
  const initialValue =
    typeof data?.emailWorkflow?.internalTemplateKey === 'string'
      ? data.emailWorkflow.internalTemplateKey
      : ''

  return (
    <EmailWorkflowSelectClient
      path="emailWorkflow.internalTemplateKey"
      label="Internal Template"
      description="Select which internal alert template this form uses."
      options={options.internalTemplates}
      initialValue={initialValue}
    />
  )
}

export default InternalTemplateKeySelect
