<template>
  <div>
    <el-divider content-position="left">角色對應人員</el-divider>

    <el-form size="mini" inline>
      <el-form-item>
        <el-button icon="el-icon-search" @click="showSearch" :disabled="!addDetailForm.role_id">查詢</el-button>
        <el-button type="success" v-permission="permission.add" icon="el-icon-plus" @click="insertEvent" :disabled="!addDetailForm.role_id">新增</el-button>
         <!-- <el-button type="danger" v-permission="permission.del" icon="el-icon-delete" @click="removeEvent(selectItem)" :disabled="selectItem.length==0">刪除</el-button> -->
      </el-form-item>
    </el-form>
    
   <!--表格渲染-->
   <el-table ref="table" :data="tableData" style="width: 100%;" >
      <el-table-column prop="employee" label="員工編輯" />
      <el-table-column prop="emp_name" label="員工姓名" />
      <el-table-column prop="fac_no_ext" label="廠別"/>
      <el-table-column prop="mgr_no_ext" label=" 主管工號"/>
      <el-table-column prop="insert_user_ext" label="建立人員" />
      <el-table-column prop="insert_date" label="建立時間" >
        <template slot-scope="scope">
          {{ formatDate(scope.row.insert_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="update_user_ext" label="修改人員" />
      <el-table-column prop="update_date" label="修改時間" >
        <template slot-scope="scope">
          {{ formatDate(scope.row.update_date) }} 
        </template>
       </el-table-column>
      <!-- <el-table-column prop="flag_ext" label="是否啟用" /> -->
      <!-- <el-table-column prop="remark" label="備註" /> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button @click="editRow(scope.row)" type="text" size="small">編輯</el-button> -->
          <el-button type="danger" icon="el-icon-delete" @click="removeEvent(scope.row)" >移除</el-button>
        </template>
      </el-table-column>
     
    </el-table>
     <!-- 分页 -->
     <el-pagination :current-page="tablePage.page" :total="tablePage.total" :page-sizes="[5,10, 20, 50, 100]"
      :page-size="tablePage.size" :background="tablePage.background" layout="total, sizes, prev, pager, next, jumper"
       @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
    <!---新增-->
    <add-detail ref="addDetail" :form="addDetailForm"  @addDetailRefresh="addDetailRefresh" ></add-detail>

    <!--編輯-->
    <edit-detail ref="editDetail" :form="editDetailForm"   @editDetailRefresh="editDetailRefresh" ></edit-detail>


     <!-- 查询窗体 -->
    <search-detail ref="search" @search="search"></search-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editDetail from './editDetail.vue';
import AddDetail from './AddDetail.vue';
import { deepClone } from '@/utils';
import { QueryPersonToRoleGroupDetailList,DeleteRoleDetail} from '@/api/hikvision/personGroup'
import searchDetail from './searchDetail';
 
export default {
  name: 'SetDetail',
  components: {AddDetail,editDetail,searchDetail },
  props: {
 
    addDetailForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
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
        size: 5,
        background: true,
      },
      filterSearchForm:{},
      selectRow: {},
      selectItem: [],
      editDetailForm:{},
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },

  methods: {
    formatDate(date) {
       if (date) {
        const formattedDate =date.replace('T', ' ');
        return formattedDate;
      }
      else {
        return '';
      }
     },
    search() {
      this.doQueryPersonToRoleGroupDetailList();
    },
    removeEvent(row) {
 
      this.$confirm('此操作將移除該項，是否繼續？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var  deleteData={
          role_id :row.role_id,
          id:row.id,
          userId:this.user.id,
        }
        DeleteRoleDetail(deleteData).then(res => {  
          if (res.Status == 1) {
            this.$notify.success(res.Msg);
            this.search();
          } else {
            this.$notify.error(res.ExpMsg);
          }
        })
      }).catch((e) => { 
        debugger
         this.$notify.info('已取消');
      });
    },
 
    insertEvent() {
       
       this.$refs.addDetail.showAdd();
       
    },
    handleSizeChange(val) {
      this.tablePage.size = val;
      this.doQueryPersonToRoleGroupDetailList();
    },
    handleCurrentChange(val) {
      this.tablePage.page = val;
      this.doQueryPersonToRoleGroupDetailList();
    },
    doQueryPersonToRoleGroupDetailList(){

      this.filterSearchForm.pageNum=this.tablePage.page;
      this.filterSearchForm.pageSize=this.tablePage.size;  
      this.filterSearchForm.roleId =this.addDetailForm.role_id;
      QueryPersonToRoleGroupDetailList(this.filterSearchForm).then((res) => {
           if (res.Status == 1) {
                this.tableData=  res.Data.Result;
                this.tablePage. total=res.Data.TotalNum;
              }
            else{

                 this.tableData=[];
              }
           } ).catch((err) => {
             
              this.tableData=[];
         });
 
    },
    showSearch(){
        this.$refs.search.show();
    },
    search(searchForm) {        


      if(searchForm){
        this.filterSearchForm.emp_id_name=searchForm.emp_id_name;
        this.filterSearchForm.enableStatus=searchForm.enableStatus;
       }

       this.$nextTick(() => {  
          this.doQueryPersonToRoleGroupDetailList();
        });
    },
    editRow(row) {
      
         this.editDetailForm = deepClone(row);
         this.editDetailForm.role_name=this.addDetailForm.role_name;
        this.$refs.editDetail.show();

     },
     editDetailRefresh(form){
         this.doQueryPersonToRoleGroupDetailList();
     },
     addDetailRefresh(form){
         this.doQueryPersonToRoleGroupDetailList();
     }
    

  }
}
</script>

<style>

</style>
