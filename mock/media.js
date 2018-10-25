export const media = {
  "1": [{
    "type": 1,
    "file_id": 68,
    "container_id": 1,
    "rules": {
      "playUntilDone": true,
      "duration": 10,
      "timeline": {
        "allDay": true,
        "recurrenceType": "Daily",
        "startDate": 0,
        "startTime": 0,
        "endDate": 0,
        "endTime": 0
      },
      "recurrence": {
        "daily": {
          "recurrenceFrequency": 1
        },
        "weekly": {
          "recurrenceFrequency": 1,
          "monday": false,
          "tuesday": false,
          "wednesday": false,
          "thursday": false,
          "friday": false,
          "saturday": false,
          "sunday": false
        },
        "monthly": {
          "recurrenceAbsolute": true,
          "absolute": {
            "recurrenceDayOfMonth": 1,
            "recurrenceFrequency": 1
          },
          "relative": {
            "recurrenceWeekOfMonth": 0, // week
            "recurrenceDayOfWeek": 0,   // weekday
            "recurrenceFrequency": 1
          }
        },
        "yearly": {
          "recurrenceAbsolute": true,
          "absolute": {
            "recurrenceMonthOfYear": 0, // month
            "recurrenceDayOfMonth": 1
          },
          "relative": {
            "recurrenceWeekOfMonth": 0, // week
            "recurrenceDayOfWeek": 0,   // weekday
            "recurrenceMonthOfYear": 0  // month
          }
        }
      },
      "optionsWeek": [
        { "value": 0, "text": "Первый" },
        { "value": 1, "text": "Второй" },
        { "value": 2, "text": "Третий" },
        { "value": 3, "text": "Четвертый" },
        { "value": 4, "text": "Последний" }
      ],
      "optionsDays": [
        { "value": 0, "text": "Понедельник" },
        { "value": 1, "text": "Вторник" },
        { "value": 2, "text": "Среда" },
        { "value": 3, "text": "Четверг" },
        { "value": 4, "text": "Пятница" },
        { "value": 4, "text": "Суббота" },
        { "value": 4, "text": "Воскресенье" }
      ],
      "optionsMonth": [
        { "value": 0, "text": "Января" },
        { "value": 1, "text": "Февраля" },
        { "value": 2, "text": "Марта" },
        { "value": 3, "text": "Апреля" },
        { "value": 4, "text": "Мая" },
        { "value": 5, "text": "Июня" },
        { "value": 6, "text": "Июля" },
        { "value": 7, "text": "Августа" },
        { "value": 8, "text": "Сентября" },
        { "value": 9, "text": "Октября" },
        { "value": 10, "text": "Ноября" },
        { "value": 11, "text": "Декабря" }
      ]
    }
  }],
  "2": [{
    "type": 2,
    "file_id": 67,
    "container_id": 2,
    "rules": {}
  }],
  "3": [],
  "4": [],
  "5": [],
  "6": [],
  "length": 7
}
