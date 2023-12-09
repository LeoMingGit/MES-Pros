<template>
  <div class="app-container2">
    <!--工具栏-->

    <!--表单组件-->
    <el-dialog title="新增角色對應門禁群組" :visible.sync="dialogVisible" width="75%" top="4vh" :before-close="closeDialog"
      :close-on-click-modal="false" @open="handleDialogOpen">
      <el-form ref="Form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="角色" prop="role_id" label-width="100px">
          <el-select v-model="form.role_id"   filterable remote   placeholder="请输入角色名稱" @change="roleChange"
            :remote-method="doQueryroleDropList" :loading="queryroleDropListLoading">
            <el-option v-for="item in roleDropList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="廠別" prop="fac_no" label-width="100px">
          <el-select v-model="form.fac_no" filterable remote placeholder="请输入廠別名稱" @change="$forceUpdate()"
            :remote-method="doQueryFactoryDict" :loading="queryFactoryDictLoading">
            <el-option v-for="item in factoryDict" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item label="開始日期" prop="start_date" label-width="100px">
          <el-date-picker v-model="form.start_date" align="right" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止有效期" prop="exp_date" label-width="100px">
          <el-date-picker v-model="form.exp_date" align="right" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
  
        <el-form-item label="是否啟用" prop="flag" label-width="100px">
          <el-radio-group v-model="form.flag" style="width: 178px">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="備註" label-width="100px" prop="remark">
          <el-input type="textarea" :rows="4" style="width: 461px" placeholder="请输入内容" v-model="form.remark">
          </el-input>
        </el-form-item>
        <el-form-item label="門禁">
          <biz-transfer ref="bizTransfer" :show-query="true" :show-pagination="true"
            :pagination-call-back="paginationCallBack" :left-columns="leftColumns" :title-texts="['待選', '已選']"
            :button-texts="['添加', '刪除']" :query-texts="['篩選', '篩選']" :table-row-key="row => row.group_id"
            :leftTableData="leftTableData" :rightTableData="rightTableData" :totalSize="totalSize">

            <template v-slot:leftCondition="{ scope }">
              <el-form-item label="">
                <el-input v-model="scope.keyword" placeholder="請輸入關鍵字"></el-input>
              </el-form-item>
            </template>
          </biz-transfer>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="cancel">關 閉</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BizTransfer from './BizTransfer.vue';
import { QueryHikAccessGroupList, AddHikRoleToAccessGroup, queryFactoryDict, queryroleDropList  } from '@/api/hikvision/roleToAccessGroup'

export default {
  name: 'addDetail',
  components: { BizTransfer },
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      }
    },

  },
  data() {
    return {
      factoryDict: [],
      queryFactoryDictLoading: false,
      roleDropList: [],
      queryroleDropListLoading: false,
      leftTableData: [],
      rightTableData: [],
      totalSize: 0,
      leftColumns: [
          { label: '門禁組編號', id: 'group_id', width: '130px' },
          { label: '門禁組名稱', id: 'group_name', width: '220px' },
       ],
      dialogVisible: false,
      permission: {
        add: ['ROLE_SYSTEM_DEFAULT']
      },
      rules: {

        role_id: [
            { required: true, message: '請選擇角色', trigger: 'blur' }
          ],
          fac_no: [
            { required: true, message: '請輸入廠別', trigger: 'blur' }
          ],
          start_date: [
          { required: true, message: '請輸入開始日期', trigger: 'blur' }
         ],
          exp_date: [
            { required: true, message: '請輸入截止有效期', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '请選擇是否啟用標誌', trigger: 'blur' }
          ],

      },
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },
  created() {

  },
  methods: {
    initDict() {

      queryFactoryDict('').then((res) => {
        if (res.Status == 1) {
          this.factoryDict = res.Data;
        }
      }).catch((err) => {

      });

      queryroleDropList('').then((res) => {
        if (res.Status == 1) {
          this.roleDropList = res.Data;
        }
      }).catch((err) => {

      });

    },
    handleDialogOpen() {
        this.initDict();

    },

    closeDialog() {

      this.dialogVisible = false;
      this.$refs["Form"].resetFields();
      this.clearTransfer();
    },
    cancel() {

      this.closeDialog();
    },
    submit() {

      if (this.rightTableData.length <= 0) {
        this.$notify.error("請選擇門禁");
        return;
      }
 
      this.form.insert_user = this.user.id;
      this.form.selectedData = this.rightTableData;
      this.$refs["Form"].validate((valid) => {
        if (valid) {
          AddHikRoleToAccessGroup(this.form)
            .then((res) => {
              if (res.Status == 1) {
                this.$emit('addDetailRefresh', this.form)
                this.$notify.success(res.Msg);
                this.closeDialog();
              } else {
                this.$notify.error(res.ExpMsg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {

           return false;
        }
      });
    },
    showAdd() {
      this.dialogVisible = true;
      
    },

    doQueryHikAccessGroupList() {
     
      var param = {
        role_id:this.form.role_id,
        pageNum: 1,
        pageSize: 20
      };

      QueryHikAccessGroupList(param)
        .then(response => {

          if (response.Status === 1) {
            var pageData = response.Data;
            var tempArray = [];
            for (var item of pageData.Result) {
              tempArray.push({
                group_id: item.group_id,
                group_name: item.group_name,
               })
            }
            this.leftTableData = tempArray
            this.totalSize = pageData.TotalNum
          }

        })
        .catch(error => {

         });

    },
    paginationCallBack(obj) {

      if (this.$refs.bizTransfer == null || this.$refs.bizTransfer == undefined) {
        return;
      }

      var param = {
        role_id:this.form.role_id,
        pageNum: obj.pageIndex,
        pageSize: obj.pageSize
      };

      if (obj.keyword != undefined && obj.keyword != '') {
        param.keyword = obj.keyword;
      }
      QueryHikAccessGroupList(param)
        .then(response => {
          if (response.Status === 1) {
            var pageData = response.Data;
            var tempArray = [];
            for (var item of pageData.Result) {
              tempArray.push({
                group_id: item.group_id,
                group_name: item.group_name,
              })
            }
            this.leftTableData = tempArray
            this.totalSize = pageData.TotalNum
            this.$refs.bizTransfer.leftTableQueryPageCallBack();

          }
        })
        .catch(error => {
         });

    },
    clearTransfer() {
      this.leftTableData = [ ];
      this.totalSize = 0 ;
      this.$refs.bizTransfer.leftTableQueryPageCallBack();
      this.rightTableData = [];
      this.$refs.bizTransfer.clear()
    },
    doQueryFactoryDict(query) {
      this.queryFactoryDictLoading = true;
      queryFactoryDict(query).then((res) => {
        this.queryFactoryDictLoading = false;
        if (res.Status == 1) {
          this.factoryDict = res.Data;
        }
      }).catch((err) => {
        this.queryFactoryDictLoading = false;
      }
      );
    },
    doQueryroleDropList(query) {
      this.queryroleDropListLoading = true;
      queryroleDropList(query).then((res) => {
        this.queryroleDropListLoading = false;
        if (res.Status == 1) {
          this.roleDropList = res.Data;
        }
      }).catch((err) => {
        this.queryroleDropListLoading = false;
      }
      );
    },
    roleChange(val){

      this.$forceUpdate();
      this.clearTransfer();
      this.doQueryHikAccessGroupList();

    },


  }

}
</script>

<style scoped>
.required:before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
</style>
