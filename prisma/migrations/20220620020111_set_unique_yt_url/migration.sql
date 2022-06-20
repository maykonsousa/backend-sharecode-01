/*
  Warnings:

  - A unique constraint covering the columns `[yt_url]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "posts_yt_url_key" ON "posts"("yt_url");
