<script>
export default {
  name: 'RenderCol',
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render(h, ctx) {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    }
    if (ctx.props.column) params.column = ctx.props.column
    // return ctx.props.render(ctx.props?.row[ctx.props?.column?.prop], ctx.props.row, ctx.props.index)
    if (ctx.props && ctx.props.row && ctx.props.column && ctx.props.column.prop) {
      return ctx.props.render(ctx.props.row[ctx.props.column.prop], ctx.props.row, ctx.props.index);
    } else {
      // Handle the case where one of the properties is undefined.
      // You might want to return a default value or throw an error, depending on your use case.
      return defaultValue; // Replace defaultValue with an appropriate default value.
    }
  }
}
</script>
