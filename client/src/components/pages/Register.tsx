import React from 'react'
import {Formik, Form} from 'formik'
import {Button} from '@chakra-ui/react'
import Wrapper from '../layout/Wrapper'
import InputField from '../layout/InputField'
import { useMutation } from 'urql'

interface RegisterProps {
  
}

const Register: React.FC<RegisterProps> = () => {
  const formData = {
    username: '',
    password: '',
  }

  const [{}, register] = useMutation(`
    mutation Register($username: String!, $password: String!) {
      register(username: $username, password: $password){
        user {
          id
          username
        }
        errors {
          field
          message
        }
      }
    }
  `)

  const {username, password} = formData
  
  
  return (
    <Wrapper variant="small">
      <Formik initialValues={formData} onSubmit={(values, actions) => {
        register(values)
        actions.setSubmitting(false)
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
