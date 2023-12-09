<template>
  <div class="app-container2">
    <!--工具栏-->

    <!--表单组件-->
    <el-dialog title="新增門禁群組明細" :visible.sync="dialogVisible" width="75%"  top="4vh"
      :before-close="closeDialog" :close-on-click-modal="false"      @open="handleDialogOpen" >
      <el-form ref="Form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="群組編號" label-width="100px" prop="group_id" >
          <el-input v-model="form.group_id"  disabled="disabled"/>
        </el-form-item>
        <el-form-item label="群組名稱" label-width="100px" prop="group_name">
          <el-input v-model="form.group_name"  disabled="disabled"/>
        </el-form-item>
        <el-form-item label="廠別" prop="fac_no" label-width="100px">
        <el-select v-model="form.fac_no"   filterable remote   placeholder="请输入廠別名稱" @change="$forceUpdate()"
          :remote-method="doQueryFactoryDict" :loading="queryFactoryDictLoading">
          <el-option v-for="item in factoryDict" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="負責人工號" label-width="100px" prop="mgr_no">
        <el-select v-model="form.mgr_no"   filterable remote   placeholder="请输入負責人姓名"   @change="$forceUpdate()"
          :remote-method="doQueryPrincipalList" :loading="queryprincipalLoading">
          <el-option v-for="item in principalList" :key="item.id" :label="item.name" :value="item.id">
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
        <el-form-item label="是否特殊權限" prop="spl_flag" label-width="108px">
        <el-radio-group v-model="form.spl_flag" style="width: 178px">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
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
        <el-form-item label="門禁" >
           <biz-transfer ref="bizTransfer" :show-query="true" :show-pagination="true"
            :pagination-call-back="paginationCallBack" :left-columns="leftColumns" :title-texts="['待選', '已選']"
            :button-texts="['添加', '刪除']" :query-texts="['篩選', '篩選']" :table-row-key="row => row.name"
            :leftTableData="leftTableData"    :rightTableData="rightTableData"
            :totalSize="totalSize"
            >

            <template v-slot:leftCondition="{ scope }">
              <el-form-item label="">
                <el-input v-model="scope.keyword" placeholder="請輸入關鍵詞"></el-input>
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
import { QueryAcsDevice,AddAccessDetailDoor, queryFactoryDict,queryPrincipalList} from '@/api/hikvision/accessGroup'

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
      principalList:[],//負責人
      queryprincipalLoading:false,
      leftTableData:[],
      rightTableData:[],
      totalSize:0,
      leftColumns: [
        { label: '門禁名', id: 'name', width: '240px' },
        { label: '區域', id: 'regionPathName', width: '270px' },
 
      ],
      dialogVisible: false,
      permission: {
        add: ['ROLE_SYSTEM_DEFAULT']
      },
      rules: {
        group_id: [
          { required: true, message: '請輸入群組ID', trigger: 'blur' }
        ],
        group_name: [
          { required: true, message: '請輸入群組名稱', trigger: 'blur' }
        ],
        fac_no: [
          { required: true, message: '請輸入廠別', trigger: 'blur' }
        ],
        mgr_no: [
          { required: true, message: '請輸入負責人工號', trigger: 'blur' }
        ],
        start_date: [
          { required: true, message: '請輸入開始日期', trigger: 'blur' }
        ],
        exp_date: [
          { required: true, message: '請輸入截止有效期', trigger: 'blur' }
        ],
        spl_flag: [
          { required: true, message: '請選擇是否特殊權限', trigger: 'blur' }
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
    this.initDict();

  },
  methods: {
    initDict() {

      queryFactoryDict('').then((res) => {
        if (res.Status == 1) {
          this.factoryDict = res.Data;
        }
      }).catch((err) => {

      });

      queryPrincipalList('').then((res) => {
        if (res.Status == 1) {
          this.principalList = res.Data;
        }
      }).catch((err) => {

      });

   },
   handleDialogOpen(){

     this.QueryAcsDevice();

   },

    closeDialog() {
      debugger
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
      this.form.selectedDoor=this.rightTableData;
      console.log(this.form);
       this.$refs["Form"].validate((valid) => {
       if (valid) {
        AddAccessDetailDoor(this.form)
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
           
          console.log("error submit!!");
          return false;
        }
      });
    },
    showAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {  
              if (!this.principalList.some(principal => principal.id === this.form.mgr_no)) {
                this.principalList.push({
                  id: this.form.mgr_no,
                  name: this.form.mgr_no_ext
                });
             }
           });
    },
  
    QueryAcsDevice(){
       
       var param = {
         groupId:this.form.group_id,
         pageIndex:1,
         pageSize:20
       };

        QueryAcsDevice(param)
        .then(response => {

          if (response.Status === 1) { 
            var pageData=response.Data;
            var tempArray = [];
            for (var item of pageData.Result) {
              tempArray.push({
                name: item.name,
                regionPathName: item.regionPathName,
                indexCode: item.indexCode
              })
            }
             this.leftTableData=tempArray
             this.totalSize= pageData.TotalNum
          }

        })
        .catch(error => {
           console.error('发生错误:', error);
        });

    },
    paginationCallBack(obj) {

      if (this.$refs.bizTransfer == null || this.$refs.bizTransfer == undefined) {
        return;
      }
     
      var param = {
         groupId:this.form.group_id,
         pageIndex:obj.pageIndex,
         pageSize:obj.pageSize
       };

      if (obj.keyword != undefined && obj.keyword != '') {
        param.keyword = obj.keyword;
      }
       QueryAcsDevice(param)
        .then(response => {
          if (response.Status === 1) {
            var pageData=response.Data;
            var tempArray = [];
            for (var item of pageData.Result) {
              tempArray.push({
                name: item.name,
                regionPathName: item.regionPathName,
                indexCode: item.indexCode
              })
            }
             this.leftTableData=tempArray
             this.totalSize= pageData.TotalNum
            this.$refs.bizTransfer.leftTableQueryPageCallBack();

           }
        })
        .catch(error => {
          debugger
          console.error('发生错误:', error);
        });

    },
    clearTransfer() {
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
      doQueryPrincipalList(query) {
       this.queryprincipalLoading = true;
        queryPrincipalList(query).then((res) => {
          this.queryprincipalLoading = false;
          if (res.Status == 1) {
            this.principalList = res.Data;
           }
        }).catch((err) => {
             this.queryprincipalLoading = false;
             }
          );
       },
 
  }

}
</script>

<style scoped>
  .required:before{
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }

</style>
