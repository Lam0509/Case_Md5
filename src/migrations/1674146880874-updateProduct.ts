import { MigrationInterface, QueryRunner } from "typeorm";

export class updateProduct1674146880874 implements MigrationInterface {
    name = 'updateProduct1674146880874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`description\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`description\``);
    }

}
