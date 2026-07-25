const axios = require('axios');

const token = 'Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTM4MjczMDgxOCIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ4MjYzMTc4LCJpc3MiOiJodHRwOi8vc3NvLXNlcnZpY2UubmV3cGwxLnN2Yzo4MDgwIiwiaWQiOiIxMTI2NDkiLCJleHAiOjE3NzgyNjMxNzgsImlhdCI6MTc0ODI2MzE3OCwianRpIjoiOGYzODZjNDEtYjg0MS00OTJlLTg0NjYtZjMwOWZlZjEzYTI0In0.cdSqeyfWjNhLFKaXQbh_BlqBUztvO0PpDAfXRB1gSm3Kh8WqXNMzNyUehHLP_vzkNfqkVCXwecPUb3MH95oBJGE2ZxTO7DjnTLjeLJoH4XV-iL4J3GKxqeh3mT-CPN2kqzPY0zPGsRHyzuAfHvDUFJ8FnaPnfLsNpYIuFLLPpZq0is572NtyhM5cfmEA7wSiGC6yOGtMPmg5AYNnGxW2VBRTzKarlze7XMN9sFVUvmlTGfGxoaHM7S2UGImpiLIh9rcoEmQhh-G-W7tnbYlz5RKUUzXgk9kkiOIYJemArcsSjr2pdhHJ2zUqxjGkWN9CXpzt08Qdp-ThVbBpfZEKuA';

const formData = [
    {
        "questionType": "TEXT_FIELD",
        "formId": 445,
        "questionGroupId": 505,
        "position": 0,
        "title": "نام شما",
        "questionPropertyList": [
            {"questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "SHORT_TEXT", "id": null},
            {"questionPropertyEnum": "REQUIRED", "value": "true", "id": null},
            {"questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null},
            {"questionPropertyEnum": "DESCRIPTION", "value": null, "id": null},
            {"questionPropertyEnum": "MAXIMUM_LEN", "value": 100, "id": null},
            {"questionPropertyEnum": "MINIMUM_LEN", "value": 2, "id": null}
        ]
    },
    {
        "questionType": "TEXT_FIELD",
        "formId": 445,
        "questionGroupId": 505,
        "position": 1,
        "title": "نام خانوادگی شما",
        "questionPropertyList": [
            {"questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "SHORT_TEXT", "id": null},
            {"questionPropertyEnum": "REQUIRED", "value": "true", "id": null},
            {"questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null},
            {"questionPropertyEnum": "DESCRIPTION", "value": null, "id": null},
            {"questionPropertyEnum": "MAXIMUM_LEN", "value": 100, "id": null},
            {"questionPropertyEnum": "MINIMUM_LEN", "value": 2, "id": null}
        ]
    },
    {
        "questionType": "TEXT_FIELD",
        "formId": 445,
        "questionGroupId": 505,
        "position": 2,
        "title": "شماره تلفن همراه",
        "questionPropertyList": [
            {"questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "PHONE_NUMBER", "id": null},
            {"questionPropertyEnum": "REQUIRED", "value": "false", "id": null},
            {"questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null},
            {"questionPropertyEnum": "DESCRIPTION", "value": null, "id": null},
            {"questionPropertyEnum": "MAXIMUM_LEN", "value": 15, "id": null},
            {"questionPropertyEnum": "MINIMUM_LEN", "value": 10, "id": null}
        ]
    },
    {
        "questionType": "TEXT_FIELD",
        "formId": 445,
        "questionGroupId": 505,
        "position": 3,
        "title": "سن شما",
        "questionPropertyList": [
            {"questionPropertyEnum": "TEXT_FIELD_PATTERN", "value": "NUMBER", "id": null},
            {"questionPropertyEnum": "REQUIRED", "value": "false", "id": null},
            {"questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null},
            {"questionPropertyEnum": "DESCRIPTION", "value": null, "id": null},
            {"questionPropertyEnum": "MAXIMUM_LEN", "value": null, "id": null},
            {"questionPropertyEnum": "MINIMUM_LEN", "value": null, "id": null}
        ]
    },
    {
        "questionType": "INFO_FIELD",
        "formId": 445,
        "questionGroupId": 505,
        "position": 4,
        "title": "راهنما",
        "questionPropertyList": [
            {"questionPropertyEnum": "THE_END", "value": "false", "id": null},
            {"questionPropertyEnum": "MESSAGE", "value": "مزایا انقلاب ایران در دو خط توضیح می‌دهد.", "id": null}
        ]
    },
    {
        "questionType": "MULTIPLE_CHOICE",
        "formId": 445,
        "questionGroupId": 505,
        "position": 5,
        "title": "چقدر دوست دارید ایران را؟",
        "questionPropertyList": [
            {"questionPropertyEnum": "MULTI_SELECT", "value": "false", "id": null},
            {"questionPropertyEnum": "RANDOMIZE_OPTIONS", "value": "false", "id": null},
            {"questionPropertyEnum": "REQUIRED", "value": "false", "id": null},
            {"questionPropertyEnum": "EDIT_ANSWER_LOCKED", "value": "false", "id": null},
            {"questionPropertyEnum": "DESCRIPTION", "value": null, "id": null}
        ],
        "optionList": [
            {"title": "1 - زیاد", "score": 1},
            {"title": "2 - خیلی زیاد", "score": 2},
            {"title": "3 - خیلی خیلی زیاد", "score": 3}
        ]
    }
];

async function sendForm() {
    for (const question of formData) {
        try {
            const response = await axios.post('https://newpl1api.qhami.com/psya/question', question, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Question sent successfully: ${question.title}`);
        } catch (error) {
            console.error(`Error sending question: ${question.title}`, error);
        }
    }
}

sendForm();