<template>
  <el-dialog title="查詢" :visible.sync="dialogVisible" width="600px" :before-close="closeDialog"
    :close-on-click-modal="false" @open="handleDialogOpen">
    <el-form ref="Form" :model="searchForm"  >
      <door-drop-search ref="doorSearchRef"  @doSelectData="doSelectData"></door-drop-search>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" @click="closeDialog">關 閉</el-button>
      <el-button type="primary" @click="search">查 詢</el-button>
    </span>
  </el-dialog>
</template>
<script>
import DoorDropSearch from './DoorDropSearch'
import { queryAccessDoorGroup } from '@/api/hikvision/accessGroup'

export default {
  name: 'search',
  components: { DoorDropSearch },
  data() {
    return {
      dialogVisible: false,
      accessDoorData: [],  //門禁群組
      accessDoorLoading: false,
      searchForm: {},
    }
  },
  created() {

  },

  methods: {
    initQueryParamData() {
      queryAccessDoorGroup('').then((res) => {
        if (res.Status == 1) {
          this.accessDoorData = res.Data;
        }
      }).catch((err) => {

      });
    },
    show() {
      this.dialogVisible = true;
      this.$nextTick(() => {
         this.$refs.doorSearchRef.show();
        })

    },
    closeDialog() {
      this.dialogVisible = false;
    },
    search() {
      this.$emit('search', this.searchForm);
      this.closeDialog();
    },
    doQueryAccessDoor(query) {
      this.accessDoorLoading = true;
      queryAccessDoorGroup(query).then((res) => {
        this.accessDoorLoading = false;
        if (res.Status == 1) {
          this.accessDoorData = res.Data;
        }
      }).catch((err) => {
        this.accessDoorLoading = false;
      }
      );
    },
    handleDialogOpen() {

      this.initQueryParamData();
      this.resetSearch();

    },
    resetSearch() {
      this.searchForm = {};
    },
    doSelectData(group_id){
        this.searchForm.group_id =group_id;
        if(group_id){
          this.search();
        }
    }
  }
}
</script>

<style></style>
