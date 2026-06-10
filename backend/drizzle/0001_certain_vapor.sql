ALTER TABLE "rating" DROP CONSTRAINT "rating_film_id_films_id_fk";
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_film_id_films_tmdb_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."films"("tmdb_id") ON DELETE no action ON UPDATE no action;