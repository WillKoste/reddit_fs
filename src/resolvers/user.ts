import {User} from '../entities/User';
import {Arg, Ctx, Int, Mutation, Query, Resolver} from 'type-graphql';
import {MyContext} from 'src/types';
import bcrypt from 'bcryptjs';

@Resolver()
export class UserResolver {
	@Query(() => [User])
	users(@Ctx() ctx: MyContext): Promise<User[]> {
		const theUsers = ctx.em.find(User, {});
		return theUsers;
	}

	@Query(() => User, {nullable: true})
	user(@Ctx() ctx: MyContext, @Arg('id', () => Int) id: number) {
		const theUser = ctx.em.findOne(User, {id});
		console.log('hey');
		return theUser;
	}

	@Mutation(() => User, {nullable: true})
	async createUser(@Ctx() ctx: MyContext, @Arg('username', () => String) username: string, @Arg('password', () => String) password: string): Promise<User | null> {
		const hash = await bcrypt.hash(password, 10);
		const newUser = ctx.em.create(User, {username, password: hash});
		await ctx.em.persistAndFlush(newUser);
		return newUser;
	}

	@Mutation(() => User, {nullable: true})
	async updateUser(@Ctx() ctx: MyContext, @Arg('id', () => Int) id: number, @Arg('username', () => String) username: string): Promise<User | null> {
		const theUser = await ctx.em.findOne(User, {id});
		if (!theUser) {
			return null;
		}
		if (typeof theUser.username !== 'undefined') {
			theUser.username = username;
			await ctx.em.persistAndFlush(theUser);
		}
		return theUser;
	}

	@Mutation(() => Boolean, {nullable: true})
	async deleteUser(@Ctx() ctx: MyContext, @Arg('id', () => Int) id: number): Promise<Boolean> {
		const theUser = await ctx.em.findOne(User, {id});
		if (!theUser) {
			return false;
		}
		await ctx.em.remove(theUser).flush();
		return true;
	}
}
