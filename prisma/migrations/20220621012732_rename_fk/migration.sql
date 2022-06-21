-- RenameForeignKey
ALTER TABLE "posts" RENAME CONSTRAINT "posts_user_id_fkey" TO "FK_UserId";

-- RenameForeignKey
ALTER TABLE "tokens" RENAME CONSTRAINT "tokens_user_id_fkey" TO "fk_UserId";
