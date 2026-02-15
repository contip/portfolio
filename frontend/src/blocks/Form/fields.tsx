import { Checkbox } from "./fields/Checkbox";
import { Country } from "./fields/Country";
import { Email } from "./fields/Email";
import { Hidden } from "./fields/Hidden";
import { Message } from "./fields/Message";
import { NumberField } from "./fields/Number";
import { SelectField } from "./fields/Select";
import { State } from "./fields/State";
import { Text } from "./fields/Text";
import { Textarea } from "./fields/Textarea";

export const fields = {
  checkbox: Checkbox,
  country: Country,
  email: Email,
  message: Message,
  number: NumberField,
  select: SelectField,
  state: State,
  text: Text,
  hidden: Hidden,
  textarea: Textarea,
};
