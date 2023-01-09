import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserEntity1673227545407 implements MigrationInterface {
    name = 'updateUserEntity1673227545407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` MODIFY COLUMN \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` MODIFY COLUMN \`password\` varchar(45) NOT NULL`);
    }

}
