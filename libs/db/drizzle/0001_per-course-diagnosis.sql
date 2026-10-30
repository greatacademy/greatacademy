-- The diagnostic is per course: placed events carry their course, and the state lists the diagnosed courses.
UPDATE "event" SET "data" = jsonb_set("data", '{course}', to_jsonb("course_id"))
WHERE "type" = 'placed' AND "course_id" IS NOT NULL AND NOT ("data" ? 'course');
--> statement-breakpoint
UPDATE "learner_state" AS s SET "state" = jsonb_set(s."state", '{diagnosed}', COALESCE((
  SELECT jsonb_agg(DISTINCT e."course_id") FROM "event" AS e
  WHERE e."learner_id" = s."learner_id" AND e."subject_id" = s."subject_id" AND e."type" = 'placed' AND e."course_id" IS NOT NULL
), '[]'::jsonb))
WHERE jsonb_typeof(s."state" -> 'diagnosed') = 'boolean';
