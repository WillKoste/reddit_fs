import {Post} from './entities/Post';
import {MikroORM} from '@mikro-orm/core';
import path from 'path';

// export default {
// 	migrations: {
// 		path: path.join(__dirname, './migrations'),
// 		pattern: /^[\w-]+\d+\.[tj]s$/
// 	},
// 	type: 'postgresql',
// 	password: process.env.PG_PASSWORD,
// 	dbName: process.env.PG_DATABASE,
// 	host: process.env.PH_HOST,
// 	port: process.env.PG_PORT,
// 	user: process.env.PG_USER,
// 	entities: [Post]
// } as Parameters<typeof MikroORM.init>[0];
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
