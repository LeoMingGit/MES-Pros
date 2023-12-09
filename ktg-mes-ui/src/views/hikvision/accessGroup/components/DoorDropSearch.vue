<template>
  <t-layout-page>
    <t-layout-page-item>
      <t-select-table :table="table" :columns="table.columns" :max-height="400" :keywords="{ label: 'group_name', value: 'group_id' }"         
        labelText="門禁群組" @radioChange="radioChange" :tableWidth="1000" isShowQuery isShowPagination :opts="opts"  @click="doSelectData()"
        @submit="conditionEnter" @page-change="pageChange"></t-select-table>
    </t-layout-page-item>
  </t-layout-page>
</template>
<script>
import TLayoutPage from '@/components/t-ui/layout-page/index'
import TLayoutPageItem from '@/components/t-ui/layout-page-item/index'
import TSelectTable from '@/components/t-ui/select-table/index'
import { GetHikAccessGroupList } from '@/api/hikvision/common'

export default {
  name: 'DoorDropSearch',
  components: { TLayoutPage, TLayoutPageItem, TSelectTable },
  data() {
    return {
      dialogVisible: false,
      searchForm: {},
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        data: [
        ],
        columns: [
          { label: '門禁編號', width: '30px', prop: 'group_id' },
          { label: '門禁名稱', width: '60px', prop: 'group_name' },
        ],
      },
      queryData: {
        likeKeyword: null
      }
    }
  },
  created() {

  },
  computed: {
    opts() {
      return {
        likeKeyword: {
          label: '',
          comp: 'el-input',
          span: 2
        }
      }
    },
  },
  methods: {
    show() {
       this.dialogVisible = true;
       this.doGetHikAccessGroupList();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    doGetHikAccessGroupList() {        
 
      var queryForm={
        PageNum : this.table.currentPage ,
        PageSize : this.table.pageSize,
        keyword:this.searchForm.keyword,
      }
       GetHikAccessGroupList(queryForm).then((res) => {
          if (res.Status == 1) {
            this.table.data = res.Data.Result;
           this.table.total = res.Data.TotalNum;
         }
      }).catch((err) => {  }
      );
    },
    handleDialogOpen() {
       this.resetSearch();
    },
    resetSearch() {
      this.searchForm = {};
    },

    radioChange(row) {
        this.$emit('doSelectData',row.group_id);
     },
    conditionEnter(data) {
        this.searchForm.keyword =data.likeKeyword;
       this.doGetHikAccessGroupList();
     },
    // 获取当前的页码
    pageChange(val) {
      this.table.currentPage = val
      this.doGetHikAccessGroupList()
    },
 
    
   
  
  
    }
  }
  </script>
  
  <style>
  
  </style>
  