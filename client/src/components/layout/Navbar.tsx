import React, {Fragment} from 'react';
import {Box, UnorderedList, ListItem, Heading, Button} from '@chakra-ui/react';
import {NavLink} from 'react-router-dom';
import {useMeQuery} from '../../generated/graphql';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const [{data, fetching}] = useMeQuery();

	return (
		<Box bg='tomato' p={4} display='flex' alignItems='center' justifyContent='flex-end'>
			{fetching ? null : !data?.me ? (
				<UnorderedList display='flex'>
					<ListItem listStyleType='none' mx={1}>
						<NavLink style={{padding: '.5rem .75rem'}} activeStyle={{color: 'white', background: 'purple', borderRadius: '8px'}} to='/login'>
							Login
						</NavLink>
					</ListItem>
					<ListItem listStyleType='none' mx={1}>
						<NavLink style={{padding: '.5rem .75rem'}} activeStyle={{color: 'white', background: 'purple', borderRadius: '8px'}} to='/register'>
							Register
						</NavLink>
					</ListItem>
				</UnorderedList>
			) : (
				<Fragment>
					<UnorderedList display='flex' mx={3}>
						<Box>
							<Heading size='lg'>{data.me.username}</Heading>
						</Box>
					</UnorderedList>
					<Button variant='link' mr={4}>
						Logout
					</Button>
				</Fragment>
			)}
		</Box>
	);
};

export default Navbar;
