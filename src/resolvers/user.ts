import {User} from '../entities/User';
import {Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import {MyContext} from 'src/types';
import argon2 from 'argon2';
import {validateRegister} from '../utils/validateRegister';
import {sendEmail} from '../utils/sendEmail';
const errorObj = {field: 'username', message: 'Not Authorized'};
import {v4 as uuidv4} from 'uuid';
import {COOKIE_NAME, FORGET_PASSWORD_PREFIX} from '../../config/constants';

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
export class UserResponse {
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
	async register(@Ctx() {em, req}: MyContext, @Arg('username', () => String) username: string, @Arg('password', () => String) password: string, @Arg('email', () => String) email: string): Promise<UserResponse> {
		try {
			const response = validateRegister(username, password, email);
			if (response) {
				return response;
			}

			const hash = await argon2.hash(password);
			const newUser = em.create(User, {username, password: hash, email});
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
	async login(@Ctx() {em, req}: MyContext, @Arg('usernameOrEmail', () => String) usernameOrEmail: string, @Arg('password', () => String) password: string): Promise<UserResponse> {
		const user = await em.findOne(User, usernameOrEmail.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ? {email: usernameOrEmail} : {username: usernameOrEmail});
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

	@Mutation(() => Boolean)
	logout(@Ctx() {req, res}: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				if (err) {
					console.error(err);
					resolve(false);
					return;
				}
				res.clearCookie(COOKIE_NAME);
				resolve(true);
			})
		);
	}

	@Mutation(() => Boolean)
	async forgotPassword(@Ctx() {em, redis}: MyContext, @Arg('email', () => String) email: string): Promise<Boolean> {
		const theUser = await em.findOne(User, {email});
		if (!theUser) {
			return true;
		}

		const token: string = uuidv4();
		await redis.set(FORGET_PASSWORD_PREFIX + token, theUser.id, 'ex', 1000 * 60 * 60 * 3);

		sendEmail(
			email,
			`
			<div>
				<h1>Request to reset email</h1>
				<p><a href="http://localhos:3000/change-password/${token}">Click here</a> to reset your password. you will be securely redirected to our site.</p>
				<p>If you did not make this request, you do not need to do anything.</p>
			</div>
		`
		);
		return true;
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
