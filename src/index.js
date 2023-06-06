/* eslint-disable no-fallthrough */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
// 数字前位补零
const padZero = (val) => `00${val}`.slice(-2);

// 获取月份内天数
const getMonthDay = (year, month) => 32 - new Date(year, month - 1, 32).getDate();

// 检查日期格式
const isValidDate = (date) => typeof date !== 'undefined' && !Number.isNaN(new Date(date).getTime());

// 获取日期对象
const getDateTime = (date) => {
  if (typeof date === 'string') {
    date = date.trim();
    date = `${date.replace(/-/g, '/')}`;
    // 适配 xxxx-xx-xx xx 时间日期
    if (/ /.test(date) && !/:/.test(date)) {
      date = `${date}:00`;
    }
  }
  if (!isValidDate(date)) {
    throw new Error(`非法时间日期 ${date}`);
  }
  return new Date(date);
};

// 生成数字序列
const getRange = (min = 0, max = 0) => {
  const range = [];
  for (let i = min; i <= max; i++) {
    range.push(i);
  }
  return range;
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
  YEAR: '年',
  MONTH: '月',
  DAY: '日',
  HOUR: '时',
  MINUTE: '分',
  SECOND: '秒',
};
const now = new Date();
/** 部分默认值 */
const DEFAULTS = {
  MIN: '1900-01-01 00:00:00',
  MAX: '2099-12-31 23:59:59',
  NOW: `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} 00:00:00`,
};
/** 选择器样式 */
const MODES = {
  PICKER: 'picker',
  PICKER_VIEW: 'picker-view',
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
    // 时间粒度
    fields: {
      type: String,
      value: FIELDS.MINUTE,
      observer(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.getColumns();
      },
    },
    // 最小值
    min: {
      type: String,
      value: DEFAULTS.MIN,
      observer(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.getColumns();
      },
    },
    // 最大值
    max: {
      type: String,
      value: DEFAULTS.MAX,
      observer(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.getColumns();
      },
    },
    value: {
      type: String,
      observer(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.getColumns();
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    // 标题文字（仅 Android 生效）
    headerText: String,
  },
  data: {
    ranges: [],
    indexes: [],
  },
  lifetimes: {
    attached() {
      this.getColumns();
    },
  },
  methods: {
    getColumns(changed) {
      if (this.generating) return;
      this.generating = true;
      const value = changed || this.data.value || DEFAULTS.NOW;
      const datetime = getDateTime(value);
      const {
        minYear,
        minMonth,
        minDay,
        minHour,
        minMinute,
        minSecond,
      } = this.getBoundary('min', value);
      const {
        maxYear,
        maxMonth,
        maxDay,
        maxHour,
        maxMinute,
        maxSecond,
      } = this.getBoundary('max', value);
      const ranges = [];
      const indexes = [];
      // 按粒度从小到大
      switch (this.data.fields) {
        case FIELDS.SECOND: {
          const seconds = getRange(minSecond, maxSecond);
          const index = seconds.indexOf(datetime.getSeconds());
          ranges.unshift(seconds.map((item) => `${item}${UNITS.SECOND}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        case FIELDS.MINUTE: {
          const minutes = getRange(minMinute, maxMinute);
          const index = minutes.indexOf(datetime.getMinutes());
          ranges.unshift(minutes.map((item) => `${item}${UNITS.MINUTE}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        case FIELDS.HOUR: {
          const hours = getRange(minHour, maxHour);
          const index = hours.indexOf(datetime.getHours());
          ranges.unshift(hours.map((item) => `${item}${UNITS.HOUR}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        case FIELDS.DAY: {
          const days = getRange(minDay, maxDay);
          const index = days.indexOf(datetime.getDate());
          ranges.unshift(days.map((item) => `${item}${UNITS.DAY}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        case FIELDS.MONTH: {
          const months = getRange(minMonth, maxMonth);
          const index = months.indexOf(datetime.getMonth() + 1);
          ranges.unshift(months.map((item) => `${item}${UNITS.MONTH}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        case FIELDS.YEAR: {
          const years = getRange(minYear, maxYear);
          const index = years.indexOf(datetime.getFullYear());
          ranges.unshift(years.map((item) => `${item}${UNITS.YEAR}`));
          indexes.unshift(index > -1 ? index : 0);
        }
        default:
      }
      this.setData({
        ranges,
        indexes,
      }, () => {
        this.generating = false;
      });
    },
    // 获取 最大/最小 边界值
    getBoundary(type, value) {
      const datetime = getDateTime(value);
      const boundary = getDateTime(this.data[`${type}`]);
      const year = boundary.getFullYear();
      let month = 1;
      let day = 1;
      let hour = 0;
      let minute = 0;
      let second = 0;

      if (type === 'max') {
        month = 12;
        day = getMonthDay(datetime.getFullYear(), datetime.getMonth() + 1);
        hour = 23;
        minute = 59;
        second = 59;
      }

      if (datetime.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (datetime.getMonth() + 1 === month) {
          day = boundary.getDate();
          if (datetime.getDate() === day) {
            hour = boundary.getHours();
            if (datetime.getHours() === hour) {
              minute = boundary.getMinutes();
              if (datetime.getMinutes() === minute) {
                second = boundary.getSeconds();
              }
            }
          }
        }
      }

      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Day`]: day,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
        [`${type}Second`]: second,
      };
    },
    // 将带有单位的日期时间进行格式转换
    // xxxx年xx月xx日xx时xx分xx秒 => xxxx-xx-xx xx:xx:xx
    getValue(value) {
      const dateRegexp = new RegExp(
        `${UNITS.YEAR}|${UNITS.MONTH}|${UNITS.DAY}`,
        'g',
      );
      const timeRegexp = new RegExp(
        `${UNITS.HOUR}|${UNITS.MINUTE}|${UNITS.SECOND}`,
        'g',
      );
      let result = value.replace(dateRegexp, '-'); // result => 'xx-xx-xx-' || 'xx-xx-xx-xx时xx分xx秒'
      let index = -1; // 最后一个 '-' 位置
      result = result.slice(-1) === '-'
        ? result.slice(0, -1)
        : (
          index = result.lastIndexOf('-'),
          `${result.slice(0, index)} ${result.slice(index + 1)}`
            .replace(timeRegexp, ':') // result => 'xx-xx-xx xx:xx:xx:'
            .slice(0, -1)
        );
      result = result.split(/-| |:/).map((item, i) => {
        if (i === 0) return item; // 年
        if (i < 3) return `-${padZero(item)}`; // 月、日
        if (i === 3) return ` ${padZero(item)}`; // 时
        if (i > 3) return `:${padZero(item)}`; // 分、秒
        return item;
      }).join('');
      return result;
    },
    onColumnChange(e) {
      const values = this.data.ranges.map(
        (item, index) => item[this.data.indexes[index]],
      );
      const { column, value } = e.detail;
      values[column] = this.data.ranges[column][value];
      const result = this.getValue(values.join(''));
      this.getColumns(result);
    },
    onViewChange(e) {
      const { value } = e.detail;
      const values = this.data.ranges.map(
        (item, index) => item[value[index]],
      );
      const result = this.getValue(values.join(''));
      this.getColumns(result);
      this.onChange();
    },
    onChange() {
      const values = this.data.ranges.map(
        (item, index) => item[this.data.indexes[index]],
      );
      const value = this.getValue(values.join(''));
      this.triggerEvent('change', {
        value,
      });
    },
    onCancel() {
      this.triggerEvent('cancel');
      // 选择器复位
      this.getColumns();
    },
  },
});
