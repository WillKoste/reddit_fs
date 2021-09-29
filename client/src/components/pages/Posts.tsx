import {Box} from '@chakra-ui/layout';
import React, {useEffect} from 'react';
import {usePostsQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';

interface PostsProps {}

const Posts: React.FC<PostsProps> = ({}) => {
	const [{data}, getPosts] = usePostsQuery();
	useEffect(() => {
		getPosts();
	}, []);

	return (
		<Wrapper variant='large'>
			{!data ? (
				<p>Loading...</p>
			) : (
				data.posts.map((post) => (
					<Box mb={5} key={post.id}>
						<p>
							<strong>Post ID:</strong> {post.id}
						</p>
						<p>
							<strong>Post Title:</strong> {post.title}
						</p>
						<p>
							<strong>Post Body:</strong> {post.body}
						</p>
					</Box>
				))
			)}
		</Wrapper>
	);
};

export default Posts;
