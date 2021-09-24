import {Post} from './entities/Post';
import {MikroORM} from '@mikro-orm/core';
import path from 'path';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/
	},
	type: 'postgresql',
	password: 'My2dogs95',
	dbName: 'awad_full_stack',
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	entities: [Post]
} as Parameters<typeof MikroORM.init>[0];
