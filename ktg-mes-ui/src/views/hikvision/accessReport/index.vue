<template>
  <div>
    <div class="app-container">

      <el-form size="mini" inline>
        <el-form-item>
          <el-button icon="el-icon-search" @click="showSearch">查詢</el-button>
         </el-form-item>
      </el-form>

      <!--表格渲染-->
      <el-table ref="table" :data="tableData" style="width: 100%;">
         <el-table-column prop="personName" label="姓名" />
        <el-table-column prop="jobNo" label="工號" />
        <el-table-column prop="orgPathName" label="所屬組織" />
        <el-table-column prop="doorName" label="門禁名稱" />
        <!-- <el-table-column prop="expiryDate" label="權限有效期" /> -->
        <el-table-column prop="regionName" label="區域" />
    
      </el-table>
      <!-- 分页 -->
      <el-pagination :current-page="tablePage.page" :total="tablePage.total" :page-sizes="[10, 20, 50, 100]"
        :page-size="tablePage.size" :background="tablePage.background" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
     


      <!-- 查询窗体 -->
      <search-detail ref="search" @search="search"></search-detail>
    </div>
  </div>
</template>

<script>

import { QueryPersonDoorAuthList } from '@/api/hikvision/accessReport'
import searchDetail from './components/searchDetail';

export default {
  name: 'SetDetail',
  components: {  searchDetail },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      tableData: [],
      tablePage: {
        total: 0,
        page: 1,
        size: 20,
        background: true,
      },
      filterSearchForm: {},
      selectRow: {},
      selectItem: [],
      addDetailForm: { flag: "Y" },
      editDetailForm: {},
    }
  },
  created() {

   },
  methods: {
  
    search() {
      this.doQueryAccessToGroupPagedList();
    },
 
    handleSizeChange(val) {
      this.tablePage.size = val;
      this.doQueryPersonDoorAuthList();
    },
    handleCurrentChange(val) {
      this.tablePage.page = val;
      this.doQueryPersonDoorAuthList();
    },
    doQueryPersonDoorAuthList() {

      this.filterSearchForm.pageNum = this.tablePage.page;
      this.filterSearchForm.pageSize = this.tablePage.size;
      QueryPersonDoorAuthList(this.filterSearchForm).then((res) => {
        if (res.Status == 1) {
          this.tableData = res.Data.Result;
          this.tablePage.total = res.Data.TotalNum;
        }
        else {

          this.tableData = [];
        }
      }).catch((err) => {

        this.tableData = [];
      });

    },
    showSearch() {
      this.$refs.search.show();
    },
    search(searchForm) {
      if (searchForm.personId !=undefined ||searchForm !=undefined) {
        
          this.filterSearchForm.personId = searchForm.personId;
          this.filterSearchForm.doorId= searchForm.doorId;
          this.doQueryPersonDoorAuthList();
       }

     
    }

   

  }
}
</script>

<style></style>
