<template>
  <div class="range-filter">
    <p>从</p>
    <p><a-input :value="from" @change="e => onChange(e, 'from')"></a-input></p>
    <p>到</p>
    <p><a-input :value="to" @change="e => onChange(e, 'to')"></a-input></p>
  </div>
</template>
<script>
  export default {
    name: 'RangeFilter',
    props: [],
    data() {
      return {
        from: '',
        to: '',
      }
    },
    methods: {
      onChange(e, name) {
        const { value } = e.target
        this[name] = value
        this.$emit('filterChange', [this.from, this.to])
      },
      reset() {
        this.from = ''
        this.to = ''
      },
    },
  }
</script>
