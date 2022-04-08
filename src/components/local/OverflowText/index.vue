<template>
  <!-- 根据行数省略 显示收起 展开操作 -->
  <div id="workContent0" ref="textOverflow" :style="styleVal">
    <div class="wrapper">
      <input :id="keys" type="checkbox" class="exp" />
      <div class="text-box" :line-clamp="line">
        <label :for="keys" class="opera-btn"></label>
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      //文本内容
      text: {
        type: String,
        default: '',
      },
      keys: {
        type: String,
        default: 'exp',
      },
      //行数
      line: {
        type: Number,
        default: () => 3,
      },
    },
    data() {
      return {
        a: 'workContent0',
      }
    },
    computed: {
      styleVal() {
        return {
          keys: this.keys,
        }
      },
    },
    mounted() {},
  }
</script>
<style lang="less" scoped>
  .wrapper {
    display: flex;
  }
  .wrapper > input {
    visibility: hidden;
  }
  [line-clamp='2'] {
    max-height: 3em;
  }

  [line-clamp='3'] {
    max-height: 5em;
  }
  .text-box {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    position: relative;
    line-height: 1.5;
    /* transition: max-height 0.3s linear; */
  }
  .exp:checked + .text-box {
    max-height: 1000em;
  }
  .text-box::before {
    content: '';
    float: right;
    height: calc(100% - 17px);
  }

  .text-box .opera-btn {
    color: #00c7db;
    float: right;
    cursor: pointer;
    clear: both;
    line-height: 8px;
  }

  .opera-btn::before {
    content: '... ';
    color: #333;
  }

  .opera-btn::after {
    position: relative;
    top: 4px;
    content: '[更多]';
    color: #00c7db;
  }

  .exp:checked + .text-box .opera-btn::before {
    visibility: hidden;
  }

  .exp:checked + .text-box .opera-btn::after {
    content: '[收起]';
    color: #00c7db;
  }
  .text-box::after {
    content: '';
    width: 999vw;
    height: 999vw;
    position: absolute;
    box-shadow: inset calc(100px - 999vw) calc(24px - 999vw) 0 0 #f9f9f9;
    margin-left: -100px;
  }
  .exp:checked + .text-box::after {
    visibility: hidden;
  }
</style>
