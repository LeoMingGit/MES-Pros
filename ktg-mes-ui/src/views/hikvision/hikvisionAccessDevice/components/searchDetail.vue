<template>
  <el-dialog
    title="查詢"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"    @open="handleDialogOpen"
  >
    <el-form ref="Form" :model="searchForm" :rules="rules" width="50%">
     
      <el-row :gutter="20">
          <el-col :span="15"> 
                  <el-form-item label="卡機" label-width="100px" prop="mac_id_name">
                       <el-input v-model="searchForm.mac_id_name" placeholder="请输入卡機編號或卡機名稱"></el-input>
                  </el-form-item>
          </el-col>
      </el-row>
     
      <el-row :gutter="20">
          <el-col :span="15"> 
              <el-form-item label="啟用狀態" label-width="100px" prop="enableStatus">
                  <el-select v-model="searchForm.enableStatus" placeholder="请选择">
                          <el-option
                          v-for="item in statusList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          </el-option>
                   </el-select>
              </el-form-item>
          </el-col>
      </el-row>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" @click="closeDialog">關 閉</el-button>
      <el-button type="primary" @click="search">查 詢</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'searchDetail',
  data() {
    return {
      dialogVisible: false,
      searchForm: {},
      rules: {


      },
      statusList: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: 'Y',
                    label: '啟用'
                }, {
                    value: 'N',
                    label: '禁用'
                }

            ]
    }
  },
  created(){

  },
  methods: {

    show() {
      this.dialogVisible = true;
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
  
    handleDialogOpen(){
       this.resetSearch();
    },
    resetSearch(){
        this.searchForm={};
     }

  }
}
</script>

<style>

</style>
