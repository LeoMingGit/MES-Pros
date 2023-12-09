<template>
  <div>
    <div class="app-container">

      <el-form size="mini" inline>
        <el-form-item>
          <el-button icon="el-icon-search" @click="showSearch">查詢</el-button>
          <el-button type="success" v-permission="permission.add" icon="el-icon-plus" @click="insertEvent">新增</el-button>
          <!-- <el-button type="danger" v-permission="permission.del" icon="el-icon-delete" @click="removeEvent(selectItem)" :disabled="selectItem.length==0">刪除</el-button> -->
        </el-form-item>
      </el-form>

      <!--表格渲染-->
      <el-table ref="table" :data="tableData" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="role_id" label="角色編號" />
        <el-table-column prop="role_name" label="角色名稱" />
        <el-table-column prop="group_id" label="門禁組編號" />
        <el-table-column prop="group_name" label="門禁組名稱" />
        <el-table-column prop="fac_no_ext" label="廠別" />
        <el-table-column prop="start_date" label="開始日期">
          <template slot-scope="scope">
            {{ formatDate(scope.row.start_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="exp_date" label="截止有效期">
          <template slot-scope="scope">
            {{ formatDate(scope.row.exp_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="insert_user_ext" label="建立人員" />
        <el-table-column prop="insert_date" label="建立時間">
          <template slot-scope="scope">
            {{ formatDate(scope.row.insert_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="update_user_ext" label="修改人員" />
        <el-table-column prop="update_date" label="修改時間">
          <template slot-scope="scope">
            {{ formatDate(scope.row.update_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="flag_ext" label="是否啟用" />
        <el-table-column prop="remark" label="備註" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.row)" type="text" size="small">編輯</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <el-pagination :current-page="tablePage.page" :total="tablePage.total" :page-sizes="[10, 20, 50, 100]"
        :page-size="tablePage.size" :background="tablePage.background" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
      <!---新增-->
      <add-detail ref="addDetail" :form="addDetailForm" @addDetailRefresh="addDetailRefresh"></add-detail>

      <!--編輯-->
      <edit-detail ref="editDetail" :form="editDetailForm" @editDetailRefresh="editDetailRefresh"></edit-detail>


      <!-- 查询窗体 -->
      <search-detail ref="search" @search="search"></search-detail>
    </div>
  </div>
</template>

<script>
import editDetail from './components/editDetail.vue';
import AddDetail from './components/AddDetail.vue';
import { deepClone } from '@/utils';
import { QueryAccessToGroupPagedList } from '@/api/hikvision/roleToAccessGroup'
import searchDetail from './components/searchDetail';

export default {
  name: 'SetDetail',
  components: { AddDetail, editDetail, searchDetail },
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
        size: 10,
        background: true,
      },
      filterSearchForm: {},
      selectRow: {},
      selectItem: [],
      addDetailForm: { flag: "Y", start_date: null, exp_date: null },
      editDetailForm: {},
    }
  },
  created() {

    this.initData();
    this.doQueryAccessToGroupPagedList();

  },

  methods: {
    formatDate(date) {
      if (date) {
        const formattedDate = date.replace('T', ' ');
        return formattedDate;
      }
      else {
        return '';
      }
    },
    search() {

      this.doQueryAccessToGroupPagedList();
    },
    removeEvent(rows) {
      this.$confirm('次操作將刪除該項，是否繼續？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteRows(rows).then(res => {
          if (res.Status == 1) {
            this.$notify.success(res.Msg);
            this.search();
          } else {
            this.$notify.error(res.ExpMsg);
          }
        })
      }).catch(() => {
        this.$notify.info('已取消');
      });
    },
    DeleteRows(rows) {


    },
    insertEvent() {

      this.$refs.addDetail.showAdd();

    },
    handleSizeChange(val) {
      this.tablePage.size = val;
      this.doQueryAccessToGroupPagedList();
    },
    handleCurrentChange(val) {
      this.tablePage.page = val;
      this.doQueryAccessToGroupPagedList();
    },
    doQueryAccessToGroupPagedList() {

      this.filterSearchForm.pageNum = this.tablePage.page;
      this.filterSearchForm.pageSize = this.tablePage.size;
      this.filterSearchForm.roleId = this.addDetailForm.role_id;
      QueryAccessToGroupPagedList(this.filterSearchForm).then((res) => {
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


      if (searchForm) {
        debugger
        this.filterSearchForm.role_id_name = searchForm.role_id_name;
        this.filterSearchForm.door_id_name = searchForm.door_id_name;
        this.filterSearchForm.enableStatus = searchForm.enableStatus;
      }

      this.$nextTick(() => {
        this.doQueryAccessToGroupPagedList();
      });
    },
    editRow(row) {

      this.editDetailForm = deepClone(row);
      this.$refs.editDetail.show();

    },
    editDetailRefresh(form) {
      this.doQueryAccessToGroupPagedList();
    },
    addDetailRefresh(form) {
      this.doQueryAccessToGroupPagedList();
    },
    initData() {
      var currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setFullYear(currentDate.getFullYear() + 30);
      this.addDetailForm.start_date = currentDate;
      this.addDetailForm.exp_date = endDate;
    }

  }
}
</script>

<style></style>
