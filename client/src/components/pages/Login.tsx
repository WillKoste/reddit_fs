import React from 'react'
import {Formik, Form} from 'formik'
import {Button} from '@chakra-ui/react'
import Wrapper from '../layout/Wrapper'
import InputField from '../layout/InputField'
import { useRegisterMutation } from '../../generated/graphql'
import { toErrorMap } from '../../utils/toErrorMap'

interface LoginProps {
  history: any
}

const Login: React.FC<LoginProps> = ({history}) => {
  const formData = {
    username: '',
    password: ''
  }
  
  return (
    <Wrapper variant="small">
      <Formik initialValues={formData} onSubmit={({password, username}) => {
        
      }} >
        {({handleSubmit, isSubmitting}) => (
          <Form onSubmit={handleSubmit}>
            <InputField name="username" label="Username" />
            <InputField name="password" label="Password" type="password" />
            <Button display="block" w="100%" bg="blue.200" _hover={{bg:"blue.300"}} isLoading={isSubmitting}>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Login
