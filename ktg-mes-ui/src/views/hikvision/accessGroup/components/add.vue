<template>
  <el-dialog :title="isAddFlag ? '新增門禁群組' : '修改門禁群組'" :visible.sync="dialogVisible" width="800px"
    :before-close="closeDialog" :close-on-click-modal="false">
    <el-form ref="Form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="群組編號" label-width="100px" prop="group_id" v-if="!isAddFlag">
        <el-input v-model="form.group_id"   disabled="disabled"/>
      </el-form-item>
      <el-form-item label="群組名稱" label-width="100px" prop="group_name">
        <el-input v-model="form.group_name" />
      </el-form-item>
      <el-form-item label="廠別" prop="fac_no" label-width="100px">
        <el-select v-model="form.fac_no"   filterable remote   placeholder="請输入廠別名稱" @change="$forceUpdate()"
          :remote-method="doQueryFactoryDict" :loading="queryFactoryDictLoading">
          <el-option v-for="item in factoryDict" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="負責人工號" label-width="100px" prop="mgr_no">
        <el-select v-model="form.mgr_no"   filterable remote   placeholder="請输入負責人姓名"   @change="$forceUpdate()"
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
        <el-input type="textarea" :rows="4" style="width: 461px" placeholder="請输入内容" v-model="form.remark">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" @click="cancel">關 閉</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { addAccessGroup, editAccessGroup, queryFactoryDict,queryPrincipalList} from '@/api/hikvision/accessGroup'
export default {
  name: "add",
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isAddFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      factoryDict: [],
      queryFactoryDictLoading: false,
      principalList:[],//負責人
      queryprincipalLoading:false,
      
      rules: {
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
          { required: true, message: '請選擇是否啟用標誌', trigger: 'blur' }
        ],
      },
    };
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
    show() {
      this.dialogVisible = true;
      this.initDict();

       this.$nextTick(() => {  
              if (!this.principalList.some(principal => principal.id === this.form.mgr_no)) {
                this.principalList.push({
                  id: this.form.mgr_no,
                  name: this.form.mgr_no_ext
                });
             }
           });
    },
    closeDialog() {
      this.dialogVisible = false;

      this.$refs["Form"].resetFields();
    },
    cancel() {
      this.closeDialog();
    },
    search() {
      this.$emit('search', this.form);
    },
    submit() {
 
      this.form.insert_user=this.user.id
  
      const api = this.isAddFlag ? addAccessGroup : editAccessGroup;
      this.$refs["Form"].validate((valid) => {
        if (valid) {
          api(this.form)
            .then((res) => {
                
              if (res.Status == 1) {
                this.$notify.success(res.Msg);
                this.form.group_id=res.Data;
                this.search();
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
       }


    },
    

};
</script>

<style lang="scss" scoped>
::v-deep .el-input--small .el-input__inner {
  width: 200px;
}
</style>
