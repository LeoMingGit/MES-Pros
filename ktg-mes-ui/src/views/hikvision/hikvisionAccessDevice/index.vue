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
         <el-table-column prop="mac_no" label="卡機編號" />
        <el-table-column prop="mac_name" label="卡機名稱" />
        <el-table-column prop="m_id" label="ip地址" />
        <el-table-column prop="mac_function" label="用途編號" />
        <el-table-column prop="mac_function_name" label="用途名稱" />
        <el-table-column prop="co_name" label="廠別" />
        
         
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.row)" type="text" size="info">編輯</el-button>
            <el-button @click="removeEvent(scope.row)" type="danger" size="small">刪除</el-button>
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
import { mapGetters } from 'vuex'
import editDetail from './components/editDetail.vue';
import AddDetail from './components/AddDetail.vue';
import { deepClone } from '@/utils';
import { QueryHikAccessDeviceList,DeleteHikAccessDevice } from '@/api/hikvision/hikvisionAccessDevice'
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
     this.doQueryHikAccessDeviceList();
  },
  computed: {
    ...mapGetters([
      'user',
    ])
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
    removeEvent(row) {
      this.$confirm('此操作將刪除該項，是否繼續？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        debugger
        var  deleteData={
          id :row.uid,
          macNo:row.mac_no,
          userId:this.user.id,
        }
        DeleteHikAccessDevice(deleteData).then(res => {
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
    insertEvent() {

      this.$refs.addDetail.showAdd();

    },
    handleSizeChange(val) {
      this.tablePage.size = val;
      this.doQueryHikAccessDeviceList();
    },
    handleCurrentChange(val) {
      this.tablePage.page = val;
      this.doQueryHikAccessDeviceList();
    },
    doQueryHikAccessDeviceList() {

      this.filterSearchForm.pageNum = this.tablePage.page;
      this.filterSearchForm.pageSize = this.tablePage.size;
      QueryHikAccessDeviceList(this.filterSearchForm).then((res) => {
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
        this.filterSearchForm.mac_id_name = searchForm.mac_id_name;
        this.filterSearchForm.door_id_name = searchForm.door_id_name;
        this.filterSearchForm.enableStatus = searchForm.enableStatus;
      }

      this.$nextTick(() => {
        this.doQueryHikAccessDeviceList();
      });
    },
    editRow(row) {

      this.editDetailForm = deepClone(row);
      this.$refs.editDetail.show();

    },
    editDetailRefresh(form) {
      this.doQueryHikAccessDeviceList();
    },
    addDetailRefresh(form) {
      this.doQueryHikAccessDeviceList();
    },
   

  }
}
</script>

<style></style>
