/*
  Warnings:

  - You are about to drop the column `yt_url` on the `posts` table. All the data in the column will be lost.
  - Added the required column `video_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "yt_url",
ADD COLUMN     "video_id" TEXT NOT NULL;
