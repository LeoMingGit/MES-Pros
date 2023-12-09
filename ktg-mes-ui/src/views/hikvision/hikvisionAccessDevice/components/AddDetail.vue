<template>
  <div class="app-container2">
    <!--工具栏-->

    <!--表单组件-->
    <el-dialog title="新增設備" :visible.sync="dialogVisible" width="50%"  :before-close="closeDialog"
      :close-on-click-modal="false" @open="handleDialogOpen">
      <el-form ref="Form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="ip地址" label-width="100px" prop="m_id">
          <el-input v-model="form.m_id" />
        </el-form-item>
        <el-form-item label="卡機編號" label-width="100px" prop="mac_no">
          <el-input v-model="form.mac_no" />
        </el-form-item>
        <el-form-item label="卡機名稱" label-width="100px" prop="mac_name">
          <el-input v-model="form.mac_name" />
        </el-form-item>

        <el-form-item label="用途" prop="mac_function" label-width="100px">
          <el-select  ref="refFunction" v-model="form.mac_function" filterable      remote placeholder="请輸入用途名稱"    @change="$forceUpdate()"  
            :remote-method="doQueryFunctionDict" :loading="queryFunctionListLoading">
            <el-option v-for="item in functionList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="廠別" prop="co_name" label-width="100px">
          <el-select  ref="refFactory" v-model="form.co_name" filterable       remote placeholder="请输入廠別名稱"    @change="$forceUpdate()"
            :remote-method="doQueryFactoryDict" :loading="queryFactoryDictLoading">
            <el-option v-for="item in factoryDict" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否啟用" prop="flag" label-width="100px">
          <el-radio-group v-model="form.flag" style="width: 178px">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
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
import { AddHikAccessDevice,  QueryParentFactoryDict, QueryFunctionDict } from '@/api/hikvision/hikvisionAccessDevice'

export default {
  name: 'addDetail',
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
      functionList: [],
      queryFunctionListLoading: false,
      dialogVisible: false,
      rules: {
        m_id: [
          { required: true, message: '請輸入ip地址', trigger: 'blur' }
        ],
        mac_no: [
          { required: true, message: '請輸入卡機編號', trigger: 'blur' }
        ],
        mac_name : [
          { required: true, message: '請輸入卡機名稱', trigger: 'blur' }
        ],
        mac_function : [
          { required: true, message: '請選擇用途', trigger: 'blur' }
        ],
        co_name: [
          { required: true, message: '請輸入廠別', trigger: 'blur' }
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

      QueryParentFactoryDict('').then((res) => {
        if (res.Status == 1) {
          this.factoryDict = res.Data;
        }
      }).catch((err) => {

      });

      QueryFunctionDict('').then((res) => {
        if (res.Status == 1) {
          this.functionList = res.Data;
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
     },
    cancel() {

      this.closeDialog();
    },
    submit() {
      debugger


      this.form.insert_user = this.user.id;
       this.$refs["Form"].validate((valid) => {
        if (valid) {
          AddHikAccessDevice(this.form)
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

    doQueryFactoryDict(query) {
      this.queryFactoryDictLoading = true;
      QueryParentFactoryDict(query).then((res) => {
        this.queryFactoryDictLoading = false;
        if (res.Status == 1) {
          this.factoryDict = res.Data;
        }
      }).catch((err) => {
        this.queryFactoryDictLoading = false;
      }
      );
    },
    doQueryFunctionDict(query) {
      this.queryFunctionListLoading = true;
      QueryFunctionDict(query).then((res) => {
        this.queryFunctionListLoading = false;
        if (res.Status == 1) {
          this.functionList = res.Data;
        }
      }).catch((err) => {
        this.queryFunctionListLoading = false;
      }
      );
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
