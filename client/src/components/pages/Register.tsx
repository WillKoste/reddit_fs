import React from 'react'
import {Formik, Form} from 'formik'
import {Button} from '@chakra-ui/react'
import Wrapper from '../layout/Wrapper'
import InputField from '../layout/InputField'
import { useRegisterMutation } from '../../generated/graphql'
import { toErrorMap } from '../../utils/toErrorMap'

interface RegisterProps {
  history: any
}

const Register: React.FC<RegisterProps> = ({history}) => {
  const formData = {
    username: '',
    password: '',
  }

  const [{}, register] = useRegisterMutation()

  const {username, password} = formData

  console.log({history});
  
  
  return (
    <Wrapper variant="small">
      <Formik initialValues={formData} onSubmit={async (values, {setErrors, setSubmitting}) => {
        const response = await register(values)
        if(response.data?.register?.errors){
          setErrors(toErrorMap(response.data.register.errors))
        } else if(response.data?.register?.user){
          history.push('/')
        }
        setSubmitting(false)
      }}>
        {({isSubmitting, handleSubmit}) => (
          <Form onSubmit={handleSubmit} >
            <InputField name="username" label="Username" />
            <InputField name="password" label="Password" type="password" />
            <Button display="block" w="100%" bg="blue.200" type="submit" _hover={{bg:'blue.300'}} isLoading={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register
