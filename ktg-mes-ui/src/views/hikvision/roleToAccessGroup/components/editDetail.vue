<template>
    <div class="app-container2">
      <!--工具栏-->
  
      <!--表单组件-->
      <el-dialog title="編輯角色對應門禁群組" :visible.sync="dialogVisible" width="55%"   
        :before-close="closeDialog" :close-on-click-modal="false"      @open="handleDialogOpen" >
        <el-form ref="Form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="角色編號" prop="role_id" label-width="100px">
          <el-input v-model="form.role_id"  disabled="disabled"/>
        </el-form-item>
        <el-form-item label="角色名稱" prop="role_name" label-width="100px">
          <el-input v-model="form.role_name"  disabled="disabled"/>
        </el-form-item>
        <el-form-item label="門禁編號" prop="group_id" label-width="100px">
          <el-input v-model="form.group_id"  disabled="disabled"/>
        </el-form-item>
        <el-form-item label="門禁名稱" prop="group_name" label-width="100px">
          <el-input v-model="form.group_name"  disabled="disabled"/>
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
  import { UpdateHikRoleToAccessGroup, queryFactoryDict} from '@/api/hikvision/roleToAccessGroup'
  
  export default {
    name: 'editDetail',
    components: { },
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
        dialogVisible: false,
        permission: {
          add: ['ROLE_SYSTEM_DEFAULT']
        },
        rules: {
          role_id: [
            { required: true, message: '請輸入角色ID', trigger: 'blur' }
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
   
  
     },
     handleDialogOpen(){

     },
  
      closeDialog() {
        debugger
        this.dialogVisible = false;
        this.$refs["Form"].resetFields();
       },
      cancel() {
        this.closeDialog();
      },
      submit() {
         
        this.form.insert_user = this.user.id;
         this.$refs["Form"].validate((valid) => {
         if (valid) {
          UpdateHikRoleToAccessGroup(this.form)
              .then((res) => {
                if (res.Status == 1) {
                   this.$notify.success(res.Msg);
                   this.$emit('editDetailRefresh', this.form)
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
      show() {
            this.dialogVisible = true;
          
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
  