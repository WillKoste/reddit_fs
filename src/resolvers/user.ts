import {User} from '../entities/User';
import {Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import {MyContext} from 'src/types';
import argon2 from 'argon2';
// import {EntityManager} from '@mikro-orm/postgresql';
const errorObj = {field: 'credentials', message: 'Not Authorized'};

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], {nullable: true})
	errors?: FieldError[];

	@Field(() => User, {nullable: true})
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => User, {nullable: true})
	async me(@Ctx() {req, em}: MyContext) {
		if (!req.session.userId) {
			return null;
		}

		const meUser = await em.findOne(User, {id: req.session.userId});
		return meUser;
	}

	@Query(() => [User])
	users(@Ctx() ctx: MyContext): Promise<User[]> {
		const theUsers = ctx.em.find(User, {});
		return theUsers;
	}

	@Query(() => User, {nullable: true})
	user(@Ctx() ctx: MyContext, @Arg('id', () => Int) id: number) {
		const theUser = ctx.em.findOne(User, {id});
		return theUser;
	}

	@Mutation(() => UserResponse, {nullable: true})
	async register(@Ctx() {em, req}: MyContext, @Arg('username', () => String) username: string, @Arg('password', () => String) password: string): Promise<UserResponse> {
		try {
			if (username.length <= 2) {
				return {
					errors: [{field: 'username', message: 'The username must be 2 characters or greater'}]
				};
			}
			if (password.length < 6) {
				return {
					errors: [{field: 'password', message: 'The password must be 6 characters or greater'}]
				};
			}
			const hash = await argon2.hash(password);
			const newUser = em.create(User, {username, password: hash});
			//// QUERY BUILDER - IN CASE I EVER NEED IT \\\\
			// const [user] = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({username, password: hash, createdAt: new Date(), updatedAt: new Date()}).returning('*');
			await em.persistAndFlush(newUser);
			req.session.userId = newUser.id;
			return {user: newUser};
		} catch (err) {
			console.error(err);
			if (err.code === '23505') {
				return {
					errors: [{field: 'username', message: 'This username is already taken'}]
				};
			}
			return {errors: [{field: 'register', message: `A registration attempt for the username ${username} was unsuccessful`}]};
		}
	}

	@Mutation(() => UserResponse, {nullable: true})
	async login(@Ctx() {em, req}: MyContext, @Arg('username', () => String) username: string, @Arg('password', () => String) password: string): Promise<UserResponse> {
		const user = await em.findOne(User, {username});
		if (!user) {
			return {
				errors: [errorObj]
			};
		}

		const isMatch = await argon2.verify(user.password, password);
		if (!isMatch) {
			return {
				errors: [errorObj]
			};
		}

		req.session.userId = user.id;
		return {user};
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
