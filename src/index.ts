import 'reflect-metadata';
import 'colors';
import path from 'path';
import {MikroORM} from '@mikro-orm/core';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '../', 'config', 'config.env')});
import mikroConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import redis from 'redis';
import cors from 'cors';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import users from './routes/users';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';
import {MyContext} from './types';
const RedisStore = ConnectRedis(session);

const main = async () => {
	try {
		const redisClient = redis.createClient();
		const orm = await MikroORM.init(mikroConfig);
		await orm.getMigrator().up();
		const app = express();
		app.use(cors({origin: ['*', 'http://localhost:3000'], credentials: true}));

		app.use(
			session({
				name: 'wid',
				secret: process.env.SESSION_SECRET || 'JJ_Rowling_Rules]',
				resave: false,
				saveUninitialized: false,
				store: new RedisStore({client: redisClient, disableTouch: true}),
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 365,
					// httpOnly: true,
					// secure: process.env.NODE_ENV === 'production',
					secure: true,
					sameSite: 'none'
				}
			})
		);

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, PostResolver, UserResolver],
				validate: false
			}),
			context: ({req, res}): MyContext => ({em: orm.em, req, res}),
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({app, cors: false});

		app.use('/api/v1/users', users);

		const port = process.env.PORT || 5001;
		const mode = process.env.NODE_ENV || 'DEFAULT';

		app.listen(port, () => console.log(`Express server running on port ${port}, in ${mode} mode`.cyan.underline.bold));
	} catch (err) {
		console.error(err);
	}
};

main();
