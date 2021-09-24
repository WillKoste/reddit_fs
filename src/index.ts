import path from 'path';
import {MikroORM} from '@mikro-orm/core';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '../', 'config', 'config.env')});
import {Post} from './entities/Post';
import mikroConfig from './mikro-orm.config';

const main = async () => {
	try {
		const orm = await MikroORM.init(mikroConfig);
		await orm.getMigrator().up();

		// const saveMe = orm.em.create(Post, {title: 'Billy Bob'});
		// await orm.em.persistAndFlush(saveMe);

		const posts = await orm.em.find(Post, {});
		console.log(posts);
	} catch (err) {
		console.error(err);
	}
};

main();
