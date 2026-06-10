ALTER TABLE "rating" DROP CONSTRAINT "rating_user_id_unique";--> statement-breakpoint
ALTER TABLE "rating" DROP CONSTRAINT "rating_film_id_unique";--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_film_id_unique" UNIQUE("user_id","film_id");