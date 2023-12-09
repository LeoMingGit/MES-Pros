<template>
  <div class="app-container">
    <!-- 表头操作 -->
    <el-divider content-position="left">角色</el-divider>

    <el-form size="mini" inline>
      <el-form-item>
        <el-button icon="el-icon-search" @click="showSearch">查詢</el-button>
        <el-button type="success" v-permission="permission.add" icon="el-icon-plus" @click="showAdd">新增</el-button>
        <el-button type="primary" v-permission="permission.edit" icon="el-icon-edit" @click="EditAdd" :disabled="!header.role_id">編輯</el-button>
        <!-- <el-button type="danger" v-permission="permission.del" icon="el-icon-delete" @click="DelAdd" :disabled="!header.group_id">刪除</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 表头信息 -->
    <el-form :model="header" class="header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="角色編號 ：">{{ header.role_id }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色名稱：">{{ header.role_name }}</el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="廠別：">{{ header.fac_no_ext }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="負責人工號：">{{ header.mgr_no_ext }}</el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
       
        <el-col :span="6">
          <el-form-item label="建立人員：">{{ header.insert_user_ext }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="建立時間：">{{ formatDate(header.insert_date) }}</el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="修改人員：">{{ header.update_user_ext }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="修改時間：">{{ formatDate(header.update_date) }}</el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
  
        <el-col :span="6">
          <el-form-item label="是否啟用：">{{ header.flag_ext }}</el-form-item>
        </el-col>
      </el-row>
      
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="备注："> 
              <el-input
                type="textarea"
                :rows="3"
                placeholder=""
                v-model="header.remark" :disabled="true" >
              </el-input>  
            </el-form-item>
          </el-col>
        </el-row>

    </el-form>

    
    <!-- 查询窗体 -->
    <search ref="search" @search="search"></search>
    <!-- 新增窗体 -->
    <add ref="add" :form="selectRow"  :isAddFlag="isAddFlag" @search="search"></add>
   
      <!-- 明細 -->
    <set-detail  ref="setDetail"   :addDetailForm="addDetailForm"></set-detail>
  </div>
</template>

<script>
import Search from './components/search';
import Add from './components/add';
import SetDetail from './components/SetDetail.vue';
import { deepClone } from '@/utils';
import { QueryPersonRoleDetail} from '@/api/hikvision/personGroup'

export default {
  name: 'CreateTemp',
  components: { Search, Add, SetDetail },
 
  data() {
    return {
      // 按钮权限控制
      permission: {
        add: [],
        edit: [],
        del: []
      },
      radio: '模板設定',
      searchForm: {},
      header: {},
      addDetailForm: {},
      detailForm:{},
      isAddFlag: true,
      selectRow: { group_id: '', group_name: '', group_name: '',mgr_no:'', spl_flag: 'N',flag:'Y', start_date: null,exp_date:null, remark:"" },
    }
  },
  created (){

 
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
    showSearch() {
      this.$refs.search.show();
    },
    showAdd() {
       
      this.isAddFlag = true;     
      this.selectRow={ group_id: '', group_name: '', group_name: '',mgr_no:'', spl_flag: 'N',flag:'Y', start_date: null,exp_date:null, remark:"" ,layer:1 };
      this.$refs.add.show();
    },
  
    EditAdd() {
        this.selectRow = deepClone(this.header);
        this.isAddFlag = false;
        this.$refs.add.show();
    },
    DelAdd() {
      this.$confirm('此操作將刪除該項，是否繼續', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {
        this.$notify.info('已取消');
      });
    },
    search(searchForm) {
          QueryPersonRoleDetail(searchForm.role_id).then((res) => {
          if (res.Status == 1) { 
             
               this.header = res.Data;
               this.addDetailForm=res.Data;
               this.$refs.setDetail.search();
           }
           else{
                this.filterForm={}
               }
           } ).catch((err) => {
             this.filterForm={}
             });
    },
 

  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .tag{
    padding-bottom: 20px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
  }
}
.el-form-item--small.el-form-item {
    margin-bottom: 0 !important; 
}
</style>
