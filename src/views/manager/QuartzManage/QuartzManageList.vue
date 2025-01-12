<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.jobName" placeholder="任务名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.jobGroupName" placeholder="群组名称" class="handle-input mr10"></el-input>
        <el-select v-model="query.executeState" placeholder="任务状态" class="handle-select mr10">
          <el-option key="1" label="全部" value=""></el-option>
          <el-option key="1" :label="state.scheduleStateCn" :value="state.scheduleStateEn" v-for="(state,index) in scheduleState"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch" class="search-button">搜索</el-button>
        <el-button type="primary" :icon="Plus" class="search-button" @click="addSchedule">新增</el-button>
        <el-button type="warning" :icon="Bell" class="search-button" @click="resumeAllOfSchedule">全部唤醒</el-button>
        <el-button type="danger" :icon="SwitchButton" class="search-button" @click="stopAllOfSchedule">全部暂停</el-button>
        <el-button type="danger" :icon="Delete" class="search-button" @click="delAllOfSchedule">全部删除</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column  label="ID"  align="center">
          <template #default="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="jobName" label="任务名"  align="center"></el-table-column>
        <el-table-column prop="jobGroupName" label="任务群组"></el-table-column>
        <el-table-column prop="triggerName" label="触发器"></el-table-column>
        <el-table-column prop="triggerGroupName" label="触发器群组"></el-table-column>
        <el-table-column prop="prevFireTime" label="上一次执行时间"></el-table-column>
        <el-table-column prop="nextFireTime" label="下一次执行时间"></el-table-column>
        <el-table-column prop="cronExpression" label="cron表达式"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
                :type="
                scope.row.triggerState === 'ACQUIRED' ? 'success' :
                scope.row.triggerState === 'WAITING' ? 'warning' :
                scope.row.triggerState === 'NORMAL' ? 'success' :
                scope.row.triggerState === 'COMPLETE' ? 'success' :
                scope.row.triggerState === 'NONE' ? 'danger' :
                scope.row.triggerState === 'BLOCKED' ? 'danger' :
                scope.row.triggerState === 'ERROR' ? 'danger' :
                scope.row.triggerState === 'PAUSED' ? 'danger' : ''
                "
            >
              {{scope.row.triggerStateCnName}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" class="bule" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Bell" class="warning" @click="resume(scope.$index,scope.row)" v-permiss="16">
              唤醒
            </el-button>
            <el-button class="red" text :icon="SwitchButton" @click="handleStopSchedule(scope.$index, scope.row)" v-permiss="15">
              暂停
            </el-button>
            <el-button class="green" text :icon="DataAnalysis" @click="handleDetail(scope.$index, scope.row)" v-permiss="15">
              详情
            </el-button>
            <el-button  text :icon="FolderOpened" @click="showLogs(scope.$index, scope.row)" v-permiss="15">
              日志
            </el-button>
            <el-button class="red" text :icon="Delete" @click="del(scope.$index, scope.row)" v-permiss="15">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.size"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog  v-model="editVisible" width="40%">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">修改任务</h4>
        </div>
      </template>
      <el-row :gutter="0">
        <el-col :span="14">
          <el-form label-width="100px">
            <el-form-item label="任务名称">
              <el-input v-model="form.jobName" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="任务组名">
              <el-input v-model="form.jobGroup" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="请求地址">
              <el-input v-model="form.requestMethod"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="requestWay">
              <el-select label="请求接口方式" v-model="form.requestWay">
                <el-option key="1" label="POST" value="POST"></el-option>
                <el-option key="2" label="GET" value="GET"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="cron表达式">
              <el-input v-model="form.jobCron"></el-input>
            </el-form-item>
            <el-form-item label="请求参数">
              <el-input v-model="form.jobDataMap" type="textarea" rows="10"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.jobDescription" type="textarea" rows="5"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="8">
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
          </div>        </el-col>
      </el-row>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定 修 改</el-button>
				</span>
      </template>
    </el-dialog>

  <!-- 详情弹窗-->
       <el-dialog v-model="detailVisible" :show-close="true" width="40%">
         <template #header="{titleId, titleClass }">
           <div class="my-header">
             <h4 :id="titleId" :class="titleClass">任务详情数据</h4>
           </div>
         </template>
         <div class="detailInfo">
           <div>
             <h4>任务名</h4>
             <div class="detailItem">{{jobHttpDetailInfo.jobName}}</div>
           </div>
           <el-divider />
           <div>
             <h4>任务组名</h4>
             <div class="detailItem">{{jobHttpDetailInfo.jobGroupName}}</div>
           </div>
           <el-divider />
           <div>
             <h4>任务描述</h4>
             <div class="detailItem">{{jobHttpDetailInfo.description}}</div>
           </div>
           <el-divider />
           <div>
             <h4>请求地址</h4>
             <div class="detailItem">{{jobHttpDetailInfo.requestMethod}}</div>
           </div>
           <el-divider />
           <div>
             <h4>请求方式</h4>
             <div class="detailItem">{{jobHttpDetailInfo.requestWay}}</div>
           </div>
           <el-divider />
           <div>
             <h4>请求参数</h4>
             <div class="detailItem">{{jobHttpDetailInfo.requestParam}}</div>
           </div>
           <el-divider />
         </div>
         <template #footer>
				<span class="dialog-footer">
					<el-button type="warning" @click="detailVisible = false">关闭 定</el-button>
				</span>
         </template>
       </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElMessageBox,
  ElNotification
} from 'element-plus';
import { Delete, Edit, Search, Plus,SwitchButton,Bell,DataAnalysis,FolderOpened} from '@element-plus/icons-vue';
// import { useRouter } from 'vue-router'
import {
  delSchedule, resumeSchedule, stopSchedule, listSchedule, listScheduleState,
  resumeAllSchedule, stopAllSchedule, updateSchedule, deleteAllSchedule
} from "../../../api/scheduleinfo";
import router from "../../../router";


interface scheduleStateItem{
  scheduleStateEn:string;
  scheduleStateCn:string;
}
const  scheduleState = ref<scheduleStateItem[]>([])
interface jobHttpDetail {
  jobName:string;
  jobGroupName:string;
  requestWay:string;
  requestMethod:string;
  requestParam:string;
  description:string;
}

const jobHttpDetailInfo = reactive({
  jobName : '',
  jobGroupName:'',
  requestWay:'',
  requestMethod:'',
  requestParam:'',
  description:''
})

interface TableItem {
  jobName: string;
  jobDescription: string;
  jobGroupName: string;
  jobClassName: string;
  triggerName: string;
  triggerGroupName:string;
  prevFireTime:string;
  nextFireTime:string;
  cronExpression:string;
  triggerState:string;
  triggerStateCnName:string;
  jobHttpDetailDTO:Array<jobHttpDetail>;
}

const query = reactive({
  jobGroupName: '',
  jobName: '',
  executeState:'',
  userId:'',
  page: 1,
  size: 10
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  listSchedule(query).then(response=>{
    tableData.value = response.data.data.jobDetailInfoDTOList
    pageTotal.value = response.data.data.total
  })
  listScheduleState().then(response=>{
    scheduleState.value = response.data.data
  })
};
getData();

// 查询操作
const handleSearch = () => {
  query.page = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};

// 查看详情操作
const handleDetail = (index: number, row: any) => {
   detailVisible.value = true;
  jobHttpDetailInfo.jobName = row.jobHttpDetailDTO.jobName
  jobHttpDetailInfo.jobGroupName = row.jobHttpDetailDTO.jobGroupName
  jobHttpDetailInfo.requestWay = row.jobHttpDetailDTO.requestWay
  jobHttpDetailInfo.requestMethod = row.jobHttpDetailDTO.requestMethod
  jobHttpDetailInfo.requestParam = row.jobHttpDetailDTO.requestParam
  jobHttpDetailInfo.description = row.jobHttpDetailDTO.description
}
interface delAllJobInterface {
  jobName:string,
  groupName:string
}



const handleDelAndStopAndResume = reactive({
  jobName:"",
  jobGroupName:""
})

const delAllJobParam = reactive({
  jobInfoList:ref<delAllJobInterface[]>([])
})

// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 详情弹窗
const detailVisible = ref(false);
let form = reactive({
  jobCron:'',
  jobName:'',
  jobDescription:'',
  requestWay:'',
  requestMethod:'',
  jobGroup:'',
  jobDataMap:'',
  triggerState:''
});
let idx: number = -1;
//编辑
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.jobCron= row.cronExpression;
  form.jobName=row.jobHttpDetailDTO.jobName;
  form.jobDescription= row.jobHttpDetailDTO.description;
  form.requestWay=row.jobHttpDetailDTO.requestWay;
  form.requestMethod=row.jobHttpDetailDTO.requestMethod;
  form.jobGroup=row.jobHttpDetailDTO.jobGroupName;
  form.jobDataMap=row.jobHttpDetailDTO.requestParam;
  form.triggerState=row.triggerStateCnName;
  editVisible.value = true;
};
//保存编辑
const saveEdit = () => {
  editVisible.value = false;
  //发起修改请求
  updateSchedule(form).then(response=>{
    if(response.data.code == "00000"){
      ElMessage({
        type:'success',
        message:'更新任务信息成功'
      })
    } else {
      ElMessage({
        type:'error',
        message:response.data.msg
      })
    }
  })
  setTimeout(()=>{getData()},2000)
};
//删除
const del = (index: number, row: any)=>{
  handleDelAndStopAndResume.jobName = row.jobName
  handleDelAndStopAndResume.jobGroupName = row.jobGroupName
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        delSchedule(handleDelAndStopAndResume).then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '删除任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}

//唤醒任务
const resume = (index: number, row: any)=>{
  handleDelAndStopAndResume.jobName = row.jobName
  handleDelAndStopAndResume.jobGroupName = row.jobGroupName
  ElMessageBox.confirm('确定要唤醒该任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        resumeSchedule(handleDelAndStopAndResume).then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '唤醒任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}
//暂停任务
const handleStopSchedule = (index: number, row: any)=>{
  handleDelAndStopAndResume.jobName = row.jobName
  handleDelAndStopAndResume.jobGroupName = row.jobGroupName
  ElMessageBox.confirm('确定要暂停该任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        stopSchedule(handleDelAndStopAndResume).then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '暂停任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}

// 查看日志
const showLogs = (index:number,row:any) =>{
  router.push({
    name:"ScheduleLogs",
    params:{
      jobName:row.jobName,
      jobGroupName:row.jobGroupName
    }
  })
}

//增加调度任务
const addSchedule = ()=>{
  router.push("/ScheduleCreate")
}
//唤醒所有调度任务
const resumeAllOfSchedule = ()=>{
  ElMessageBox.confirm('确定要唤醒所有任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        resumeAllSchedule().then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '唤醒所有任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}
//暂停所有调度任务
const stopAllOfSchedule = ()=>{
  ElMessageBox.confirm('确定要暂停所有任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        stopAllSchedule().then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '暂停所有任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}

const delAllOfSchedule = ()=>{
  ElMessageBox.confirm('确定要删除所有任务吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        tableData.value.forEach(form=>{
          const delAllJobRe = reactive<delAllJobInterface>({
            jobName:"",
            groupName:""
          })
          delAllJobRe.jobName = form.jobName
          delAllJobRe.groupName = form.jobGroupName
          delAllJobParam.jobInfoList.push(delAllJobRe)
        })
        deleteAllSchedule(delAllJobParam).then(response => {
          if (response.data.code == "00000") {
            ElMessage({
              type: 'success',
              message: '暂停所有任务成功'
            })
          }
        })
      })
  setTimeout(()=>{getData()},2000)
}
ElNotification({
  type:'success',
  title:'加载调度中心数据成功',
  message:'had loaded schedule list success'
})
</script>

<style scoped>
.container{
  height: 90%;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 15px;
}
.red {
  color: #F56C6C;
}
.bule{
  color:blue;
}
.green{
  color: green;
}
.warning{
  color: orange;
}
.mr10 {
  margin-right: 10px;
}

.search-button{
  height: 30px;
  width: 100px;
}
.detailInfo{
  font-size: 15px;
}
.detailItem{
  margin-top: 20px;
  margin-left: 50px;
}
</style>
