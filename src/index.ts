import 'reflect-metadata';
import path from 'path';
import {MikroORM} from '@mikro-orm/core';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '../', 'config', 'config.env')});
import mikroConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import 'colors';
import users from './routes/users';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';

const main = async () => {
	try {
		const orm = await MikroORM.init(mikroConfig);
		await orm.getMigrator().up();
		const app = express();

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, PostResolver, UserResolver],
				validate: false
			}),
			context: () => ({em: orm.em})
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({app});

		app.use('/api/v1/users', users);

		const port = process.env.PORT || 5001;
		const mode = process.env.NODE_ENV || 'DEFAULT';

		app.listen(port, () => console.log(`Express server running on port ${port}, in ${mode} mode`.cyan.underline.bold));
	} catch (err) {
		console.error(err);
	}
};

main();
