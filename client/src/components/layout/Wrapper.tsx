import {Box} from '@chakra-ui/react';
import React, {Children} from 'react';

interface WrapperProps {
	variant?: 'small' | 'regular' | 'large';
}

const Wrapper: React.FC<WrapperProps> = ({children, variant = 'regular'}) => {
	return (
		<Box maxW={variant === 'regular' ? '800px' : variant === 'large' ? '1150px' : '400px'} w='100%' mx='auto' mt={8}>
			{children}
		</Box>
	);
};

export default Wrapper;
