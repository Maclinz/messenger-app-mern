import moment from "moment";

// 24h format
export const twentyFourHourFormat = (date: string) => {
  return moment(date).format("HH:mm");
};

export const dayMonYear = (date: string) => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatDateBasedOnTime = (createdAt: string) => {
  const now = moment();
  const createdAtMoment = moment(createdAt);

  // check if date if from today
  if (now.isSame(createdAtMoment, "day")) {
    return "Today at: " + twentyFourHourFormat(createdAt);
  }

  // check if date is from yesterday
  if (now.isSame(createdAtMoment, "day")) {
    return "Yesterday at: " + twentyFourHourFormat(createdAt);
  }

  return dayMonYear(createdAt);
};

export const formatDateLastSeen = (createdAt: string) => {
  const now = moment();
  const createdAtMoment = moment(createdAt);

  // check if date if from today
  if (now.isSame(createdAtMoment, "day")) {
    return "last seen today at: " + twentyFourHourFormat(createdAt);
  }

  // check if date is from yesterday
  if (now.isSame(createdAtMoment, "day")) {
    return "last seen yesterday at: " + twentyFourHourFormat(createdAt);
  }

  return "last seen on: " + dayMonYear(createdAt);
};
