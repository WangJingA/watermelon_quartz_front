<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src="imgurl" />
						<div class="user-info-cont">
							<div class="user-info-name">{{ name }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>2022-10-01</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>东莞</span>
					</div>
				</el-card>
				<el-card shadow="hover" style="height: 280px">
					<template #header>
						<div class="clearfix">
							<span>任务详情</span>
						</div>
					</template>
					执行中任务
					<el-progress :percentage=taskAmountAndPercentInfo.executingTaskPercentage color="#42b983"></el-progress>
					等待任务
					<el-progress :percentage=taskAmountAndPercentInfo.waitingTaskPercentage color="#f1e05a"></el-progress>
					阻塞任务
					<el-progress :percentage=taskAmountAndPercentInfo.blockedTaskPercentage></el-progress>
					暂停任务
					<el-progress :percentage=taskAmountAndPercentInfo.pauseTaskPercentage color="#f56c6c"></el-progress>
          执行错误任务
          <el-progress :percentage=taskAmountAndPercentInfo.waitingTaskPercentage color="#f56c6c"></el-progress>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon"><el-icon><Loading /></el-icon></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{taskAmountAndPercentInfo.executingTaskAmount}}</div>
									<div>执行中任务</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><Connection /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{taskAmountAndPercentInfo.waitingTaskAmount}}</div>
									<div>等待任务</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><el-icon><CloseBold /></el-icon></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{taskAmountAndPercentInfo.blockedTaskAmount}}</div>
									<div>阻塞任务</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover" style="height: 420px">
					<template #header>
						<div class="clearfix">
							<span>今日执行项</span>
							<el-button style="float: right; padding: 3px 0" text @click="toAddJob">添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%">
            <el-table-column width="10">
              <template #default="scope">
                {{scope.$index + 1 }}
              </template>
            </el-table-column>
						<el-table-column width="200">
              <template #default="scope">
                <div class="todo-item">
                  {{ scope.row.executeTaskName }}
                </div>
              </template>
						</el-table-column>
						<el-table-column>
              <template #default="scope">
                <div class="todo-item">
                  {{ scope.row.executeNextTime}}
                </div>
              </template>
						</el-table-column>
            <el-table-column>
              <template #default="scope">
                <div class="todo-item">
                  {{ scope.row.executeMemo}}
                </div>
              </template>
            </el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import {reactive, ref} from 'vue';
import imgurl from '../assets/img/img.jpg';
import router from "../router";
import {dashboardData} from "../api/scheduleinfo";


const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';
// 当天执行数据
interface nowDayExecuteInfo{
  executeTaskName:string,
  executeDate:string,
  executeNextTime:string,
  executeMemo:string
}
const todoList = ref<nowDayExecuteInfo[]>([])

// 任务百分比和数据量
interface taskAmountAndPercent{
  executingTaskAmount: string,
  waitingTaskAmount: string,
  blockedTaskAmount: string,
  wrongTaskAmount: string,
  pauseTaskAmount: string,
  executingTaskPercentage: string,
  waitingTaskPercentage: string,
  blockedTaskPercentage: string,
  pauseTaskPercentage: string,
  wrongTaskPercentage: string
}
const taskAmountAndPercentInfo = reactive<taskAmountAndPercent>({
  executingTaskAmount: '',
  waitingTaskAmount: '',
  blockedTaskAmount: '',
  wrongTaskAmount: '',
  pauseTaskAmount: '',
  executingTaskPercentage: '',
  waitingTaskPercentage: '',
  blockedTaskPercentage: '',
  pauseTaskPercentage: '',
  wrongTaskPercentage: ''
})

const toAddJob = ()=>{
  router.push("/ScheduleCreate")
}
const getData = ()=>{
  dashboardData().then(response=>{
     todoList.value = response.data.data.nowDayExecuteTasks
     taskAmountAndPercentInfo.executingTaskAmount = response.data.data.executingTaskAmount
     taskAmountAndPercentInfo.waitingTaskAmount = response.data.data.waitingTaskAmount
     taskAmountAndPercentInfo.blockedTaskAmount = response.data.data.blockedTaskAmount
     taskAmountAndPercentInfo.wrongTaskAmount = response.data.data.wrongTaskAmount
     taskAmountAndPercentInfo.pauseTaskAmount = response.data.data.pauseTaskAmount
     taskAmountAndPercentInfo.executingTaskPercentage = response.data.data.executingTaskPercentage
     taskAmountAndPercentInfo.waitingTaskPercentage = response.data.data.waitingTaskPercentage
     taskAmountAndPercentInfo.blockedTaskPercentage = response.data.data.blockedTaskPercentage
     taskAmountAndPercentInfo.pauseTaskPercentage = response.data.data.pauseTaskPercentage
     taskAmountAndPercentInfo.wrongTaskPercentage = response.data.data.wrongTaskPercentage
  })
}
getData();


</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}
</style>
