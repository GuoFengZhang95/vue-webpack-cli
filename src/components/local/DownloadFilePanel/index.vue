<template>
  <div class="download-file-card-list">
    <div
      v-for="(item, index) in renderList"
      :key="index"
      class="download-file-card"
      @click="downLoad(item)"
    >
      <img class="icon" :src="item.fileTypeIcon" alt="" />
      <div class="content">
        <div class="file-name show-line_1">{{ item.fileName }}</div>
        <div class="size-time-wrapper">
          <span>{{ transformFileSize(item.fileSize) }}</span>
          <span>{{ item.fileTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const fileExtMap = new Map([
    ['pdf', 'pdf'],
    ['doc', 'word'],
    ['docx', 'word'],
    ['xls', 'excel'],
    ['xlsx', 'excel'],
    ['ppt', 'ppt'],
    ['pptx', 'ppt'],
  ])
  import { getFileUrl } from '@/api/common'
  export default {
    name: 'DownloadFilePanel',
    props: {
      files: {
        type: Array,
        default: () => [],
      },
      customFields: {
        type: Object,
        default: () => null,
      },
    },
    computed: {
      renderList() {
        return this.files.map(item => {
          let fileItem = Object.assign({}, item)
          if (this.customFields) {
            for (const key in this.customFields) {
              if (Object.hasOwnProperty.call(this.customFields, key)) {
                if (Object.hasOwnProperty.call(item, this.customFields[key])) {
                  fileItem[key] = item[this.customFields[key]]
                }
              }
            }
          }
          fileItem.fileTypeIcon = this.getFileTypeIconPath(fileItem.fileExt)
          return fileItem
        })
      },
    },
    methods: {
      getFileTypeIconPath(fileExt) {
        let iconType = fileExtMap.get(fileExt.toLowerCase())
        return require(`./images/icon_extend_${iconType}.svg`)
      },
      //下载附件
      async downLoad({ filePath }) {
        if (!filePath) {
          this.$message.error('下载地址不存在！')
          return
        }
        let res = await getFileUrl({ fileUrl: filePath })
        window.open(res.data)
      },
      /**处理文件大小 */
      transformFileSize(fileSize) {
        const unitGB = 1024 * 1024 * 1024
        const unitMB = 1024 * 1024
        const unitKB = 1024
        let strLen, tempFileSize
        if (fileSize > unitGB) {
          strLen = fileSize / unitGB
          tempFileSize = this.returnFloat(strLen) + 'GB'
        } else if (fileSize > unitMB) {
          strLen = fileSize / unitMB
          tempFileSize = this.returnFloat(strLen) + 'MB'
        } else if (fileSize > unitKB) {
          strLen = fileSize / unitKB
          tempFileSize = this.returnFloat(strLen) + 'KB'
        } else {
          strLen = fileSize
          tempFileSize = this.returnFloat(strLen) + 'B'
        }
        return tempFileSize
      },
      /**保留一位小数 */
      returnFloat(value) {
        let tempValue = 0
        tempValue = Math.round(parseFloat(value) * 100) / 100
        let xsd = []
        xsd = tempValue.toString().split('.')
        if (xsd.length === 1) {
          tempValue = tempValue.toString() + '.0'
        }
        if (xsd.length > 1) {
          if (xsd[1].length > 1) {
            tempValue = `${xsd[0]}.${xsd[1].slice(0, 1)}`
          }
        }
        return tempValue
      },
    },
  }
</script>

<style lang="less" scoped>
  .download-file-card-list {
    display: grid;
    grid-template-columns: repeat(2, auto);
    row-gap: 16px;
    column-gap: 16px;

    .download-file-card {
      transition: all 0.3s;

      &:hover {
        border-color: #00c7db;
        box-shadow: 0 0 4px 0 rgba(0, 199, 219, 0.38);
      }

      padding: 8px 12px;
      position: relative;
      height: 56px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: pointer;

      .icon {
        position: absolute;
        left: 12px;
        top: 12px;
        width: 14px;
        height: 14px;
      }

      .content {
        .file-name {
          padding-left: 18px;
          width: calc(100% - 30px);
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .size-time-wrapper {
          padding-left: 18px;
          height: 18px;
          line-height: 18px;
          font-size: 12px;
          color: #999999;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          > span {
            padding-right: 6px;
            margin-right: 6px;
            position: relative;
          }

          > span:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 8px;
            background-color: #e9e9e9;
          }
        }
      }
    }
  }
</style>
