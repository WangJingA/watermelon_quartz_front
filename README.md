# 任务调度中心

### springboot整合quartz的调度中心，实现任务的创建，任务定时执行，日志的记录和查看


For further reference, please consider the following sections:

* 首页
![img.png](img.png)
* 任务列表
![img_1.png](img_1.png)
* 任务创建
![img_2.png](img_2.png)
* 日志信息查看
![img_3.png](img_3.png)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the
parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

