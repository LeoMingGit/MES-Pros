<template>
  <el-dialog title="查詢" :visible.sync="dialogVisible" width="600px" :before-close="closeDialog"
    :close-on-click-modal="false" @open="handleDialogOpen">
    <el-form ref="Form" :model="searchForm" :rules="rules" width="50%">

      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item label="員工" label-width="100px" prop="personId">
            <el-select v-model="searchForm.personId" filterable remote placeholder="請输入員工姓名" @change="$forceUpdate()"
              :remote-method="doQueryPersonList" :loading="queryPersonLoading">
              <el-option v-for="item in PersonList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item label="門禁" label-width="100px" prop="doorId">
            <el-select v-model="searchForm.doorId" filterable remote placeholder="請输入門禁名稱" @change="$forceUpdate()"
              :remote-method="doQueryDoorDeviceDict" :loading="queryDoorLoading">
              <el-option v-for="item in doorList" :key="item.id" :label="item.name" :value="item.id">
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
import { queryPersonList ,QueryDoorDeviceDict } from '@/api/hikvision/accessReport'
export default {
  name: 'searchDetail',
  data() {
    return {
      dialogVisible: false,
      searchForm: {},
      rules: {

      },
      PersonList: [],//負責人
      queryPersonLoading: false,
      queryDoorLoading:false,
      doorList:[],

    }
  },
  created() {

  },
  methods: {
    initDict() {
      queryPersonList('').then((res) => {
        if (res.Status == 1) {
          this.PersonList = res.Data;
        }
       }).catch((err) => {

      });
      QueryDoorDeviceDict('').then((res) => {
        if (res.Status == 1) {
          this.doorList = res.Data;
        }
      }).catch((err) => {
      });
    },
    show() {
      this.dialogVisible = true;
      this.initDict();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    search() {
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.$emit('search', this.searchForm);
          this.closeDialog();
        } else {
          return false
        }
      })
    },
   doQueryPersonList(query) {
      this.queryPersonLoading = true;
      queryPersonList(query).then((res) => {
        this.queryPersonLoading = false;
        if (res.Status == 1) {
          this.PersonList = res.Data;
          }
      }).catch((err) => {
            this.queryPersonLoading = false;
            }
        );
    },
    doQueryDoorDeviceDict(query){
      this.queryDoorLoading = true;
      QueryDoorDeviceDict(query).then((res) => {
        this.queryDoorLoading = false;
        if (res.Status == 1) {
          this.doorList = res.Data;
          }
      }).catch((err) => {
            this.queryDoorLoading = false;
            }
        );
    },
    handleDialogOpen() {
      this.resetSearch();
    },
    resetSearch() {
      this.searchForm = {};
    }

  }
}
</script>

<style></style>
