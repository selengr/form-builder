#!/bin/bash
# Auto-generated form submission script
# Generated at 2025-07-08T11:50:57

TOKEN="Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTM4MjczMDgxOCIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ4MjYzMTc4LCJpc3MiOiJodHRwOi8vc3NvLXNlcnZpY2UubmV3cGwxLnN2Yzo4MDgwIiwiaWQiOiIxMTI2NDkiLCJleHAiOjE3NzgyNjMxNzgsImlhdCI6MTc0ODI2MzE3OCwianRpIjoiOGYzODZjNDEtYjg0MS00OTJlLTg0NjYtZjMwOWZlZjEzYTI0In0.cdSqeyfWjNhLFKaXQbh_BlqBUztvO0PpDAfXRB1gSm3Kh8WqXNMzNyUehHLP_vzkNfqkVCXwecPUb3MH95oBJGE2ZxTO7DjnTLjeLJoH4XV-iL4J3GKxqeh3mT-CPN2kqzPY0zPGsRHyzuAfHvDUFJ8FnaPnfLsNpYIuFLLPpZq0is572NtyhM5cfmEA7wSiGC6yOGtMPmg5AYNnGxW2VBRTzKarlze7XMN9sFVUvmlTGfGxoaHM7S2UGImpiLIh9rcoEmQhh-G-W7tnbYlz5RKUUzXgk9kkiOIYJemArcsSjr2pdhHJ2zUqxjGkWN9CXpzt08Qdp-ThVbBpfZEKuA"

ENDPOINT="https://newpl1api.qhami.com/psya/question"

# 1. نام و نام خانوادگی (اجباری)
curl -X POST "$ENDPOINT" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d $'{
    "formId": 445,
    "questionGroupId": 505,
    "position": 0,
    "title": "نام و نام خانوادگی",
    "questionType": "TEXT_FIELD",
    "questionPropertyList": [
      { "questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "SHORT_TEXT", "id": null },
      { "questionPropertyEnum": "REQUIRED", "value": "true", "id": null },
      { "questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null },
      { "questionPropertyEnum": "DESCRIPTION", "value": null, "id": null },
      { "questionPropertyEnum": "MAXIMUM_LEN", "value": 250, "id": null },
      { "questionPropertyEnum": "MINIMUM_LEN", "value": 0, "id": null }
    ]
}'

# 2. شماره تلفن همراه (اختیاری)
curl -X POST "$ENDPOINT" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d $'{
    "formId": 445,
    "questionGroupId": 505,
    "position": 1,
    "title": "شماره تلفن همراه",
    "questionType": "TEXT_FIELD",
    "questionPropertyList": [
      { "questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "SHORT_TEXT", "id": null },
      { "questionPropertyEnum": "REQUIRED", "value": "false", "id": null },
      { "questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null },
      { "questionPropertyEnum": "DESCRIPTION", "value": null, "id": null },
      { "questionPropertyEnum": "MAXIMUM_LEN", "value": 250, "id": null },
      { "questionPropertyEnum": "MINIMUM_LEN", "value": 0, "id": null }
    ]
}'

# 3. سن (عدد اختیاری)
curl -X POST "$ENDPOINT" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d $'{
    "formId": 445,
    "questionGroupId": 505,
    "position": 2,
    "title": "سن",
    "questionType": "TEXT_FIELD",
    "questionPropertyList": [
      { "questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "NUMBER", "id": null },
      { "questionPropertyEnum": "REQUIRED", "value": "false", "id": null },
      { "questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null },
      { "questionPropertyEnum": "DESCRIPTION", "value": null, "id": null },
      { "questionPropertyEnum": "MAXIMUM_LEN", "value": null, "id": null },
      { "questionPropertyEnum": "MINIMUM_LEN", "value": null, "id": null }
    ]
}'

# 4. راهنمای مزایای انقلاب
curl -X POST "$ENDPOINT" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d $'{
    "formId": 445,
    "questionGroupId": 505,
    "position": 3,
    "title": "راهنمای مزایای انقلاب اسلامی",
    "questionType": "INFO_FIELD",
    "questionPropertyList": [
      { "questionPropertyEnum": "THE_END", "value": "false", "id": null },
      { "questionPropertyEnum": "MESSAGE", "value": "انقلاب ایران باعث استقلال، آزادی و پیشرفت علمی شد.\nاین انقلاب ساختار حکومتی کشور را متحول کرد.", "id": null }
    ]
}'

# 5. سوال چند گزینه‌ای تک انتخابی
curl -X POST "$ENDPOINT" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d $'{
    "formId": 445,
    "questionGroupId": 505,
    "position": 4,
    "title": "ایران را چقدر دوست دارید؟",
    "questionType": "MULTIPLE_CHOICE",
    "questionPropertyList": [
      { "questionPropertyEnum": "MULTI_SELECT", "value": "false", "id": null },
      { "questionPropertyEnum": "RANDOMIZE_OPTIONS", "value": "false", "id": null },
      { "questionPropertyEnum": "REQUIRED", "value": "false", "id": null },
      { "questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null },
      { "questionPropertyEnum": "DESCRIPTION", "value": null, "id": null }
    ],
    "optionList": [
      { "title": "زیاد", "score": 1 },
      { "title": "خیلی زیاد", "score": 2 },
      { "title": "خیلی خیلی زیاد", "score": 3 }
    ]
}'