<template>
  <el-dialog
    title="查詢"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false" @open="handleDialogOpen"
  >
   <el-form ref="Form" :model="searchForm"  >
      <role-drop-search ref="roleSearchRef"  @doSelectData="doSelectData"></role-drop-search>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" @click="closeDialog">關 閉</el-button>
      <el-button type="primary" @click="search">查 詢</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RoleDropSearch from './RoleDropSearch'
import { QueryPersonRoleDropList} from '@/api/hikvision/personGroup'



export default {
  name: 'search',
  components: { RoleDropSearch },
  data() {
    return {
      dialogVisible: false,
      accessDoorData: [],  //門禁群組
      accessDoorLoading: false,
      searchForm: {},
    }
  },
  created(){

  },
  methods: {
    initQueryParamData(){
      QueryPersonRoleDropList('').then((res) => {
        if (res.Status == 1) {
          this.accessDoorData = res.Data;
        }
        }).catch((err) => {
      });
    },
    show() {
      this.dialogVisible = true;
      this.$nextTick(() => {
         this.$refs.roleSearchRef.show();
        })
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    search() {
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.$emit('search',this.searchForm);
          this.closeDialog();
        } else {
          return false
        }
      })
    },
    doQueryPersonRoleDropList(query){
      this.accessDoorLoading = true;
      QueryPersonRoleDropList(query).then((res) => {
          this.accessDoorLoading = false;
          if (res.Status == 1) {
            this.accessDoorData = res.Data;
           }
        }).catch((err) => {
             this.accessDoorLoading = false;
             }
          );
     },
     handleDialogOpen(){
       this.initQueryParamData();
       this.resetSearch();
      },

      resetSearch(){
        this.searchForm={};
     },
    doSelectData(role_id){
        this.searchForm.role_id =role_id;
        if(role_id){
          this.search();
        }
    }

  }
}
</script>

<style>

</style>
