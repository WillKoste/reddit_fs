import React from 'react';
import {Formik, Form} from 'formik';
import {Button, Heading} from '@chakra-ui/react';
import Wrapper from '../layout/Wrapper';
import InputField from '../layout/InputField';
import {useLoginMutation} from '../../generated/graphql';
import {toErrorMap} from '../../utils/toErrorMap';
import {History} from 'history';

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({history}) => {
	const formData = {
		username: '',
		password: ''
	};

	const [{}, login] = useLoginMutation();

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='3xl' mb={8}>
				Login
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setErrors, setSubmitting}) => {
					const response = await login(values);
					if (response.data?.login?.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login?.user) {
						history.push('/');
					}
					setSubmitting(false);
				}}
			>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='username' label='Username' />
						<InputField name='password' label='Password' type='password' />
						<Button type='submit' display='block' w='100%' bg='blue.200' _hover={{bg: 'blue.300'}} isLoading={isSubmitting}>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;
