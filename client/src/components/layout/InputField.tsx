import React, { InputHTMLAttributes } from 'react'
import {FormControl, FormLabel, Input, FormErrorMessage} from '@chakra-ui/react'
import { useField } from 'formik'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
  const [field, {error}] = useField(props)
  
  return (
    <FormControl isInvalid={!!error} mb={5}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} id={field.name} {...props} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputField
