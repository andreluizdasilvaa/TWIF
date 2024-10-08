/*
  Warnings:

  - You are about to drop the column `user` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usernick]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernick` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_user_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `user`,
    ADD COLUMN `usernick` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_usernick_key` ON `User`(`usernick`);
