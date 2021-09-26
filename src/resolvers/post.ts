import {MyContext} from 'src/types';
import {Arg, Ctx, Query, Resolver, Int, Mutation} from 'type-graphql';
import {Post} from '../entities/Post';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() ctx: MyContext): Promise<Post[]> {
		return ctx.em.find(Post, {});
	}

	@Query(() => Post, {nullable: true})
	post(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
		return ctx.em.findOne(Post, {id});
	}

	@Mutation(() => Post)
	async createPost(@Arg('title', () => String) title: string, @Arg('body', () => String) body: string, @Ctx() ctx: MyContext): Promise<Post | null> {
		const newPost = ctx.em.create(Post, {title, body});
		await ctx.em.persistAndFlush(newPost);
		return newPost;
	}

	@Mutation(() => Post, {nullable: true})
	async updatePost(@Arg('id', () => Int) id: number, @Arg('title', () => String, {nullable: true}) title: string, @Arg('body', () => String) body: string, @Ctx() ctx: MyContext): Promise<Post | null> {
		const post = await ctx.em.findOne(Post, {id});
		if (!post) {
			return null;
		}

		if (typeof post !== 'undefined') {
			post.title = title;
			post.body = body;
			await ctx.em.persistAndFlush(post);
		}
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
		try {
			const post = await ctx.em.findOne(Post, {id});
			if (!post) {
				return false;
			}
			await ctx.em.remove(post).flush();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
}
