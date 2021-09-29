import {Heading} from '@chakra-ui/layout';
import {Button} from '@chakra-ui/react';
import React from 'react';
import {Link} from 'react-router-dom';

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh'}}>
			<Heading size='lg'>404</Heading>
			<Heading size='md'>Page not found D:</Heading>
			<Button mt={6} bg='purple' color='#fff'>
				<Link to='/'>Go Home</Link>
			</Button>
		</div>
	);
};

export default NotFound;
