import React, {useState} from 'react';
import Wrapper from '../layout/Wrapper';
import {RouteComponentProps} from 'react-router-dom';
import {Heading} from '@chakra-ui/layout';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import {Button} from '@chakra-ui/react';

interface ResetPasswordProps extends RouteComponentProps<{resetId: string}> {}

const ResetPassword: React.FC<ResetPasswordProps> = ({match}) => {
	const [resetData, setResetData] = useState(match.params.resetId);

	console.log({resetData});

	const formData = {
		newPassword: '',
		confirmPassword: ''
	};

	return (
		<Wrapper>
			<Heading as='h1' size='3xl' mb={8}>
				Change Password
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setErrors, setSubmitting}) => {
					console.log('hey');
				}}
			>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='newPassword' label='New Password' type='password' />
						<InputField name='confirmPassword' label='ConfirmPassword Password' type='password' />
						<Button type='submit' display='block' size='md' w='100%' bg='blue.200' _hover={{bg: 'blue.300'}} isLoading={isSubmitting}>
							Change Password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default ResetPassword;
