import 'reflect-metadata';
import 'colors';
import path from 'path';
import fs from 'fs';
import https from 'https';
import {MikroORM} from '@mikro-orm/core';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '../', 'config', 'config.env')});
import mikroConfig from './mikro-orm.config';
import {COOKIE_NAME} from '../config/constants';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import Redis from 'ioredis';
import cors from 'cors';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import users from './routes/users';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';
const RedisStore = ConnectRedis(session);

const main = async () => {
	try {
		const redis = new Redis();
		const orm = await MikroORM.init(mikroConfig);
		await orm.getMigrator().up();
		const app = express();
		app.use(cors({origin: ['*', 'http://localhost:3000'], credentials: true}));
		app.use(
			session({
				name: COOKIE_NAME,
				secret: process.env.SESSION_SECRET || 'JJ_Rowling_Rules]',
				resave: false,
				saveUninitialized: false,
				store: new RedisStore({client: redis, disableTouch: true}),
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
			context: ({req, res}) => ({em: orm.em, req, res, redis}),
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({app, cors: false});

		app.use('/api/v1/users', users);

		const port = process.env.PORT || 5001;
		const mode = process.env.NODE_ENV || 'DEFAULT';

		https
			.createServer(
				{
					key: fs.readFileSync(path.join(__dirname, '../', 'server.key')),
					cert: fs.readFileSync(path.join(__dirname, '../', 'server.cert'))
				},
				app
			)
			.listen(port, () => console.log(`Express server running on port ${port}, in ${mode} mode`.cyan.underline.bold));
	} catch (err) {
		console.error(err);
	}
};

main();
