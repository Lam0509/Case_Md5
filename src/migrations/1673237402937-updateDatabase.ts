import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDatabase1673237402937 implements MigrationInterface {
    name = 'updateDatabase1673237402937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    }

}
