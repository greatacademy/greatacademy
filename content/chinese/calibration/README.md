# Calibration Seed Sets of Chinese Writing

> English | [简体中文](README.zh-CN.md)

Before a model route may judge a criterion of Chinese writing, it must agree with two teachers on at least 100 scored texts ([docs/development.md](../../../docs/development.md), `tools/calibrate`). These files are the seed sets teachers score first. There is one file per judged topic, and each line is a learner's text against one of the topic's tasks.

The texts are written for this package by a model as a learner would write them: a Chinese pupil of the grade for the native courses and the Gaokao, and a foreign learner of the level for the levels and the HSK. None is a real learner's text, and none is copied from a textbook, a test or a published work. Each text was written to meet or miss each of its criteria on purpose. About a third are good, a third middling and a third poor, with hard cases: a fluent text that narrowly misses one criterion, and a clumsy text that still meets one.

Each line carries the fields `tools/calibrate` reads, `id`, `task`, `text` and `scores`, and three more that it ignores:

- `quality`: good, middling or poor.
- `intended`: for each criterion `id@version`, whether the text was written to meet it.
- `ai`: the answers of a second model that judged the texts blind, from the task and the criteria's questions alone.
- `note`: what the text does, and why each missed criterion is missed.

`scores` is empty: each of two teachers adds a yes or no for each criterion, as `{"<id@version>": [first, second]}`. The labels `intended` and `ai` are AI-scored and are not scores: they tell teachers where to look, never stand in for them.

## Size and First Agreement

The 47 files hold 432 texts and 1,008 labels on 126 criteria. The blind model agreed with the intended label on 974 of them (96.6%). The criteria where they disagreed most, with Cohen's kappa over that criterion's labels, are the first to check for an unclear question:

| Criterion | Labels | Agreed | Kappa |
| :--- | ---: | ---: | ---: |
| `zh10-comment-event@1` | 3 | 2 | 0.40 |
| `zh6-argue-evidence@1` | 3 | 2 | 0.40 |
| `zh9-story-thread@1` | 3 | 2 | 0.40 |
| `zhl3-opinion-language@1` | 18 | 14 | 0.48 |
| `zhl2-day-language@1` | 12 | 9 | 0.50 |
| `zhl7-review-work@1` | 5 | 4 | 0.62 |
| `zhl4-explain-language@1` | 18 | 15 | 0.62 |
| `zh10-comment-view@1`, `zh8-explain-feature@1`, `zhl2-day-details@1` | 6 each | 5 each | 0.67 |
| `zhgk-info-points@1` | 12 | 10 | 0.68 |

The criteria of language at the lower levels ("uses 了 often enough", "places the place after the verb") have no stated threshold. Criteria that join two tests in one question are hard to miss by one test alone: `zhl4-trip-order@1`, `zhl5-letter-language@1`, `zhl7-review-work@1` and `zhl8-problem-proposals@1`. `hsk-word-use@1` overlaps `hsk-word-grammar@1`, and `zhgk-fill-content@1` overlaps `zhgk-fill-fit@1`. Such a question may need rewording, as a new version, before a route is calibrated on it.

## What Is Left

- Two teachers score every line: a teacher of Chinese for the native and Gaokao topics, and a teacher of Chinese as a foreign language for the levels and the HSK.
- More texts, ideally real learners' texts collected with consent ([docs/minors-data.md](../../../docs/minors-data.md)), until each criterion has 100. Long topics have six texts here and some criteria under ten labels.
- `hsk-7-9-writing` has two tasks per criterion, so each criterion is met once and missed once.
- The nine criteria of the HSK 7–9 chart, essay and translation have no seed set yet.
