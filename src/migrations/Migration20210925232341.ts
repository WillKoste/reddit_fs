import {Migration} from '@mikro-orm/migrations';

export class Migration20210925232341 extends Migration {
	async up(): Promise<void> {
		this.addSql('drop table if exists "dumb" cascade;');
	}
}
