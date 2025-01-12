<template>
  <div>
  <div class="container">
    <div class="handle-box">
      <el-input v-model="query.jobName" placeholder="任务名称" class="handle-input mr10"></el-input>
      <el-input v-model="query.jobGroupName" placeholder="群组名称" class="handle-input mr10"></el-input>
      <el-input v-model="query.jobLogKey" placeholder="日志关键字" class="handle-input mr10"></el-input>
      <el-select v-model="query.executeState" placeholder="执行状态" class="handle-select mr10">
        <el-option key="1" label="全部" value=""></el-option>
        <el-option key="1" label="错误日志" value="0"></el-option>
        <el-option key="2" label="正常日志" value="1"></el-option>
      </el-select>
      <el-button type="primary" :icon="Search" @click="getData" class="search-button">搜索</el-button>
    </div>
    <div>
      <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
      >
        <el-table-column label="任务名称" prop="jobName" width="180" />
        <el-table-column label="任务组名" prop="jobGroupName" width="180" />
        <el-table-column label="执行详情" prop="logMsg" />
        <el-table-column label="执行状态"  width="100">
          <template #default="scope">
            <el-tag
                :type="
                scope.row.executeState === '1' ? 'success' :
                scope.row.executeState === '0' ? 'danger' : ''"
            >
              {{scope.row.executeStateName}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" prop="executeTime" width="180"/>
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
  </div>
  </div>
</template>

<script setup lang="ts">
 import {onMounted, ref, reactive} from "vue";
 import {scheduleLogs} from "../../../api/scheduleinfo";
 import router from "../../../router";
 import {useRouter} from "vue-router";
 import {Search} from "@element-plus/icons-vue";
 import {ElMessage, ElNotification} from "element-plus";

 const query = reactive({
   jobGroupName: '',
   jobName: '',
   executeState:'',
   jobLogKey:'',
   executeBeginTime:'',
   executeEndTime:'',
   userId:'',
   page: 1,
   size: 10
 });

 interface tableItem {
   jobName: string
   jobGroupName: string
   logMsg: string
   executeState: string
   executeTime: string
 }

 const tableRowClassName = ({
                              row,
                              rowIndex,
                            }: {
   row: tableItem
   rowIndex: number
 }) => {
   if (rowIndex === 1) {
     return 'warning-row'
   } else if (rowIndex === 3) {
     return 'success-row'
   }
   return ''
 }
 const tableData = ref<tableItem[]>([])

 const pageTotal = ref(0);
 // 分页导航
 const handlePageChange = (val: number) => {
   query.page = val;
   getData();
 };

 const getData = ()=>{
   const jobName = router.currentRoute.value.params.jobName
   const jobGroupName = router.currentRoute.value.params.jobGroupName
   if (jobName !='' && jobName != null){
     query.jobName = jobName.toString()
   }
   if (jobGroupName !='' && jobGroupName != null){
     query.jobGroupName = jobGroupName.toString()
   }
   scheduleLogs(query).then(response=>{
     tableData.value = response.data.data.jobExecuteLogsInfoDTOS
     pageTotal.value = response.data.data.total
   })
 }
 getData();
 ElNotification({
   type:'success',
   title:'加载调度中心日志成功',
   message:'had loaded schedule logs success'
 })
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.mr10 {
  margin-right: 10px;
}
.search-button{
  height: 30px;
  width: 100px;
}
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
</style>
