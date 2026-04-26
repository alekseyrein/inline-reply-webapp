// Google Forms feedback config for Raznos v3.
// Пока выключено. Чтобы включить сбор в Google Forms:
// 1) Создай Google Form с полями: Ник, Тип, Сообщение, Уровень, Очки, Дата, User Agent.
// 2) Открой форму с предзаполненными ответами и возьми entry.xxxxxx для каждого поля.
// 3) Поставь enabled: true и замени formResponseUrl / entry IDs ниже.
window.RZ_FEEDBACK_GOOGLE_FORM = {
  enabled: false,
  formResponseUrl: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
  fields: {
    name: 'entry.NAME_ID',
    type: 'entry.TYPE_ID',
    text: 'entry.TEXT_ID',
    level: 'entry.LEVEL_ID',
    score: 'entry.SCORE_ID',
    date: 'entry.DATE_ID',
    userAgent: 'entry.USER_AGENT_ID'
  }
};