-- The state counts the reviews taken since the last lesson.
UPDATE "learner_state" AS s SET "state" = jsonb_set(s."state", '{reviewsSinceLesson}', to_jsonb((
  SELECT count(*) FROM "event" AS e
  WHERE e."learner_id" = s."learner_id" AND e."subject_id" = s."subject_id" AND e."type" = 'review' AND e."seq" <= s."seq"
    AND e."seq" > COALESCE((
      SELECT max(l."seq") FROM "event" AS l
      WHERE l."learner_id" = s."learner_id" AND l."subject_id" = s."subject_id" AND l."type" = 'lesson' AND l."seq" <= s."seq"
    ), 0)
)))
WHERE NOT (s."state" ? 'reviewsSinceLesson');
