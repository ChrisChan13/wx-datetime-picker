# wx-datetime-picker

- [In English](https://github.com/ChrisChan13/wx-datetime-picker/blob/master/README.EN.md)
- [中文 (简体)](https://github.com/ChrisChan13/wx-datetime-picker/blob/master/README.md)

A Datetime Picker based on Wechat Miniprogram's native MultiSelector Picker. Used to select time, support date and time dimensions.

## Install

### npm

Before using npm, please checkout the [npm surpport](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html) for Wechat Miniprogram.

```bash
# install via npm
npm i wx-datetime-picker -S --production
```

### Build npm package

Click the menu bar in Weixin DevTools, and go to **Tools** > **Build npm**, then check the **Use npm module** option. The npm package can be used once built.

## Usage

### Declare Component

Declare at `app.json` for global usage
```json
// app.json
{
  "usingComponents": {
    "datetime-picker": "wx-datetime-picker/index"
  }
}
```

Declare at `page.json` for side usage
```json
// somepage.json
{
  "usingComponents": {
    "datetime-picker": "wx-datetime-picker/index"
  }
}
```

### Using Component

```html
<datetime-picker
  box-class="custom-class"
  start="{{start}}"
  end="{{end}}"
  fields="{{fields}}"
  value="{{value}}"
  disabled="{{disabled}}"
>
  <text>Choose Datetime</text>
</datetime-picker>
```

## Example

### Basic Usage

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
>
  <view class="cell-title">Choose Datetime</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Disabled Selection

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
  disabled
>
  <view class="cell-title">Choose Datetime</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Custom Valid Range

```html
<datetime-picker
  box-class="cell"
  start="{{start}}"
  end="{{end}}"
  value="{{value}}"
  bindchange="setValue"
>
  <view class="cell-title">Choose Datetime</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Choose Year-Month-Day

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
  fields="day"
>
  <view class="cell-title">Choose Year-Month-Day</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Choose Year-Month

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
  fields="month"
>
  <view class="cell-title">Choose Year-Month</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Choose Year-Month-Day Hour

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
  fields="hour"
>
  <view class="cell-title">Choose Year-Month-Day Hour</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Choose Year-Month-Day Hour:Minute

```html
<datetime-picker
  box-class="cell"
  value="{{value}}"
  bindchange="setValue"
  fields="minute"
>
  <view class="cell-title">Choose Year-Month-Day Hour:Minute</view>
  <view class="cell-value">{{value}}</view>
</datetime-picker>
```

### Nested Style

```html
<datetime-picker
  box-class="picker"
  value="{{value}}"
  mode="picker-view"
  bindchange="setValue"
/>
```

## API

### Props

| Attribute  | Type                                     | Description                                              | Default               |
| :--------- | :--------------------------------------- | :------------------------------------------------------- | :-------------------- |
| `mode`     | `picker\|picker-view`                    | How the component place in page                          | `picker`              |
| `start`    | `string`                                 | The start of the valid date range, any valid Date string | `1900-01-01 00:00:00` |
| `end`      | `string`                                 | The end of the valid date range, any valid Date string   | `2099-12-31 23:59:59` |
| `value`    | `string`                                 | The selected datetime, any valid Date string             | -                     |
| `fields`   | `year\|month\|day\|hour\|minute\|second` | The granularity of the picker                            | `minute`              |
| `disabled` | `boolean`                                | Specifies whether to disable the component               | `false`               |

### Events

| Event     | Description                                                         | Arguments                    |
| :-------- | :------------------------------------------------------------------ | :--------------------------- |
| `column`  | Triggered when the column changes (only when `mode` is `picker`)    | Changed column and its value |
| `change`  | Triggered when the value is changed  | Changed value                |                              |
| `cancel`  | Triggered when selection is canceled (only when `mode` is `picker`) | -                            |

### External Classes

| Class             | Description                                                                 |
| :---------------- | :-------------------------------------------------------------------------- |
| `box-class`       | ClassName of the root node (picker)                                         |
| `indicator-class` | ClassName of the checkbox in the picker (only when `mode` is `picker-view`) |
| `mask-class`      | ClassName of the mask in the picker (only when `mode` is `picker-view`)     |
| `column-class`    | ClassName of every column in the picker (only when `mode` is `picker-view`) |
| `unit-class`      | ClassName of every unit in columns (only when `mode` is `picker-view`)      |

## Demo

Clone this repo, Run `npm i & npm run dev`. Import `miniprogram_dev` to Wechat Developer Tool.

### Sample Preview

![demo.png](https://github.com/ChrisChan13/wx-datetime-picker/blob/master/demo.png)

### Sample Code

```html
<!-- index.html -->
<view class="container">
  <view class="label">基础用法</view>
  <datetime-picker
    box-class="cell"
    value="{{value}}"
    bindchange="setValue"
    data-field="value"
  >
    <view class="cell-title">选择时间日期</view>
    <view class="cell-value">{{value}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell cell-disabled"
    value="{{now}}"
    bindchange="setValue"
    data-field="now"
    disabled
  >
    <view class="cell-title">禁用状态</view>
    <view class="cell-value">{{now}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    start="{{start}}"
    end="{{end}}"
    value="{{customize}}"
    bindchange="setValue"
    data-field="customize"
  >
    <view class="cell-title">自定可选范围</view>
    <view class="cell-value">{{customize}}</view>
  </datetime-picker>
  <view class="label">自定义选择器粒度</view>
  <datetime-picker
    box-class="cell"
    value="{{year}}"
    bindchange="setValue"
    data-field="year"
    fields="year"
  >
    <view class="cell-title">年为粒度</view>
    <view class="cell-value">{{year}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    value="{{month}}"
    bindchange="setValue"
    data-field="month"
    fields="month"
  >
    <view class="cell-title">月为粒度</view>
    <view class="cell-value">{{month}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    value="{{day}}"
    bindchange="setValue"
    data-field="day"
    fields="day"
  >
    <view class="cell-title">日为粒度</view>
    <view class="cell-value">{{day}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    value="{{hour}}"
    bindchange="setValue"
    data-field="hour"
    fields="hour"
  >
    <view class="cell-title">时为粒度</view>
    <view class="cell-value">{{hour}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    value="{{minute}}"
    bindchange="setValue"
    data-field="minute"
    fields="minute"
  >
    <view class="cell-title">分为粒度</view>
    <view class="cell-value">{{minute}}</view>
  </datetime-picker>
  <datetime-picker
    box-class="cell"
    value="{{second}}"
    bindchange="setValue"
    data-field="second"
    fields="second"
  >
    <view class="cell-title">秒为粒度</view>
    <view class="cell-value">{{second}}</view>
  </datetime-picker>
  <view class="label">嵌入式选择器</view>
  <view class="cell">
    <view class="cell-title">下方选中时间日期</view>
    <view class="cell-value">{{view}}</view>
  </view>
  <datetime-picker
    box-class="cell-picker"
    value="{{view}}"
    mode="picker-view"
    bindchange="setValue"
    data-field="view"
  />
</view>
```

```javascript
/* index.js */
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
    date: nowDatetime.slice(0, nowDatetime.indexOf(' ')),
    hour: nowDatetime.slice(0, nowDatetime.indexOf(':')),
    minute: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
    second: nowDatetime,
    view: nowDatetime.slice(0, nowDatetime.lastIndexOf(':')),
  },
  setValue(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`${field}`]: e.detail.value,
    });
  },
});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
