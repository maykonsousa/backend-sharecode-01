/*
  Warnings:

  - Changed the type of `is_private` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "is_private",
ADD COLUMN     "is_private" BOOLEAN NOT NULL,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;
