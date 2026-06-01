CREATE TABLE "users" (
	"userid" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"hash_password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "films" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer,
	"title" text NOT NULL,
	"genre" text[],
	"release_year" smallint,
	"poster_url" text,
	"description" text,
	CONSTRAINT "films_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"guest_id" text,
	"film_tmdb_id" integer,
	"genre_searched" text[],
	"recommended_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"film_id" integer NOT NULL,
	"score" smallint NOT NULL,
	"rated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_user_id_users_userid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_film_tmdb_id_films_tmdb_id_fk" FOREIGN KEY ("film_tmdb_id") REFERENCES "public"."films"("tmdb_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_users_userid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_film_id_films_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."films"("id") ON DELETE no action ON UPDATE no action;