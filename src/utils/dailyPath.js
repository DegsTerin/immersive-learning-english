export const dailyPathDefinitions = [
  {
    id: 'review',
    page: 'flashcards',
    activityTypes: ['flashcard'],
    xpTarget: 10,
    minutes: 4,
    labelKey: 'daily.review',
    detailKey: 'daily.reviewDetail',
  },
  {
    id: 'pronunciation',
    page: 'pronunciation',
    activityTypes: ['pronunciation'],
    xpTarget: 12,
    minutes: 5,
    labelKey: 'daily.pronunciation',
    detailKey: 'daily.pronunciationDetail',
  },
  {
    id: 'scene',
    page: 'immersion',
    activityTypes: ['immersion', 'correction'],
    xpTarget: 18,
    minutes: 7,
    labelKey: 'daily.scene',
    detailKey: 'daily.sceneDetail',
  },
  {
    id: 'game',
    page: 'games',
    activityTypes: ['game'],
    xpTarget: 14,
    minutes: 3,
    labelKey: 'daily.game',
    detailKey: 'daily.gameDetail',
  },
];

export const getDailyPathSteps = (progress, dateKey) => {
  const activities = progress.activities.filter((activity) => activity.date === dateKey);
  let foundCurrent = false;

  return dailyPathDefinitions.map((definition) => {
    const completedActivity = activities.find((activity) => definition.activityTypes.includes(activity.type));
    const completed = Boolean(completedActivity);
    const current = !completed && !foundCurrent;
    if (current) foundCurrent = true;

    return {
      ...definition,
      completed,
      current,
      xp: completedActivity?.xp || 0,
      score: completedActivity?.score || null,
    };
  });
};

export const getNextDailyPathStep = (steps) => steps.find((step) => !step.completed) || steps[0];
