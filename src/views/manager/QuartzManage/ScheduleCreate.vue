<template>
  <div class="container">
    <el-row gutter="2">
      <el-col :span="12">
        <div class="form-box">
          <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName"></el-input>
            </el-form-item>
            <el-form-item label="任务组名" prop="jobGroup">
              <el-input v-model="form.jobGroup"></el-input>
            </el-form-item>
            <el-form-item label="请求接口方式" prop="requestWay">
              <el-select label="请求接口方式" v-model="form.requestWay">
                <el-option key="1" label="POST" value="POST"></el-option>
                <el-option key="2" label="GET" value="GET"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求接口地址" prop="requestMethod">
              <el-input v-model="form.requestMethod"></el-input>
            </el-form-item>
            <el-form-item label="Cron表达式" prop="jobCron">
              <el-input v-model="form.jobCron"></el-input>
            </el-form-item>
            <el-form-item label="请求接口参数">
              <el-input type="textarea" rows="5" v-model="form.jobDataMap"></el-input>
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input type="textarea" rows="5" v-model="form.jobDescription"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(formRef)">创建任务</el-button>
              <el-button @click="onReset(formRef)">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
          <div>
            <p style="margin-bottom: 20px">调度任务注意事项：</p>
            <p style="margin-bottom: 20px">
              1. 任务名称一般使用英文名称，任务组名为自定义组名，可以使用调用接口的服务作为组名，请求接口方式为调用的接口请求方式。
            </p>
            <p style="margin-bottom: 20px">
              2. 请求接口地址为域名+地址的方式请求，例如：http://localhost:7777/test_job/test_quartz_job。
            </p>
            <p style="margin-bottom: 20px">
              3. Cron表达式为调度的时间，格式为：* * * * * ?，分别为秒，分，时，天，周，月，年。
            </p>
            <p style="margin-bottom: 20px">
              4. 请求接口的参数为Json格式，默认为空传：{}，请按照以下格式输入。
            </p>
            <p style="margin-bottom: 20px">
              <div>{</div>
              <div>&nbsp;&nbsp;\"testDTOList\":</div>
              <div>&nbsp;&nbsp;&nbsp;[</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</div>
              <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"jobName\": \"test\",</div>
              <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"jobPath\": \"test\",</div>
              <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"jobCron\": \"88888\"</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</div>
              <div>&nbsp;&nbsp;&nbsp;]</div>
              <div>}</div>
            </p>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" >
import {onMounted, reactive, ref} from 'vue';
import {
  ElMessage,
  ElNotification,
  FormInstance,
  FormRules,
  genFileId,
  UploadInstance,
  UploadRawFile
} from 'element-plus';
import type { UploadProps } from 'element-plus'
import {addSchedule, addSchool} from "../../../api/scheduleinfo";
import router from "../../../router";

//表单校验
const rules: FormRules = {
  requestWay: [{ required: true, message: '请输入请求接口方式', trigger: 'blur' }],
  requestMethod: [{ required: true, message: '请输入请求接口方法地址', trigger: 'blur' }],
  jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  jobCron: [{ required: true, message: '请输入任务执行时间', trigger: 'blur' }],
  jobGroup: [{ required: true, message: '请输入任务组名', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  requestWay:'',
  requestMethod:'',
  jobName:'',
  jobCron:'',
  jobDescription:'',
  jobDataMap:'',
  jobGroup:'',
});

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(form);
      addSchedule(form).then(response=>{
        if (response.data.code == "00000"){
          form.jobCron = ''
          form.requestWay = ''
          form.requestMethod = ''
          form.jobName = ''
          form.jobDescription = ''
          form.jobDataMap = ''
          form.jobGroup = ''
          ElMessage.success('新增调度任务成功！');
          router.push("/QuartzManageList")
        } else {
          ElMessage.error(response.data.data);
        }
        if(response.data.code == "500"){
          ElMessage.success('您的操作太快了,请稍后重试！');
        }
          console.log(response.data.data)
      })
    } else {
      return false;
    }
  });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(()=>{
  ElNotification({
    title:'请开始任务创建',
    message:'please start create schedule',
    type:'success'
  })
})
</script>
<style scoped>
.select-input{
  width: 600px;
}
.form-box {
  width: 600px;
  font-size: 18px;
}
</style>
