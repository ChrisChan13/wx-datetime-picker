/* eslint-disable no-unused-expressions */
/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-sequences */

/** 数字前位补零 */
const formatNumber = (n) => (
  n = n.toString(),
  n[1] ? n : 0 + n
);
/** 检查时间日期格式 */
const checkValidDatetime = (datetime) => {
  if (datetime === '' || datetime === undefined || datetime === null) return;
  if (`${new Date(datetime)}` === 'Invalid Date') {
    throw new Error(`非法时间日期 ${datetime}`);
  }
};

/** 时间粒度 */
const FIELDS = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
};
/** 时间单位 */
const UNITS = {
  [`${FIELDS.YEAR}`]: '年',
  [`${FIELDS.MONTH}`]: '月',
  [`${FIELDS.DAY}`]: '日',
  [`${FIELDS.HOUR}`]: '时',
  [`${FIELDS.MINUTE}`]: '分',
  [`${FIELDS.SECOND}`]: '秒',
};
/** 选择器样式 */
const MODES = {
  PICKER: 'picker',
  PICKER_VIEW: 'picker-view',
};
/** 部分默认值 */
const DEFAULTS = {
  START: '1900-01-01 00:00:00',
  END: '2099-12-31 23:59:59',
};

Component({
  externalClasses: [
    'box-class',
    'indicator-class',
    'mask-class',
    'column-class',
    'unit-class',
  ],
  properties: {
    /** 选择器样式
     *
     * 可选值：
     * - 'picker'： 弹出式
     * - 'picker-view'： 嵌入式
     */
    mode: {
      type: String,
      value: MODES.PICKER,
    },
    /** 选择器开始时间 */
    start: {
      type: String,
      value: DEFAULTS.START,
      observer(newValue, oldValue) {
        // 赋默认值
        !newValue && (newValue = DEFAULTS.START);
        if (newValue === oldValue) return;
        this.data.startDateTime = this.getDateTime(newValue);
        this.generateRange();
      },
    },
    /** 选择器结束时间 */
    end: {
      type: String,
      value: DEFAULTS.END,
      observer(newValue, oldValue) {
        // 赋默认值
        !newValue && (newValue = DEFAULTS.END);
        if (newValue === oldValue) return;
        this.data.endDateTime = this.getDateTime(newValue);
        this.generateRange();
      },
    },
    /**
     * 选择器的粒度
     *
     * 可选值：
     * - 'year'： 选择器粒度为年
     * - 'month'： 选择器粒度为月
     * - 'day'： 选择器粒度为日
     * - 'hour'： 选择器粒度为小时
     * - 'minute'： 选择器粒度为分钟
     * - 'second'： 选择器粒度为秒
     */
    fields: {
      type: String,
      value: FIELDS.MINUTE,
      observer(newValue, oldValue) {
        if (!FIELDS[newValue.toUpperCase()]) {
          throw new Error(`不支持粒度 ${newValue}`);
        }
        if (newValue === oldValue) return;
        this.generateRange();
      },
    },
    /** 表示选中的时间日期 */
    value: {
      type: String,
      value: DEFAULTS.START,
      observer(newValue, oldValue) {
        if (newValue === oldValue) return;
        const values = this.getDateTime(newValue);
        if (this.compareValues(this.data.columnsValue, values) === 0) return;
        this.setColumnsValue();
        this.generateRange();
      },
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    /** 选择器的时间日期范围 */
    range: [],
    /** 选择器开始时间 */
    startDateTime: [1900, 1, 1, 0, 0, 0],
    /** 选择器结束时间 */
    endDateTime: [2099, 12, 31, 23, 59, 59],
    /** 选择器选中的时间日期 */
    pickerValue: [],
    /** 选择器选中的时间日期 */
    columnsValue: [],
  },
  attached() {
    if (this.data.value !== DEFAULTS.START) return;
    this.setColumnsValue();
    this.generateRange();
  },
  methods: {
    setColumnsValue() {
      wx.nextTick(() => {
        this.data.columnsValue = this.getDateTime(this.data.value || DEFAULTS.START);
      });
    },
    /**
     * 对比两个时间日期（数组）
     * @param {Array} values 对比时间日期
     * @param {Array} comparedValues 被对比时间日期
     * @returns {-1|0|1} 比较结果，-1 小于、0 等于、1 大于
     */
    compareValues(values, comparedValues) {
      for (let i = 0; i < values.length; i++) {
        if (values[i] > comparedValues[i]) return 1;
        if (values[i] < comparedValues[i]) return -1;
      }
      if (values.length === comparedValues.length) return 0;
      return values.length > comparedValues.length ? 1 : -1;
    },
    /** 动态生成可选择时间日期范围 */
    generateRange(async = true) {
      const generator = () => {
        if (this.generating) return;
        this.generating = true;
        const {
          columnsValue,
          startDateTime, endDateTime,
        } = this.data;
        let currentValues = columnsValue;
        if (currentValues.length === 0) {
          currentValues = startDateTime;
        } else if (this.compareValues(columnsValue, startDateTime) === -1) {
          currentValues = startDateTime;
        } else if (this.compareValues(columnsValue, endDateTime) === 1) {
          currentValues = endDateTime;
        }
        const [
          valueYear, valueMonth, valueDay,
          valueHour, valueMinute, valueSecond,
        ] = currentValues;
        const range = [];
        const indexes = [];
        const values = [];
        const { fields } = this.data;
        /** 依据设置粒度生成对应范围 */
        switch (fields) {
          case FIELDS.SECOND:
            const seconds = this.getSeconds(
              valueYear, valueMonth, valueDay, valueHour, valueMinute,
            );
            let secondIndex = seconds.indexOf(valueSecond);
            secondIndex = secondIndex > -1 ? secondIndex : 0;
            indexes.unshift(secondIndex);
            values.unshift(seconds[secondIndex]);
            range.unshift(seconds.map((item) => `${item}${UNITS[FIELDS.SECOND]}`));
          case FIELDS.MINUTE:
            const minutes = this.getMinutes(valueYear, valueMonth, valueDay, valueHour);
            let minuteIndex = minutes.indexOf(valueMinute);
            minuteIndex = minuteIndex > -1 ? minuteIndex : 0;
            indexes.unshift(minuteIndex);
            values.unshift(minutes[minuteIndex]);
            range.unshift(minutes.map((item) => `${item}${UNITS[FIELDS.MINUTE]}`));
          case FIELDS.HOUR:
            const hours = this.getHours(valueYear, valueMonth, valueDay);
            let hourIndex = hours.indexOf(valueHour);
            hourIndex = hourIndex > -1 ? hourIndex : 0;
            indexes.unshift(hourIndex);
            values.unshift(hours[hourIndex]);
            range.unshift(hours.map((item) => `${item}${UNITS[FIELDS.HOUR]}`));
          case FIELDS.DAY:
            const days = this.getDays(valueYear, valueMonth);
            let dayIndex = days.indexOf(valueDay);
            dayIndex = dayIndex > -1 ? dayIndex : 0;
            indexes.unshift(dayIndex);
            values.unshift(days[dayIndex]);
            range.unshift(days.map((item) => `${item}${UNITS[FIELDS.DAY]}`));
          case FIELDS.MONTH:
            const months = this.getMonths(valueYear);
            let monthIndex = months.indexOf(valueMonth);
            monthIndex = monthIndex > -1 ? monthIndex : 0;
            indexes.unshift(monthIndex);
            values.unshift(months[monthIndex]);
            range.unshift(months.map((item) => `${item}${UNITS[FIELDS.MONTH]}`));
          case FIELDS.YEAR:
            const years = this.getYears();
            let yearIndex = years.indexOf(valueYear);
            yearIndex = yearIndex > -1 ? yearIndex : 0;
            indexes.unshift(yearIndex);
            values.unshift(years[yearIndex]);
            range.unshift(years.map((item) => `${item}${UNITS[FIELDS.YEAR]}`));
          default:
        }
        this.data.columnsValue = values;
        this.setData({
          range,
          pickerValue: indexes,
        });
        this.generating = false;
      };
      return async ? wx.nextTick(generator) : generator();
    },
    getYears() {
      const [startYear] = this.data.startDateTime;
      const [endYear] = this.data.endDateTime;
      const years = this.getLoops(startYear, endYear);
      return years;
    },
    getMonths(year) {
      const [
        startYear, startMonth,
      ] = this.data.startDateTime;
      const [
        endYear, endMonth,
      ] = this.data.endDateTime;
      let months = [];
      if (
        year > startYear
          && year < endYear
      ) { // 12月份数在完整范围内
        months = this.getLoops(1, 12);
      } else if (startYear === endYear) { // 起始范围等于终止范围
        months = this.getLoops(startMonth, endMonth);
      } else if (year === startYear) { // 当前等于起始范围
        months = this.getLoops(startMonth, 12);
      } else if (year === endYear) { // 当前等于终止范围
        months = this.getLoops(1, endMonth);
      }
      return months;
    },
    getDays(year, month) {
      const [
        startYear, startMonth, startDay,
      ] = this.data.startDateTime;
      const [
        endYear, endMonth, endDay,
      ] = this.data.endDateTime;
      let days = [];
      if (
        startYear === endYear
          && startMonth === endMonth
      ) { // 起始范围等于终止范围
        days = this.getLoops(startDay, endDay);
      } else if (
        year === endYear
          && month === endMonth
      ) { // 当前等于终止范围
        days = this.getLoops(1, endDay);
      } else {
        // 判断年份是否为闰年
        const flag = year % 400 === 0
          || (
            year % 4 === 0
              && year % 100 !== 0
          );
        // 当前等于起始范围
        const start = (
          year === startYear
            && month === startMonth
        ) ? startDay : 1;
        switch (+month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            days = this.getLoops(start, 31);
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            days = this.getLoops(start, 30);
            break;
          case 2:
            days = this.getLoops(start, flag ? 29 : 28);
            break;
          default:
        }
      }
      return days;
    },
    getHours(year, month, day) {
      const [
        startYear, startMonth, startDay,
        startHour,
      ] = this.data.startDateTime;
      const [
        endYear, endMonth, endDay,
        endHour,
      ] = this.data.endDateTime;
      let hours = [];
      if (
        startYear === endYear
          && startMonth === endMonth
          && startDay === endDay
      ) { // 起始范围等于终止范围
        hours = this.getLoops(startHour, endHour);
      } else if (
        year === endYear
          && month === endMonth
          && day === endDay
      ) { // 当前等于终止范围
        hours = this.getLoops(0, endHour);
      } else if (
        startYear === year
          && startMonth === month
          && startDay === day
      ) { // 当前等于起始范围
        hours = this.getLoops(startHour, 23);
      } else {
        hours = this.getLoops(0, 23);
      }
      return hours;
    },
    getMinutes(year, month, day, hour) {
      const [
        startYear, startMonth, startDay,
        startHour, startMinute,
      ] = this.data.startDateTime;
      const [
        endYear, endMonth, endDay,
        endHour, endMinute,
      ] = this.data.endDateTime;
      let minutes = [];
      if (
        startYear === endYear
          && startMonth === endMonth
          && startDay === endDay
          && startHour === endHour
      ) { // 起始范围等于终止范围
        minutes = this.getLoops(startMinute, endMinute);
      } else if (
        year === endYear
          && month === endMonth
          && day === endDay
          && hour === endHour
      ) { // 当前等于终止范围
        minutes = this.getLoops(0, endMinute);
      } else if (
        startYear === year
          && startMonth === month
          && startDay === day
          && startHour === hour
      ) { // 当前等于起始范围
        minutes = this.getLoops(startMinute, 59);
      } else {
        minutes = this.getLoops(0, 59);
      }
      return minutes;
    },
    getSeconds(year, month, day, hour, minute) {
      const [
        startYear, startMonth, startDay,
        startHour, startMinute, startSecond,
      ] = this.data.startDateTime;
      const [
        endYear, endMonth, endDay,
        endHour, endMinute, endSecond,
      ] = this.data.endDateTime;
      let seconds = [];
      if (
        startYear === endYear
          && startMonth === endMonth
          && startDay === endDay
          && startHour === endHour
          && startMinute === endMinute
      ) { // 起始范围等于终止范围
        seconds = this.getLoops(startSecond, endSecond);
      } else if (
        year === endYear
          && month === endMonth
          && day === endDay
          && hour === endHour
          && minute === endMinute
      ) { // 当前等于终止范围
        seconds = this.getLoops(0, endSecond);
      } else if (
        startYear === year
          && startMonth === month
          && startDay === day
          && startHour === hour
          && startMinute === minute
      ) { // 当前等于起始范围
        seconds = this.getLoops(startSecond, 59);
      } else {
        seconds = this.getLoops(0, 59);
      }
      return seconds;
    },
    /** 生成顺序数组 */
    getLoops(start = 0, end = 0) {
      const loops = [];
      for (let i = start; i <= end; i++) {
        loops.push(i);
      }
      return loops;
    },
    /** 时间日期字符串转换为时间日期数组 */
    getDateTime(dateTimeString) {
      typeof dateTimeString === 'string' && (
        dateTimeString = dateTimeString.replace(/-/g, '/')
      );
      const { fields } = this.data;
      fields === FIELDS.HOUR && (
        dateTimeString += ':'
      );
      checkValidDatetime(dateTimeString);
      const datetime = new Date(dateTimeString);
      return [
        datetime.getFullYear(),
        datetime.getMonth() + 1,
        datetime.getDate(),
        datetime.getHours(),
        datetime.getMinutes(),
        datetime.getSeconds(),
      ];
    },
    /** 时间日期数组转换为时间日期字符串 */
    getValue() {
      const { columnsValue: values } = this.data;
      const value = values.map((item, index) => {
        let prefix = '';
        if (index > 0 && index < 3) prefix = '-';
        else if (index === 3) prefix = ' ';
        else if (index !== 0) prefix = ':';
        return `${prefix}${formatNumber(item)}`;
      }).join('');
      return value;
    },
    /** 列变化 */
    onColumnChange(e) {
      const { column, value } = e.detail;
      const columnValue = this.data.range[column][value];
      this.data.columnsValue[column] = +columnValue.slice(0, columnValue.length - 1);
      this.generateRange();
      this.triggerEvent('column', { column, value });
    },
    /** 确认选择 */
    onChange() {
      const value = this.getValue();
      this.triggerEvent('change', {
        columns: this.data.columnsValue,
        value,
      });
      /** 重新设置，防止滚动过快位置出现偏差 */
      this.setData({
        pickerValue: this.data.pickerValue,
      });
    },
    onViewChange(e) {
      const { value } = e.detail;
      this.data.columnsValue = this.data.range.map((item, index) => {
        const columnValue = item[value[index]];
        return +columnValue.slice(0, columnValue.length - 1);
      });
      this.generateRange(false);
      this.onChange();
    },
    /** 取消选择 */
    onCancel() {
      this.triggerEvent('cancel');
      const { columnsValue } = this.data;
      const currentValue = this.getDateTime(this.data.value);
      if (this.compareValues(currentValue, columnsValue) === 0) return;
      this.setColumnsValue();
      this.generateRange();
    },
  },
});
