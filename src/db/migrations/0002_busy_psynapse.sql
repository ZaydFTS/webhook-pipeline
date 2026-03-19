ALTER TABLE "pipelines" ALTER COLUMN "action_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."action_type";--> statement-breakpoint
CREATE TYPE "public"."action_type" AS ENUM('filter_data', 'transform_format', 'http_enrich');--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "action_type" SET DATA TYPE "public"."action_type" USING "action_type"::"public"."action_type";