/* eslint-disable no-param-reassign */
/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */

/** 数字前位补零 */
const formatNumber = (n) => (
  n = n.toString(),
  n[1] ? n : 0 + n
);

const now = new Date();
const nowYear = now.getFullYear();
const nowMonth = formatNumber(now.getMonth() + 1);
const nowDay = formatNumber(now.getDate());
const nowHour = formatNumber(now.getHours());
const nowMinute = formatNumber(now.getMinutes());
const nowSecond = formatNumber(now.getSeconds());
const nowDatetime = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMinute}:${nowSecond}`;

Page({
  data: {
    start: '2010-01-01 00:00:00',
    end: '2030-12-31 23:59:59',
    now: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
    value: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
    customize: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
    year: nowDatetime.slice(0, nowDatetime.indexOf('-')),
    month: nowDatetime.slice(0, nowDatetime.lastIndexOf('-')),
    day: nowDatetime.slice(0, nowDatetime.indexOf(' ')),
    hour: nowDatetime.slice(0, nowDatetime.indexOf(':')),
    minute: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
    second: nowDatetime,
  },
  setValue(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value,
    });
  },
});
