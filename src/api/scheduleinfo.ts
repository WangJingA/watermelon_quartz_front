import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

/**
 * 添加调度任务信息
 */
export const addSchedule = (data:any) => {
    return request({
        url: '/quartz/add_java_job',
        method: 'post',
        data:data
    });
};
/**
 * 列举调度任务列表
 */
export const listSchedule = (data:any) => {
    return request({
        url: '/quartz/list_job_details',
        method: 'post',
        data:data
    });
};

/**
 * 调度任务状态下拉框数据
 */
export const listScheduleState = () => {
    return request({
        url: '/quartz/job_state_list',
        method: 'post'
    });
};

/**
 * 更新任务信息
 */
export const updateSchedule = (data:any) => {
    return request({
        url: '/quartz/update_job',
        method: 'post',
        data:data
    });
};


/**
 * 删除任务信息
 */
export const delSchedule = (data:any) => {
    return request({
        url: '/quartz/delete_job',
        method: 'post',
        data:data
    });
};

/**
 * 暂停任务
 */
export const stopSchedule = (data:any) => {
    return request({
        url: '/quartz/pause_job',
        method: 'post',
        data:data
    });
};

/**
 * 唤醒任务
 */
export const resumeSchedule = (data:any) => {
    return request({
        url: '/quartz/resume_job',
        method: 'post',
        data:data
    });
};

/**
 * 唤醒所有任务
 */
export const resumeAllSchedule = () => {
    return request({
        url: '/quartz/resume_all_job',
        method: 'post'
    });
};

/**
 * 暂停所有任务
 */
export const stopAllSchedule = () => {
    return request({
        url: '/quartz/pause_all_job',
        method: 'post'
    });
};

/**
 * 删除所有任务
 */
export const deleteAllSchedule = (data:any) => {
    return request({
        url: '/quartz/delete_all_job',
        method: 'post',
        data:data
    });
};

/**
 * 删除所有任务
 */
export const scheduleLogs = (data:any) => {
    return request({
        url: '/quartz/job_logs',
        method: 'post',
        data:data
    });
};


/**
 * 首页数据展示
 */
export const dashboardData = () => {
    return request({
        url: '/quartz/dash_board',
        method: 'post'
    });
};