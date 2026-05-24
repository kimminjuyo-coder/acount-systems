import React, { useState } from 'react';
import './App.css';
import { calculateSettlement } from './utils/billing.js';

// Pre-populated Mock Database (Expanded to support multiple months and years)
const INITIAL_USERS = [
  { id: 1, username: 'admin', name: '김관리', role: 'ADMIN', email: 'admin@hankookresearch.com', contact: '010-1234-5678' },
  { id: 2, username: 'pic_kmj', name: '김민정', role: 'PIC', email: 'mj.kim@hankookresearch.com', contact: '010-2345-6789' },
  { id: 3, username: 'pic_lyh', name: '이영희', role: 'PIC', email: 'yh.lee@hankookresearch.com', contact: '010-3456-7890' },
  
  // Workers (Scripters)
  { id: 4, username: 'worker_s1', name: '스크립터1', role: 'WORKER', email: 'scripter1@gmail.com', contact: '010-9001-0001', scripterId: '38202', canFgd: true, canInterview: false, specialty: 'FGD_ONLY', specialtyText: '좌담회 전용' },
  { id: 5, username: 'worker_s2', name: '스크립터2', role: 'WORKER', email: 'scripter2@gmail.com', contact: '010-9001-0002', scripterId: '18061', canFgd: true, canInterview: true, specialty: 'MEDICAL', specialtyText: '의학 조사 주선' },
  { id: 6, username: 'worker_s3', name: '스크립터3', role: 'WORKER', email: 'scripter3@gmail.com', contact: '010-9001-0003', scripterId: '6402', canFgd: true, canInterview: true, specialty: 'GENERAL', specialtyText: '일반' },
  { id: 7, username: 'worker_s4', name: '스크립터4', role: 'WORKER', email: 'scripter4@gmail.com', contact: '010-9001-0004', scripterId: '19143', canFgd: true, canInterview: true, specialty: 'INTERVIEW', specialtyText: '인터뷰 위주' },
  { id: 8, username: 'worker_s5', name: '스크립터5', role: 'WORKER', email: 'scripter5@gmail.com', contact: '010-9001-0005', scripterId: '31824', canFgd: true, canInterview: true, specialty: 'GENERAL', specialtyText: '일반' },
  { id: 9, username: 'worker_s6', name: '스크립터6', role: 'WORKER', email: 'scripter6@gmail.com', contact: '010-9001-0006', scripterId: '35991', canFgd: true, canInterview: true, specialty: 'GENERAL', specialtyText: '일반' }
];

const INITIAL_PROJECTS = [
  // Spread across different months and years to demonstrate cumulative bar charts
  { id: 12, projectNo: '2025-36-0099', name: '2025년 결산 FGD', picId: 2, field: 'IT', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2025-12-10' },
  
  { id: 4, projectNo: '2026-36-0101', name: 'IT 모바일 사용성 Depth', picId: 2, field: 'IT', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2026-01-10' },
  { id: 5, projectNo: '2026-36-0301', name: '정치 여론 FGD 조사', picId: 3, field: '정치', totalTasksCount: 2, status: 'COMPLETED', createdAt: '2026-03-05' },
  { id: 6, projectNo: '2026-36-0401', name: '금융 뱅킹 앱 Depth', picId: 2, field: '금융', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2026-04-12' },
  
  { id: 1, projectNo: '2025-36-0261', name: '전동창호 FGD', picId: 2, field: '가전', totalTasksCount: 6, status: 'IN_PROGRESS', createdAt: '2026-05-20' },
  { id: 2, projectNo: '2025-36-0262', name: '의학 신약 개발 FGD', picId: 3, field: '의학', totalTasksCount: 4, status: 'IN_PROGRESS', createdAt: '2026-05-22' },
  { id: 3, projectNo: '2025-36-0263', name: '신기술 AI Depth Interview', picId: 2, field: 'IT', totalTasksCount: 3, status: 'COMPLETED', createdAt: '2026-05-18' },
  
  { id: 7, projectNo: '2026-36-0601', name: '가전 로봇청소기 FGD', picId: 3, field: '가전', totalTasksCount: 2, status: 'IN_PROGRESS', createdAt: '2026-06-18' },
  { id: 8, projectNo: '2026-36-0701', name: '식품 간편식 만족도 FGD', picId: 2, field: '식품', totalTasksCount: 1, status: 'IN_PROGRESS', createdAt: '2026-07-25' },
  { id: 9, projectNo: '2026-36-0901', name: 'IT 자율주행 Depth', picId: 3, field: 'IT', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2026-09-08' },
  { id: 10, projectNo: '2026-36-1101', name: '식품 밀키트 FGD 조사', picId: 2, field: '식품', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2026-11-15' },
  { id: 11, projectNo: '2026-36-1201', name: '금융 증권사 FGD 조사', picId: 3, field: '금융', totalTasksCount: 1, status: 'COMPLETED', createdAt: '2026-12-05' }
];

const INITIAL_TASKS = [
  // 2025 Tasks
  { id: 1201, projectId: 12, workerId: 6, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2025-12-15' },
  
  // 2026 Q1-Q2 Tasks
  { id: 401, projectId: 4, workerId: 7, taskType: 'DEPTH', durationMinutes: 95, roundedMinutes: 90, cost: 42500, status: 'COMPLETED', submittedAt: '2026-01-15' },
  { id: 501, projectId: 5, workerId: 6, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-03-10' },
  { id: 502, projectId: 5, workerId: 8, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-03-12' },
  { id: 601, projectId: 6, workerId: 7, taskType: 'DEPTH', durationMinutes: 55, roundedMinutes: 60, cost: 35000, status: 'COMPLETED', submittedAt: '2026-04-18' },

  // Project 1 (May)
  { id: 101, projectId: 1, workerId: 4, taskType: 'FGD', durationMinutes: 72, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-05-20' },
  { id: 102, projectId: 1, workerId: 4, taskType: 'FGD', durationMinutes: 78, roundedMinutes: 90, cost: 70000, status: 'COMPLETED', submittedAt: '2026-05-21' },
  { id: 103, projectId: 1, workerId: 6, taskType: 'FGD', durationMinutes: 135, roundedMinutes: 150, cost: 90000, status: 'COMPLETED', submittedAt: '2026-05-22' },
  { id: 104, projectId: 1, workerId: 8, taskType: 'FGD', durationMinutes: 100, roundedMinutes: 90, cost: 70000, status: 'COMPLETED', submittedAt: '2026-05-23' },
  { id: 105, projectId: 1, workerId: 6, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'ASSIGNED', submittedAt: null },
  { id: 106, projectId: 1, workerId: null, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'READY', submittedAt: null },

  // Project 2 (May)
  { id: 201, projectId: 2, workerId: 5, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-05-23' },
  { id: 202, projectId: 2, workerId: 5, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'ASSIGNED', submittedAt: null },
  { id: 203, projectId: 2, workerId: null, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'READY', submittedAt: null },
  { id: 204, projectId: 2, workerId: null, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'READY', submittedAt: null },

  // Project 3 (May)
  { id: 301, projectId: 3, workerId: 7, taskType: 'DEPTH', durationMinutes: 95, roundedMinutes: 90, cost: 42500, status: 'COMPLETED', submittedAt: '2026-05-18' },
  { id: 302, projectId: 3, workerId: 7, taskType: 'DEPTH', durationMinutes: 55, roundedMinutes: 60, cost: 35000, status: 'COMPLETED', submittedAt: '2026-05-19' },
  { id: 303, projectId: 3, workerId: 7, taskType: 'DEPTH', durationMinutes: 125, roundedMinutes: 120, cost: 50000, status: 'COMPLETED', submittedAt: '2026-05-19' },
  
  // 2026 Q3-Q4 Tasks
  { id: 701, projectId: 7, workerId: 5, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-06-25' },
  { id: 702, projectId: 7, workerId: null, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'READY', submittedAt: null },
  { id: 801, projectId: 8, workerId: 6, taskType: 'FGD', durationMinutes: 0, roundedMinutes: 0, cost: 0, status: 'ASSIGNED', submittedAt: null },
  { id: 901, projectId: 9, workerId: 7, taskType: 'DEPTH', durationMinutes: 120, roundedMinutes: 120, cost: 50000, status: 'COMPLETED', submittedAt: '2026-09-15' },
  { id: 1001, projectId: 10, workerId: 8, taskType: 'FGD', durationMinutes: 65, roundedMinutes: 60, cost: 60000, status: 'COMPLETED', submittedAt: '2026-11-20' },
  { id: 1101, projectId: 11, workerId: 6, taskType: 'FGD', durationMinutes: 80, roundedMinutes: 90, cost: 70000, status: 'COMPLETED', submittedAt: '2026-12-10' }
];

export default function App() {
  // State for mock database
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [currentUser, setCurrentUser] = useState(users[1]); // Default to 김민정 (PIC)
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('projects'); 
  // Mobile responsive menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };
  
  // Collapsed/Expanded projects state (key: project ID, val: boolean)
  const [expandedProjects, setExpandedProjects] = useState({ 1: true });

  // Admin Account management sub-tabs: 'PIC' vs 'WORKER'
  const [adminUserTab, setAdminUserTab] = useState('PIC');

  // Requirement #4: Collapsible Admin PM Table (Scripter table is converted to popup modal, so only PM table needs state, but we can keep scripter table state just in case)
  const [adminPmTableExpanded, setAdminPmTableExpanded] = useState(true);

  // Cumulative Projects Year and Hover states
  const [selectedChartYear, setSelectedChartYear] = useState(2026);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Requirement #5: Monthly filter for scripter earnings chart
  const [selectedScripterMonth, setSelectedScripterMonth] = useState('ALL');

  // PM Summary Table Monthly Filter
  const [selectedPmMonth, setSelectedPmMonth] = useState('ALL');

  // Project Monitoring In Progress / Completed sub tab state
  const [projectSubTab, setProjectSubTab] = useState('IN_PROGRESS');

  // Requirement #6: Selected Scripter Detail Popup Modal state
  const [selectedScripterDetail, setSelectedScripterDetail] = useState(null);

  // Form states
  const [newProject, setNewProject] = useState({ projectNo: '', name: '', field: 'IT', totalTasksCount: 1 });
  const [newScripter, setNewScripter] = useState({ name: '', email: '', contact: '', scripterId: '', canFgd: true, canInterview: true, specialty: 'GENERAL' });
  const [newPic, setNewPic] = useState({ name: '', email: '', contact: '', username: '' });
  
  // Assignment overlay modal states
  const [assigningTask, setAssigningTask] = useState(null);
  
  // Submission modal states (minutes-only)
  const [submittingTask, setSubmittingTask] = useState(null);
  const [inputDuration, setInputDuration] = useState({ minutes: '' });
  const [liveCalc, setLiveCalc] = useState({ roundedMinutes: 0, cost: 0 });

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput) return alert('접속 ID를 입력해주세요.');
    const user = users.find(u => u.username.toLowerCase() === loginInput.trim().toLowerCase());
    if (!user) {
      alert('등록되지 않은 접속 ID입니다. 예시 계정 힌트를 클릭해 로그인해보세요.');
      return;
    }
    setCurrentUser(user);
    setIsLoggedIn(true);
    // Set default active tab
    if (user.role === 'ADMIN') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('projects');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginInput('');
  };

  // Toggle Project collapse
  const toggleProjectExpand = (projId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projId]: !prev[projId]
    }));
  };

  // Calculate Scripter Workload Helper (Current weekly assignments)
  const getScripterWorkload = (workerId) => {
    const workerTasks = tasks.filter(t => t.workerId === workerId);
    const fgdCount = workerTasks.filter(t => t.taskType === 'FGD').length;
    const depthCount = workerTasks.filter(t => t.taskType === 'DEPTH').length;
    return { fgdCount, depthCount };
  };

  // Add Project
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.projectNo || !newProject.name) return alert('프로젝트 번호와 명칭을 입력해주세요.');

    const newProjObj = {
      id: Date.now(),
      projectNo: newProject.projectNo,
      name: newProject.name,
      picId: currentUser.id,
      field: newProject.field,
      totalTasksCount: Number(newProject.totalTasksCount),
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Auto-generate empty tasks for this project
    const newTasksList = [];
    for (let i = 1; i <= newProjObj.totalTasksCount; i++) {
      newTasksList.push({
        id: Date.now() + i,
        projectId: newProjObj.id,
        workerId: null,
        taskType: newProjObj.field === '의학' ? 'FGD' : 'DEPTH', 
        durationMinutes: 0,
        roundedMinutes: 0,
        cost: 0,
        status: 'READY',
        submittedAt: null
      });
    }

    setProjects([...projects, newProjObj]);
    setTasks([...tasks, ...newTasksList]);
    setExpandedProjects(prev => ({ ...prev, [newProjObj.id]: true })); 
    setNewProject({ projectNo: '', name: '', field: 'IT', totalTasksCount: 1 });
  };

  // Delete Project
  const handleDeleteProject = (projId) => {
    if (window.confirm('정말 이 프로젝트를 삭제하시겠습니까? 관련 모든 작업도 함께 삭제됩니다.')) {
      setProjects(projects.filter(p => p.id !== projId));
      setTasks(tasks.filter(t => t.projectId !== projId));
    }
  };

  // Toggle Project Status (Requirement #2)
  const handleToggleProjectStatus = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextStatus = p.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Delete Unassigned Task (READY status)
  const handleDeleteTask = (taskId, projId) => {
    if (window.confirm('이 배정되지 않은 대기 작업을 삭제하시겠습니까? 프로젝트 전체 작업 수가 1 감소합니다.')) {
      setTasks(tasks.filter(t => t.id !== taskId));
      setProjects(projects.map(p => {
        if (p.id === projId) {
          return { ...p, totalTasksCount: p.totalTasksCount - 1 };
        }
        return p;
      }));
    }
  };

  // Assign Task
  const handleAssignTask = (workerId) => {
    if (!assigningTask) return;
    
    const scripter = users.find(u => u.id === workerId);
    
    // Rule: Scripter 1 FGD only
    if (assigningTask.taskType === 'DEPTH' && scripter.specialty === 'FGD_ONLY') {
      if (!window.confirm('경고: 이 스크립터는 좌담회 전용입니다. 그래도 배정하시겠습니까?')) {
        return;
      }
    }

    const updatedTasks = tasks.map(t => {
      if (t.id === assigningTask.id) {
        return { ...t, workerId, status: 'ASSIGNED' };
      }
      return t;
    });

    setTasks(updatedTasks);
    setAssigningTask(null);
  };

  // Submit Task Duration (minutes-only)
  const openSubmitModal = (task) => {
    setSubmittingTask(task);
    setInputDuration({ minutes: '' });
    setLiveCalc({ roundedMinutes: 0, cost: 0 });
  };

  const handleDurationChange = (val) => {
    const nextMinutes = val;
    setInputDuration({ minutes: nextMinutes });
    
    // Live calculation
    if (nextMinutes !== '') {
      const calc = calculateSettlement({
        taskType: submittingTask.taskType,
        minutes: Number(nextMinutes)
      });
      setLiveCalc(calc);
    }
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!inputDuration.minutes) return alert('녹취 시간을 입력해주세요.');

    const calc = calculateSettlement({
      taskType: submittingTask.taskType,
      minutes: Number(inputDuration.minutes)
    });

    const updatedTasks = tasks.map(t => {
      if (t.id === submittingTask.id) {
        return {
          ...t,
          durationMinutes: Number(inputDuration.minutes),
          roundedMinutes: calc.roundedMinutes,
          cost: calc.cost,
          status: 'COMPLETED',
          submittedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    setSubmittingTask(null);
  };

  // Account Creation
  const handleCreateAccount = (e) => {
    e.preventDefault();
    const isWorker = adminUserTab === 'WORKER';
    if (isWorker) {
      if (!newScripter.name || !newScripter.scripterId) return alert('스크립터 이름과 ID를 입력해주세요.');
      const newScripterUser = {
        id: Date.now(),
        username: `worker_${newScripter.scripterId}`,
        name: newScripter.name,
        role: 'WORKER',
        email: newScripter.email || 'scripter@hankookresearch.com',
        contact: newScripter.contact || '010-0000-0000',
        scripterId: newScripter.scripterId,
        canFgd: newScripter.canFgd,
        canInterview: newScripter.canInterview,
        specialty: newScripter.specialty,
        specialtyText: newScripter.specialty === 'FGD_ONLY' ? '좌담회 전용' : newScripter.specialty === 'MEDICAL' ? '의학 조사 주선' : newScripter.specialty === 'INTERVIEW' ? '인터뷰 위주' : '일반'
      };
      setUsers([...users, newScripterUser]);
      setNewScripter({ name: '', email: '', contact: '', scripterId: '', canFgd: true, canInterview: true, specialty: 'GENERAL' });
    } else {
      if (!newPic.name || !newPic.username) return alert('담당자 이름과 아이디를 입력해주세요.');
      const newPicUser = {
        id: Date.now(),
        username: newPic.username,
        name: newPic.name,
        role: 'PIC',
        email: newPic.email || 'pm@hankookresearch.com',
        contact: newPic.contact || '010-0000-0000'
      };
      setUsers([...users, newPicUser]);
      setNewPic({ name: '', email: '', contact: '', username: '' });
    }
  };

  // Account Deletion
  const handleDeleteUser = (id) => {
    if (window.confirm('정말 이 계정을 삭제하시겠습니까?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Excel (CSV) Download Helper (Sum Row included)
  const downloadExcel = (data, filename, totalCostSum = null) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push('\ufeff' + headers.join(',')); // Add UTF-8 BOM

    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // Append total row at the very bottom
    if (totalCostSum !== null) {
      const totalRow = headers.map(header => {
        if (header.includes('비용') || header.includes('금액')) {
          return `"합계: ₩${totalCostSum.toLocaleString()}"`;
        }
        if (header === headers[0]) {
          return `"합계"`;
        }
        return `""`;
      });
      csvRows.push(totalRow.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleDownloadProjectSummary = (proj) => {
    const projectTasks = tasks.filter(t => t.projectId === proj.id);
    const completedTasksList = projectTasks.filter(t => t.status === 'COMPLETED');
    const totalProjCost = completedTasksList.reduce((sum, t) => sum + t.cost, 0);

    const downloadData = projectTasks.map((t, idx) => {
      const worker = users.find(u => u.id === t.workerId);
      return {
        '작업 순번': idx + 1,
        '프로젝트 번호': proj.projectNo,
        '프로젝트 명': proj.name,
        '작업 종류': t.taskType === 'FGD' ? '좌담회' : '인터뷰(Depth)',
        '스크립터 ID': worker ? worker.scripterId : '미지정',
        '스크립터 이름': worker ? worker.name : '미지정',
        '실제 재생 시간': t.status === 'COMPLETED' ? `${t.durationMinutes}분` : '미제출',
        '정산 반영 시간': t.status === 'COMPLETED' ? `${t.roundedMinutes}분` : '미제출',
        '산출 비용 (원)': t.status === 'COMPLETED' ? t.cost : 0,
        '상태': t.status === 'COMPLETED' ? '완료' : t.status === 'ASSIGNED' ? '진행중' : '대기'
      };
    });
    downloadExcel(downloadData, `프로젝트_${proj.projectNo}_정산`, totalProjCost);
  };

  const handleDownloadAllAdmin = () => {
    const completedTasksList = tasks.filter(t => t.status === 'COMPLETED');
    const totalCostOverall = completedTasksList.reduce((sum, t) => sum + t.cost, 0);

    const downloadData = tasks.map((t, idx) => {
      const proj = projects.find(p => p.id === t.projectId);
      const worker = users.find(u => u.id === t.workerId);
      const pic = users.find(u => u.id === proj?.picId);
      return {
        '일련번호': idx + 1,
        '프로젝트 번호': proj?.projectNo || 'N/A',
        '프로젝트 명': proj?.name || 'N/A',
        '담당 PM': pic?.name || 'N/A',
        '작업 구분': t.taskType === 'FGD' ? '좌담회' : '인터뷰(Depth)',
        '스크립터 ID': worker?.scripterId || 'N/A',
        '스크립터 이름': worker?.name || '미배정',
        '정산 시간': t.status === 'COMPLETED' ? `${t.roundedMinutes}분` : '-',
        '정산 비용': t.status === 'COMPLETED' ? t.cost : 0,
        '상태': t.status
      };
    });
    downloadExcel(downloadData, `전체_정산마스터데이터`, totalCostOverall);
  };

  // Helper values for active role
  const isPIC = currentUser.role === 'PIC';
  const isWorker = currentUser.role === 'WORKER';
  const isAdmin = currentUser.role === 'ADMIN';

  // Filters display projects
  const myProjects = projects.filter(p => p.picId === currentUser.id);
  const displayProjects = isAdmin ? projects : isPIC ? myProjects : projects.filter(p => tasks.some(t => t.projectId === p.id && t.workerId === currentUser.id));
  
  // Completed lists
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const workerCompletedTasks = completedTasks.filter(t => t.workerId === currentUser.id);
  const workerAssignedTasks = tasks.filter(t => t.workerId === currentUser.id && t.status === 'ASSIGNED');
  
  // Total costs calculations
  const totalCostOverall = completedTasks.reduce((sum, t) => sum + t.cost, 0);
  const totalCostPIC = completedTasks.filter(t => {
    const proj = projects.find(p => p.id === t.projectId);
    return proj?.picId === currentUser.id;
  }).reduce((sum, t) => sum + t.cost, 0);
  
  const totalCostWorker = workerCompletedTasks.reduce((sum, t) => sum + t.cost, 0);

  // Requirement #2: Annual cumulative projects calculation (for the annual stats widget)
  const annualProjects = projects.filter(p => p.createdAt?.startsWith(String(selectedChartYear)));
  const annualProjCount = annualProjects.length;
  
  const annualProjIds = annualProjects.map(p => p.id);
  const annualTaskCost = tasks
    .filter(t => annualProjIds.includes(t.projectId) && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.cost, 0);

  // Requirement #5: Monthly filter for Scripter earnings chart
  const scripterStats = users.filter(u => u.role === 'WORKER').map(w => {
    const prefix = selectedScripterMonth === 'ALL' 
      ? `${selectedChartYear}` 
      : `${selectedChartYear}-${selectedScripterMonth}`;
      
    const workerTasks = tasks.filter(t => {
      const proj = projects.find(p => p.id === t.projectId);
      return t.workerId === w.id && t.status === 'COMPLETED' && t.submittedAt?.startsWith(prefix);
    });
    const totalEarnings = workerTasks.reduce((sum, t) => sum + t.cost, 0);
    const completedCount = workerTasks.length;
    return { id: w.id, name: w.name, scripterId: w.scripterId, totalEarnings, completedCount };
  });

  const maxScripterEarnings = Math.max(...scripterStats.map(s => s.totalEarnings), 1);

  // Monthly cumulative projects calculation grouped by year
  const getMonthlyChartData = (year) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
    const data = months.map(m => {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      const prefix = `${year}-${monthStr}`;
      
      const filteredProj = projects.filter(p => p.createdAt?.startsWith(prefix));
      const projCount = filteredProj.length;
      
      const projIds = filteredProj.map(p => p.id);
      const completedTasksForMonth = tasks.filter(t => projIds.includes(t.projectId) && t.status === 'COMPLETED');
      const completedCount = completedTasksForMonth.length;
      
      const costForMonth = completedTasksForMonth.reduce((sum, t) => sum + t.cost, 0);
      
      return {
        month: m,
        projCount,
        completedCount,
        totalCost: costForMonth
      };
    });
    return data;
  };

  const monthlyChartData = getMonthlyChartData(selectedChartYear);
  const maxProjInAnyMonth = Math.max(...monthlyChartData.map(d => d.projCount), 1);

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="login-overlay">
        <div className="glass-card login-card animated-fade-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="logo-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>T</div>
          </div>
          <h1 className="login-title">Trans-Helper</h1>
          <p className="login-subtitle">한국리서치 녹취 배정 및 자동 정산 포털</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">접속 ID 입력</label>
              <input className="form-input" type="text" placeholder="아이디를 입력하세요 (예: admin)" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '10px', height: '45px' }}>
              로그인
            </button>
          </form>

          <div className="login-helper-box">
            <div className="login-helper-title">빠른 테스트 계정 힌트 (클릭 시 자동 입력)</div>
            <div className="login-hints">
              <div className="hint-chip" onClick={() => setLoginInput('admin')}>
                <span>🛡️ <strong>김관리</strong> (최고 관리자)</span>
                <code>admin</code>
              </div>
              <div className="hint-chip" onClick={() => setLoginInput('pic_kmj')}>
                <span>💼 <strong>김민정 PM</strong> (설계 책임자)</span>
                <code>pic_kmj</code>
              </div>
              <div className="hint-chip" onClick={() => setLoginInput('pic_lyh')}>
                <span>💼 <strong>이영희 PM</strong> (담당자)</span>
                <code>pic_lyh</code>
              </div>
              <div className="hint-chip" onClick={() => setLoginInput('worker_s2')}>
                <span>✍️ <strong>스크립터2</strong> (의학 전문)</span>
                <code>worker_s2</code>
              </div>
              <div className="hint-chip" onClick={() => setLoginInput('worker_s4')}>
                <span>✍️ <strong>스크립터4</strong> (인터뷰 위주)</span>
                <code>worker_s4</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Mobile Top Header Bar (Only visible on screens <= 900px) */}
      <div className="mobile-top-bar">
        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="logo-section" style={{ margin: 0, border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="logo-icon" style={{ width: '30px', height: '30px', fontSize: '1rem' }}>T</div>
          <div className="logo-text" style={{ fontSize: '1.15rem' }}>Trans-Helper</div>
        </div>
        <div style={{ width: '24px' }}></div> {/* Spacer for symmetry */}
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="logo-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="logo-icon">T</div>
              <div className="logo-text">Trans-Helper</div>
            </div>
            {/* Close button for mobile menu */}
            <button className="close-btn mobile-only" onClick={() => setMobileMenuOpen(false)} style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer', padding: '0 5px', lineHeight: 1 }}>
              ×
            </button>
          </div>
          
          <nav className="nav-menu">
            {isAdmin && (
              <>
                <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('dashboard')}>
                  📊 종합 대시보드
                </div>
                <div className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleNavClick('projects')}>
                  📂 프로젝트 모니터링
                </div>
                <div className={`nav-item ${activeTab === 'settlement' ? 'active' : ''}`} onClick={() => handleNavClick('settlement')}>
                  💰 전체 정산 마스터
                </div>
                <div className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => handleNavClick('accounts')}>
                  👨‍💼 계정 관리
                </div>
              </>
            )}
            
            {isPIC && (
              <>
                <div className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleNavClick('projects')}>
                  📂 내 프로젝트
                </div>
                <div className={`nav-item ${activeTab === 'scripters' ? 'active' : ''}`} onClick={() => handleNavClick('scripters')}>
                  👥 스크립터 현황
                </div>
              </>
            )}
            
            {isWorker && (
              <>
                <div className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleNavClick('projects')}>
                  📋 내 배정 작업
                </div>
                <div className={`nav-item ${activeTab === 'settlement' ? 'active' : ''}`} onClick={() => handleNavClick('settlement')}>
                  💳 정산 및 실적
                </div>
              </>
            )}
          </nav>
        </div>

        {/* User profile section & Logout button */}
        <div className="user-profile-section">
          <div className="user-avatar-info">
            <div className="avatar">
              {currentUser.name[0]}
            </div>
            <div className="user-meta">
              <span className="user-name">{currentUser.name}</span>
              <span className={`badge ${isAdmin ? 'badge-admin' : isPIC ? 'badge-pic' : 'badge-worker'}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem' }} onClick={handleLogout}>
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-panel">
        <header className="top-header">
          <div>
            <h1>{isAdmin ? '관리자 컨트롤타워' : isPIC ? '담당자 워크스페이스' : '스크립터 대시보드'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              한국리서치 녹취 배정 및 자동 정산 프로세스 모형
            </p>
          </div>
          
        </header>

        {/* Statistics Grid */}
        <section className="stats-grid">
          {isAdmin && (
            <>
              <div className="glass-card stats-card">
                <div className="stats-label">전체 등록 프로젝트</div>
                <div className="stats-value">{projects.length} 건</div>
              </div>
              <div className="glass-card stats-card secondary">
                <div className="stats-label">프로젝트 진행 현황 (진행/완료)</div>
                <div className="stats-value" style={{ fontSize: '1.4rem', fontWeight: 'bold', paddingTop: '5px' }}>
                  ⏳ {projects.filter(p => p.status === 'IN_PROGRESS').length}건 / ✅ {projects.filter(p => p.status === 'COMPLETED').length}건
                </div>
              </div>
              <div className="glass-card stats-card">
                <div className="stats-label">스크립터 총 작업 수량 (완료)</div>
                <div className="stats-value">{completedTasks.length} 건</div>
              </div>
              <div className="glass-card stats-card success">
                <div className="stats-label">누적 총 정산 비용</div>
                <div className="stats-value">₩{totalCostOverall.toLocaleString()}</div>
              </div>
            </>
          )}

          {isPIC && (
            <>
              <div className="glass-card stats-card">
                <div className="stats-label">담당 진행 프로젝트</div>
                <div className="stats-value">{myProjects.length} 건</div>
              </div>
              <div className="glass-card stats-card secondary">
                <div className="stats-label">진행 중인 프로젝트</div>
                <div className="stats-value">
                  {myProjects.filter(p => p.status === 'IN_PROGRESS').length} 건
                </div>
              </div>
              <div className="glass-card stats-card success">
                <div className="stats-label">본인 프로젝트 정산 금액</div>
                <div className="stats-value">₩{totalCostPIC.toLocaleString()}</div>
              </div>
            </>
          )}

          {isWorker && (
            <>
              <div className="glass-card stats-card">
                <div className="stats-label">진행중 배정 작업</div>
                <div className="stats-value">{workerAssignedTasks.length} 건</div>
              </div>
              <div className="glass-card stats-card secondary">
                <div className="stats-label font-bold">완료한 총 작업</div>
                <div className="stats-value">{workerCompletedTasks.length} 건</div>
              </div>
              <div className="glass-card stats-card success">
                <div className="stats-label">이달 예상 정산액</div>
                <div className="stats-value">₩{totalCostWorker.toLocaleString()}</div>
              </div>
            </>
          )}
        </section>

        {/* ----------------- [ADMIN VIEW: Comprehensive Dashboard] ----------------- */}
        {isAdmin && activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animated-fade-in">
            
            {/* 1. Monthly cumulative projects vertical bar chart (Requirement #2: Stats Widget on the Right) */}
            <div className="glass-card card-padding">
              <div className="section-title">
                <h2>📈 월별 누적 프로젝트 현황 (연단위 조회)</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="form-label" style={{ margin: 0 }}>연도 선택:</span>
                  <select className="form-select" style={{ padding: '6px 12px', fontSize: '0.85rem' }} value={selectedChartYear} onChange={(e) => setSelectedChartYear(Number(e.target.value))}>
                    <option value="2026">2026년</option>
                    <option value="2025">2025년</option>
                  </select>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                해당 월 막대에 마우스를 갖다 대면 [등록 프로젝트 수, 작업 완료 건수, 총 정산 비용] 요약이 출력됩니다.
              </p>

              {/* Flex Grid grouping the vertical chart (left) and the annual summary stats box (right) */}
              <div className="dashboard-chart-grid" style={{ alignItems: 'center' }}>
                {/* Left: Vertical Chart */}
                <div className="vertical-chart-wrapper">
                  {monthlyChartData.map((d, index) => {
                    const percentage = d.projCount > 0 ? (d.projCount / maxProjInAnyMonth) * 100 : 0;
                    return (
                      <div key={d.month} className="vertical-chart-bar-col">
                        {/* Tooltip display when hovered */}
                        {hoveredBarIndex === index && (
                          <div className="chart-tooltip-box">
                            <div className="chart-tooltip-title">{selectedChartYear}년 {d.month}월 실적</div>
                            <div className="chart-tooltip-row">
                              <span>등록 프로젝트:</span>
                              <span className="chart-tooltip-value">{d.projCount}건</span>
                            </div>
                            <div className="chart-tooltip-row">
                              <span>완료 작업량:</span>
                              <span className="chart-tooltip-value">{d.completedCount}건</span>
                            </div>
                            <div className="chart-tooltip-row">
                              <span>총 정산비용:</span>
                              <span className="chart-tooltip-value">₩{d.totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        <div className="vertical-chart-bar-bg" onMouseEnter={() => setHoveredBarIndex(index)} onMouseLeave={() => setHoveredBarIndex(null)}>
                          <div className={`vertical-chart-bar-fill ${d.projCount > 0 ? 'active' : ''}`} style={{ height: `${percentage || 2}%` }}></div>
                        </div>
                        <div className="vertical-chart-x-label">{d.month}월</div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Annual stats widget (Requirement #2) */}
                <div className="summary-widget" style={{ padding: '20px', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    🗓️ {selectedChartYear}년 누적 요약
                  </h3>
                  <div className="summary-row" style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem' }}>연간 프로젝트 수:</span>
                    <span className="summary-value" style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{annualProjCount} 건</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ fontSize: '0.85rem' }}>작업정산 비용:</span>
                    <span className="summary-value" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>₩{annualTaskCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PM statistics summary table (Requirement #4: Moved up, Email column removed, Collapsible, Monthly Filter added) */}
            <div className="glass-card card-padding">
              <div className="section-title">
                <h2>💼 담당 PM(프로젝트 책임자)별 요약 ({selectedChartYear}년 {selectedPmMonth === 'ALL' ? '연간' : `${Number(selectedPmMonth)}월`})</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="form-label" style={{ margin: 0 }}>월 선택:</span>
                    <select className="form-select" style={{ padding: '6px 12px', fontSize: '0.85rem' }} value={selectedPmMonth} onChange={(e) => setSelectedPmMonth(e.target.value)}>
                      <option value="ALL">전체 (연간)</option>
                      <option value="01">1월</option>
                      <option value="02">2월</option>
                      <option value="03">3월</option>
                      <option value="04">4월</option>
                      <option value="05">5월</option>
                      <option value="06">6월</option>
                      <option value="07">7월</option>
                      <option value="08">8월</option>
                      <option value="09">9월</option>
                      <option value="10">10월</option>
                      <option value="11">11월</option>
                      <option value="12">12월</option>
                    </select>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setAdminPmTableExpanded(!adminPmTableExpanded)}>
                    {adminPmTableExpanded ? '▲ 접기' : '▼ 펼치기'}
                  </button>
                </div>
              </div>

              {adminPmTableExpanded && (
                <div className="table-wrapper animated-fade-in" style={{ marginTop: '15px' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>PM 이름</th>
                        <th>개설 프로젝트 수</th>
                        <th>프로젝트 내 완료 세션 수</th>
                        <th>총 정산 산출 비용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === 'PIC').map(pm => {
                        const pmPrefix = selectedPmMonth === 'ALL' 
                          ? `${selectedChartYear}` 
                          : `${selectedChartYear}-${selectedPmMonth}`;
                          
                        const pmProjects = projects.filter(p => p.picId === pm.id && p.createdAt?.startsWith(pmPrefix));
                        const pmTasks = tasks.filter(t => {
                          const proj = projects.find(p => p.id === t.projectId);
                          return proj?.picId === pm.id && t.status === 'COMPLETED' && t.submittedAt?.startsWith(pmPrefix);
                        });
                        const pmSumCost = pmTasks.reduce((sum, t) => sum + t.cost, 0);
                        return (
                          <tr key={pm.id}>
                            <td><strong>{pm.name} PM</strong></td>
                            <td>{pmProjects.length} 개</td>
                            <td>{pmTasks.length} 건</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>₩{pmSumCost.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 3. Scripters cumulative earnings comparison bar chart (Requirement #5: Monthly Filter added) */}
            <div className="glass-card card-padding">
              <div className="section-title">
                <h2>📊 스크립터별 누적지급 정산액 비교</h2>
                
                {/* Monthly Filter (Requirement #5) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="form-label" style={{ margin: 0 }}>월 선택:</span>
                  <select className="form-select" style={{ padding: '6px 12px', fontSize: '0.85rem' }} value={selectedScripterMonth} onChange={(e) => setSelectedScripterMonth(e.target.value)}>
                    <option value="ALL">전체 (연간)</option>
                    <option value="01">1월</option>
                    <option value="02">2월</option>
                    <option value="03">3월</option>
                    <option value="04">4월</option>
                    <option value="05">5월</option>
                    <option value="06">6월</option>
                    <option value="07">7월</option>
                    <option value="08">8월</option>
                    <option value="09">9월</option>
                    <option value="10">10월</option>
                    <option value="11">11월</option>
                    <option value="12">12월</option>
                  </select>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                선택된 월 조건에 해당하는 지급 예정 금액이 차트 막대그래프로 비교 렌더링됩니다.
              </p>

              {/* Scripter visual bars + table combined (Requirement #6: '명세서 보기' button added) */}
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>스크립터</th>
                      <th style={{ width: '100px' }}>고유 ID</th>
                      <th>정산액 비교 (가로 막대)</th>
                      <th style={{ width: '120px' }}>완료 건수</th>
                      <th style={{ width: '150px' }}>지급 예정 정산액</th>
                      <th style={{ width: '140px', textAlign: 'right' }}>실적 명세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scripterStats.map(s => {
                      const percentage = maxScripterEarnings > 1 ? (s.totalEarnings / maxScripterEarnings) * 100 : 0;
                      return (
                        <tr key={s.id}>
                          <td><strong>{s.name}</strong></td>
                          <td><code>{s.scripterId}</code></td>
                          <td>
                            {s.totalEarnings > 0 ? (
                              <div className="chart-bar-bg" style={{ width: '100%', margin: 0 }}>
                                <div className="chart-bar-fill" style={{ width: `${percentage}%` }}></div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-dark)', fontSize: '0.8rem' }}>정산 내역 없음</span>
                            )}
                          </td>
                          <td>{s.completedCount} 건</td>
                          <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>₩{s.totalEarnings.toLocaleString()}</td>
                          <td style={{ textAlign: 'right' }}>
                            {/* Detailed Statement Modal Trigger (Requirement #6) */}
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedScripterDetail(users.find(u => u.id === s.id))}>
                              📑 명세서 보기
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- [ADMIN VIEW: Accounts Tab] ----------------- */}
        {isAdmin && activeTab === 'accounts' && (
          <div className="content-grid animated-fade-in">
            {/* User List */}
            <div className="glass-card card-padding">
              <h2 className="section-title">👤 사용자 계정 관리</h2>
              
              <div className="tab-container">
                <button className={`tab-button ${adminUserTab === 'PIC' ? 'active' : ''}`} onClick={() => setAdminUserTab('PIC')}>
                  담당 PM & 관리자 ({users.filter(u => u.role === 'PIC' || u.role === 'ADMIN').length})
                </button>
                <button className={`tab-button ${adminUserTab === 'WORKER' ? 'active' : ''}`} onClick={() => setAdminUserTab('WORKER')}>
                  스크립터 작업자 ({users.filter(u => u.role === 'WORKER').length})
                </button>
              </div>

              <div className="table-wrapper">
                {adminUserTab === 'PIC' ? (
                  /* PM Table */
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>이름</th>
                        <th>연락처 / 이메일</th>
                        <th>접속 ID</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === 'PIC' || u.role === 'ADMIN').map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>
                            <div>{u.contact}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </td>
                          <td><code>{u.username}</code></td>
                          <td>
                            {u.id !== currentUser.id && u.role !== 'ADMIN' && (
                              <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(u.id)}>
                                삭제
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  /* Scripters Table */
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>이름</th>
                        <th>연락처 / 이메일</th>
                        <th>스크립터 ID</th>
                        <th>전문 분야</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === 'WORKER').map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>
                            <div>{u.contact}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </td>
                          <td><strong>{u.scripterId}</strong></td>
                          <td>
                            <span style={{ fontSize: '0.85rem' }}>
                              {u.specialtyText} ({u.canFgd ? '좌담회O' : '좌담회X'}, {u.canInterview ? '인터뷰O' : '인터뷰X'})
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(u.id)}>
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Add User Form */}
            <div className="glass-card card-padding" style={{ height: 'fit-content' }}>
              <h2>➕ 계정 추가 ({adminUserTab === 'PIC' ? 'PM' : '작업자'})</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                활성화된 탭에 상응하는 계정을 추가로 생성합니다.
              </p>
              
              <form onSubmit={handleCreateAccount}>
                {adminUserTab === 'WORKER' ? (
                  /* Scripter Form: 스크립터명 -> 고유 ID -> 연락처 -> 이메일 -> 전문성 비고 순 */
                  <>
                    <div className="form-group">
                      <label className="form-label">스크립터명</label>
                      <input className="form-input" type="text" placeholder="예: 스크립터7" value={newScripter.name} onChange={(e) => setNewScripter({ ...newScripter, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">고유 ID (숫자)</label>
                      <input className="form-input" type="text" placeholder="예: 99999" value={newScripter.scripterId} onChange={(e) => setNewScripter({ ...newScripter, scripterId: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">연락처</label>
                      <input className="form-input" type="text" placeholder="010-0000-0000" value={newScripter.contact} onChange={(e) => setNewScripter({ ...newScripter, contact: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">이메일</label>
                      <input className="form-input" type="email" placeholder="example@gmail.com" value={newScripter.email} onChange={(e) => setNewScripter({ ...newScripter, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">전문성 비고</label>
                      <select className="form-select" value={newScripter.specialty} onChange={(e) => setNewScripter({ ...newScripter, specialty: e.target.value })}>
                        <option value="GENERAL">일반</option>
                        <option value="FGD_ONLY">좌담회 전용 (인터뷰 제외)</option>
                        <option value="MEDICAL">의학 조사 전문</option>
                        <option value="INTERVIEW">인터뷰 위주</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={newScripter.canFgd} onChange={(e) => setNewScripter({ ...newScripter, canFgd: e.target.checked })} /> 좌담회 가능
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={newScripter.canInterview} onChange={(e) => setNewScripter({ ...newScripter, canInterview: e.target.checked })} /> 인터뷰 가능
                      </label>
                    </div>
                  </>
                ) : (
                  /* PIC Form */
                  <>
                    <div className="form-group">
                      <label className="form-label">담당자 이름</label>
                      <input className="form-input" type="text" placeholder="예: 박과장" value={newPic.name} onChange={(e) => setNewPic({ ...newPic, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">접속 ID</label>
                      <input className="form-input" type="text" placeholder="예: pic_park" value={newPic.username} onChange={(e) => setNewPic({ ...newPic, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">연락처</label>
                      <input className="form-input" type="text" placeholder="010-0000-0000" value={newPic.contact} onChange={(e) => setNewPic({ ...newPic, contact: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">이메일</label>
                      <input className="form-input" type="email" placeholder="example@hr.com" value={newPic.email} onChange={(e) => setNewPic({ ...newPic, email: e.target.value })} />
                    </div>
                  </>
                )}

                <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '10px' }}>
                  등록하기
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- [PROJECTS MONITORING TAB] ----------------- */}
        {activeTab === 'projects' && (
          <div className={`${isPIC ? 'content-grid' : ''} animated-fade-in`}>
            {/* Projects List */}
            <div className="glass-card card-padding">
              <div className="section-title">
                <h2>{isAdmin ? '📊 전체 프로젝트 모니터링' : isPIC ? '📂 내 관리 프로젝트' : '📋 참여 프로젝트 및 배정 정보'}</h2>
                {isAdmin && (
                  <button className="btn btn-outline" onClick={handleDownloadAllAdmin}>
                    📥 전체 정산 엑셀(CSV) 다운로드
                  </button>
                )}
              </div>

              {/* Requirement #2: Completed/Ongoing Project Tabs */}
              <div className="tab-container" style={{ margin: '15px 0 25px 0' }}>
                <button 
                  className={`tab-button ${projectSubTab === 'IN_PROGRESS' ? 'active' : ''}`} 
                  onClick={() => setProjectSubTab('IN_PROGRESS')}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  ⏳ 진행 중인 프로젝트 ({displayProjects.filter(p => p.status === 'IN_PROGRESS').length})
                </button>
                <button 
                  className={`tab-button ${projectSubTab === 'COMPLETED' ? 'active' : ''}`} 
                  onClick={() => setProjectSubTab('COMPLETED')}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  ✅ 완료된 프로젝트 ({displayProjects.filter(p => p.status === 'COMPLETED').length})
                </button>
              </div>

              {(() => {
                const filteredProjects = displayProjects.filter(proj => proj.status === projectSubTab);

                if (filteredProjects.length === 0) {
                  return (
                    <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
                      {projectSubTab === 'IN_PROGRESS' ? '진행 중인 프로젝트가 없습니다.' : '완료된 프로젝트가 없습니다.'}
                    </p>
                  );
                }

                return filteredProjects.map(proj => {
                  const projectTasks = tasks.filter(t => t.projectId === proj.id && (isWorker ? t.workerId === currentUser.id : true));
                  
                  // Progress globally calculated
                  const globalTasks = tasks.filter(t => t.projectId === proj.id);
                  const completedCount = globalTasks.filter(t => t.status === 'COMPLETED').length;
                  const totalProjCost = globalTasks.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.cost, 0);
                  const pm = users.find(u => u.id === proj.picId);
                  
                  // Project collapsible toggle
                  const isExpanded = !!expandedProjects[proj.id];

                  return (
                    <div key={proj.id} className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                        
                        {/* Left: Project Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 'bold' }}>{proj.projectNo}</span>
                            <span className="badge badge-worker" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{proj.field}</span>
                          </div>
                          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{proj.name}</h3>
                        </div>

                        {/* Right: PM Highlight Badge + Progress & Action buttons */}
                        <div className="project-meta-actions">
                          
                          <div className="project-meta-info">
                            <div className="project-progress-wrapper">
                              {/* PM Badge - only show if NOT a PIC */}
                              {!isPIC && (
                                <span className="pm-badge">
                                  {pm ? pm.name : '미지정'} PM
                                </span>
                              )}
                              <span className="project-progress-text">진행률: {completedCount}/{proj.totalTasksCount}</span>
                            </div>
                            <div className="project-cost-text">₩{totalProjCost.toLocaleString()}</div>
                          </div>
                          
                          <div className="project-action-buttons">
                            {/* Toggle Expand/Collapse */}
                            <button className="btn btn-outline btn-sm" onClick={() => toggleProjectExpand(proj.id)}>
                              {isExpanded ? '▲ 접기' : '▼ 작업 목록'}
                            </button>

                            {/* Completion Toggle Button for PIC only */}
                            {(isPIC && proj.picId === currentUser.id) && (
                              <button 
                                className={`btn btn-sm ${proj.status === 'IN_PROGRESS' ? 'btn-success' : 'btn-outline'}`} 
                                onClick={() => handleToggleProjectStatus(proj.id)}
                              >
                                {proj.status === 'IN_PROGRESS' ? '✓ 완료' : '⏳ 진행중'}
                              </button>
                            )}

                            {(isPIC && proj.picId === currentUser.id) && (
                              <button className="btn btn-outline btn-sm" onClick={() => handleDownloadProjectSummary(proj)}>
                                📥 엑셀
                              </button>
                            )}
                            {isAdmin && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(proj.id)}>
                                삭제
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Project Tasks Table (Collapsible) */}
                      {isExpanded && (
                        <div className="animated-fade-in" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                          {projectTasks.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>표시할 작업이 없습니다.</p>
                          ) : (
                            <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                              <thead>
                                <tr style={{ background: 'none' }}>
                                  <th>작업구분</th>
                                  <th>배정된 스크립터</th>
                                  <th>입력 시간</th>
                                  <th>정산 시간</th>
                                  <th>산출 비용</th>
                                  <th>상태</th>
                                  {(isPIC || isWorker) && <th style={{ textAlign: 'right' }}>액션</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {projectTasks.map((task, idx) => {
                                  const scripter = users.find(u => u.id === task.workerId);
                                  return (
                                    <tr key={task.id}>
                                      <td>
                                        <strong>{task.taskType === 'FGD' ? '좌담회' : '인터뷰(Depth)'}</strong>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}> (세션 {idx+1})</span>
                                      </td>
                                      <td>
                                        {scripter ? (
                                          <div>
                                            <strong>{scripter.name}</strong> 
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> (ID: {scripter.scripterId})</span>
                                          </div>
                                        ) : (
                                          <span style={{ color: 'var(--danger)', fontWeight: '600' }}>미배정</span>
                                        )}
                                      </td>
                                      <td>
                                        {task.status === 'COMPLETED' ? `${task.durationMinutes}분` : '-'}
                                      </td>
                                      <td>
                                        {task.status === 'COMPLETED' ? `${task.roundedMinutes}분` : '-'}
                                      </td>
                                      <td>
                                        {task.status === 'COMPLETED' ? `₩${task.cost.toLocaleString()}` : '-'}
                                      </td>
                                      <td>
                                        <span className={`badge`} style={{
                                          background: task.status === 'COMPLETED' ? 'var(--success-glow)' : task.status === 'ASSIGNED' ? 'var(--warning-glow)' : 'rgba(255,255,255,0.03)',
                                          color: task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'ASSIGNED' ? 'var(--warning)' : 'var(--text-muted)'
                                        }}>
                                          {task.status === 'COMPLETED' ? '완료' : task.status === 'ASSIGNED' ? '진행중' : '대기'}
                                        </span>
                                      </td>
                                      {(isPIC || isWorker) && (
                                        <td style={{ textAlign: 'right' }}>
                                          {isPIC && (
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                              {task.status !== 'COMPLETED' && (
                                                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setAssigningTask(task)}>
                                                  {task.status === 'ASSIGNED' ? '재배정' : '배정하기'}
                                                </button>
                                              )}
                                              {/* Delete Unassigned Task */}
                                              {task.status === 'READY' && (
                                                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--danger)' }} onClick={() => handleDeleteTask(task.id, proj.id)}>
                                                  삭제
                                                </button>
                                              )}
                                            </div>
                                          )}
                                          
                                          {isWorker && (
                                            <>
                                              {task.status === 'ASSIGNED' ? (
                                                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openSubmitModal(task)}>
                                                  완료 보고
                                                </button>
                                              ) : (
                                                <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openSubmitModal(task)}>
                                                  시간 수정
                                                </button>
                                              )}
                                            </>
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Right column: Create Project form for PIC */}
            {isPIC && (
              <div className="glass-card card-padding" style={{ height: 'fit-content' }}>
                <h2>➕ 신규 프로젝트 개설</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  좌담회 또는 Depth 인터뷰 프로젝트를 신설하고 일괄 작업을 생성합니다.
                </p>
                <form onSubmit={handleCreateProject}>
                  <div className="form-group">
                    <label className="form-label">프로젝트 번호</label>
                    <input className="form-input" type="text" placeholder="예: 2025-36-0261" value={newProject.projectNo} onChange={(e) => setNewProject({ ...newProject, projectNo: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">프로젝트 명</label>
                    <input className="form-input" type="text" placeholder="예: 전동창호 FGD" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">분야</label>
                    <select className="form-select" value={newProject.field} onChange={(e) => setNewProject({ ...newProject, field: e.target.value })}>
                      <option value="IT">IT</option>
                      <option value="정치">정치</option>
                      <option value="금융">금융</option>
                      <option value="가전">가전</option>
                      <option value="의학">의학</option>
                      <option value="식품">식품</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">예정 작업 수 (세션 갯수)</label>
                    <input className="form-input" type="number" min="1" max="20" value={newProject.totalTasksCount} onChange={(e) => setNewProject({ ...newProject, totalTasksCount: e.target.value })} />
                  </div>
                  <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '10px' }}>
                    프로젝트 개설
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ----------------- [PIC VIEW: Scripters Tab] ----------------- */}
        {isPIC && activeTab === 'scripters' && (
          <div className="glass-card card-padding animated-fade-in">
            <h2>👥 스크립터 현황 및 업무량 관리</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              현재 스크립터들의 이번 주간 배정 업무량을 확인하여 편중 배정을 사전에 방지합니다. (권장량: 주간 좌담회 4~6그룹, 인터뷰 1개)
            </p>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>스크립터 ID</th>
                    <th>이름</th>
                    <th>전문 분야</th>
                    <th>이번 주 좌담회 배정</th>
                    <th>이번 주 인터뷰 배정</th>
                    <th>상태 및 경고</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'WORKER').map(scripter => {
                    const load = getScripterWorkload(scripter.id);
                    const isFgdExceeded = load.fgdCount > 6;
                    const isInterviewExceeded = load.depthCount > 1;
                    
                    return (
                      <tr key={scripter.id}>
                        <td>{scripter.scripterId}</td>
                        <td><strong>{scripter.name}</strong></td>
                        <td>{scripter.specialtyText}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{load.fgdCount} 그룹</span>
                            <div className="workload-progress-bar" style={{ width: '80px', margin: 0 }}>
                              <div className={`workload-fill ${load.fgdCount >= 5 ? 'warning' : ''}`} style={{ width: `${Math.min((load.fgdCount / 6) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{load.depthCount} 개</span>
                            <div className="workload-progress-bar" style={{ width: '80px', margin: 0 }}>
                              <div className={`workload-fill ${load.depthCount >= 1 ? 'danger' : ''}`} style={{ width: `${Math.min((load.depthCount / 1) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {scripter.specialty === 'FGD_ONLY' && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', block: 'block' }}>⚠️ 좌담회 전용</span>
                          )}
                          {isInterviewExceeded && (
                            <div className="danger-box" style={{ margin: 0, padding: '2px 8px', fontSize: '0.75rem' }}>
                              ⚠️ 주간 인터뷰 초과 ({load.depthCount}/1)
                            </div>
                          )}
                          {isFgdExceeded && (
                            <div className="warning-box" style={{ margin: 0, padding: '2px 8px', fontSize: '0.75rem' }}>
                              ⚠️ 주간 좌담회 초과 ({load.fgdCount}/6)
                            </div>
                          )}
                          {!isFgdExceeded && !isInterviewExceeded && (
                            <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.8rem' }}>✓ 여유 있음</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- [WORKER VIEW: Settlement Performance Tab] ----------------- */}
        {isWorker && activeTab === 'settlement' && (
          <div className="content-grid animated-fade-in">
            {/* Left: performances list */}
            <div className="glass-card card-padding">
              <h2>💳 월간 / 프로젝트별 정산 실적</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                귀하가 최종 제출 완료하여 승인된 정산 실적 리스트입니다.
              </p>
              
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>제출일</th>
                      <th>프로젝트 번호</th>
                      <th>구분</th>
                      <th>입력 시간</th>
                      <th>정산 인정 시간</th>
                      <th>정산 금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerCompletedTasks.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>완료 처리된 내역이 없습니다.</td>
                      </tr>
                    ) : (
                      workerCompletedTasks.map(t => {
                        const proj = projects.find(p => p.id === t.projectId);
                        return (
                          <tr key={t.id}>
                            <td>{t.submittedAt}</td>
                            <td>{proj?.projectNo}</td>
                            <td>{t.taskType === 'FGD' ? '좌담회' : '인터뷰'}</td>
                            <td>{t.durationMinutes}분</td>
                            <td>{t.roundedMinutes}분</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>₩{t.cost.toLocaleString()}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Summary box */}
            <div className="glass-card card-padding" style={{ height: 'fit-content' }}>
              <h2>📊 정산 요약 리포트</h2>
              <div style={{ margin: '20px 0' }} className="summary-widget">
                <div className="summary-row">
                  <span>총 완료 세션 수:</span>
                  <span className="summary-value">{workerCompletedTasks.length} 건</span>
                </div>
                <div className="summary-row">
                  <span>총 작업 녹음 시간:</span>
                  <span className="summary-value">
                    {Math.floor(workerCompletedTasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60)}시간 {workerCompletedTasks.reduce((sum, t) => sum + t.durationMinutes, 0) % 60}분
                  </span>
                </div>
                <div className="summary-row">
                  <span>정산 환산 시간:</span>
                  <span className="summary-value">
                    {Math.floor(workerCompletedTasks.reduce((sum, t) => sum + t.roundedMinutes, 0) / 60)}시간 {workerCompletedTasks.reduce((sum, t) => sum + t.roundedMinutes, 0) % 60}분
                  </span>
                </div>
                <div className="summary-row summary-total">
                  <span>최종 정산 예상액:</span>
                  <span>₩{totalCostWorker.toLocaleString()}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ※ 한국리서치 정산 지급일에 맞추어 등록된 계좌로 자동 입금됩니다. (개인소득세 3.3% 공제 전 금액)
              </p>
            </div>
          </div>
        )}

        {/* ----------------- [ADMIN VIEW: Full Master Settlement Tab] ----------------- */}
        {isAdmin && activeTab === 'settlement' && (
          <div className="glass-card card-padding animated-fade-in">
            <div className="section-title">
              <h2>💰 전체 정산 마스터 데이터</h2>
              <button className="btn btn-outline" onClick={handleDownloadAllAdmin}>
                📥 마스터 Excel(CSV) 다운로드
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              모든 담당자가 개설한 프로젝트와 스크립터들이 제출한 정산 기초자료 마스터 테이블입니다.
            </p>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>제출일</th>
                    <th>프로젝트 (번호)</th>
                    <th>담당 PM</th>
                    <th>구분</th>
                    <th>스크립터 (ID)</th>
                    <th>입력 재생시간</th>
                    <th>정산 시간</th>
                    <th>금액 (원)</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => {
                    const proj = projects.find(p => p.id === t.projectId);
                    const worker = users.find(u => u.id === t.workerId);
                    const pm = users.find(u => u.id === proj?.picId);
                    return (
                      <tr key={t.id}>
                        <td>{t.submittedAt || '-'}</td>
                        <td>
                          <div>{proj?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({proj?.projectNo})</div>
                        </td>
                        <td>{pm ? pm.name : '-'}</td>
                        <td>{t.taskType === 'FGD' ? '좌담회' : '인터뷰'}</td>
                        <td>
                          {worker ? (
                            <div>{worker.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({worker.scripterId})</span></div>
                          ) : (
                            <span style={{ color: 'var(--danger)' }}>미배정</span>
                          )}
                        </td>
                        <td>{t.status === 'COMPLETED' ? `${t.durationMinutes}분` : '-'}</td>
                        <td>{t.status === 'COMPLETED' ? `${t.roundedMinutes}분` : '-'}</td>
                        <td style={{ fontWeight: 'bold', color: t.status === 'COMPLETED' ? 'var(--success)' : 'inherit' }}>
                          {t.status === 'COMPLETED' ? `₩${t.cost.toLocaleString()}` : '-'}
                        </td>
                        <td>
                          <span className={`badge`} style={{
                            background: t.status === 'COMPLETED' ? 'var(--success-glow)' : t.status === 'ASSIGNED' ? 'var(--warning-glow)' : 'rgba(255,255,255,0.03)',
                            color: t.status === 'COMPLETED' ? 'var(--success)' : t.status === 'ASSIGNED' ? 'var(--warning)' : 'var(--text-muted)'
                          }}>
                            {t.status === 'COMPLETED' ? '완료' : t.status === 'ASSIGNED' ? '진행중' : '대기'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- [MODAL: TASK ASSIGNMENT] ----------------- */}
      {assigningTask && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3>👥 스크립터 업무 배정</h3>
              <button className="close-btn" onClick={() => setAssigningTask(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>대상 작업:</div>
                <strong>{assigningTask.taskType === 'FGD' ? '좌담회 (응답자 구분 必)' : '인터뷰 (Depth)'}</strong>
              </div>

              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>배정할 스크립터 선택:</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                {users.filter(u => u.role === 'WORKER').map(worker => {
                  const load = getScripterWorkload(worker.id);
                  
                  // Match Specialty recommendations
                  let recommendation = '';
                  let warning = '';
                  
                  if (assigningTask.taskType === 'FGD' && worker.specialty === 'FGD_ONLY') {
                    recommendation = '좌담회 전용 스크립터';
                  }
                  if (assigningTask.taskType === 'DEPTH' && worker.specialty === 'INTERVIEW') {
                    recommendation = '인터뷰 특화 스크립터';
                  }
                  
                  const isMedicalProject = projects.find(p => p.id === assigningTask.projectId)?.field === '의학';
                  if (isMedicalProject && worker.specialty === 'MEDICAL') {
                    recommendation = '의학 전문 스크립터 추천';
                  }
                  
                  // Check Limits warnings
                  if (assigningTask.taskType === 'DEPTH' && !worker.canInterview) {
                    warning = '인터뷰 불가능 스크립터';
                  }
                  if (load.fgdCount >= 6 && assigningTask.taskType === 'FGD') {
                    warning = '주간 좌담회 작업 권장량 한도 도달 (6그룹)';
                  }
                  if (load.depthCount >= 1 && assigningTask.taskType === 'DEPTH') {
                    warning = '주간 인터뷰 배정 권장량 한도 도달 (1개)';
                  }

                  return (
                    <div key={worker.id} className="glass-card" style={{ padding: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.015)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{worker.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({worker.scripterId})</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            주간 부하: 좌담회 {load.fgdCount}건 | 인터뷰 {load.depthCount}건
                          </div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAssignTask(worker.id)}>
                          배정
                        </button>
                      </div>

                      {recommendation && (
                        <div className="scripter-recommendation" style={{ display: 'inline-block', marginTop: '6px' }}>
                          💡 {recommendation}
                        </div>
                      )}
                      
                      {warning && (
                        <div className="warning-box" style={{ marginTop: '6px', padding: '4px 8px', fontSize: '0.75rem' }}>
                          ⚠️ {warning}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setAssigningTask(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- [MODAL: TASK SUBMISSION] ----------------- */}
      {submittingTask && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3>✍️ 작업 완료 보고 (시간 입력)</h3>
              <button className="close-btn" onClick={() => setSubmittingTask(null)}>×</button>
            </div>
            <form onSubmit={handleSubmitTask}>
              <div className="modal-body">
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>작업 유형:</div>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {submittingTask.taskType === 'FGD' ? '좌담회 (응답자 구분)' : '인터뷰 (Depth)'}
                  </strong>
                </div>

                <div className="form-group">
                  <label className="form-label">녹취 시간 (분 단위 입력)</label>
                  <input className="form-input" type="number" min="0" placeholder="예: 74" value={inputDuration.minutes} onChange={(e) => handleDurationChange(e.target.value)} required />
                </div>

                {/* Real-time Settlement Preview */}
                {inputDuration.minutes !== '' && (
                  <div style={{ marginTop: '20px' }} className="summary-widget animated-fade-in">
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>💰 예상 자동 정산 정보</h4>
                    <div className="summary-row">
                      <span>입력된 분:</span>
                      <span>{inputDuration.minutes}분</span>
                    </div>
                    <div className="summary-row">
                      <span>정산 반영 시간:</span>
                      <span className="summary-value" style={{ color: 'var(--secondary)' }}>
                        {liveCalc.roundedMinutes}분 (30분 단위 절상/절하)
                      </span>
                    </div>
                    <div className="summary-row summary-total">
                      <span>최종 산정 비용:</span>
                      <span>₩{liveCalc.cost.toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                      * 15분 미만(예: 74분 $\rightarrow$ 60분)은 내림, 15분 이상(예: 75분 $\rightarrow$ 90분)은 올림 처리됩니다.
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" type="button" onClick={() => setSubmittingTask(null)}>취소</button>
                <button className="btn btn-primary" type="submit">제출 완료</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- [MODAL: REQUIREMENT #6 - SCRIPTER STATEMENT DETAIL POPUP] ----------------- */}
      {selectedScripterDetail && (() => {
        const prefix = selectedScripterMonth === 'ALL' 
          ? `${selectedChartYear}` 
          : `${selectedChartYear}-${selectedScripterMonth}`;
        
        const filteredTasks = tasks.filter(t => 
          t.workerId === selectedScripterDetail.id && 
          t.status === 'COMPLETED' && 
          t.submittedAt?.startsWith(prefix)
        );
        
        const totalCost = filteredTasks.reduce((sum, t) => sum + t.cost, 0);

        return (
          <div className="modal-overlay">
            <div className="glass-card modal-content" style={{ maxWidth: '800px', width: '90%' }}>
              <div className="modal-header">
                <h3>📑 {selectedScripterDetail.name} ({selectedScripterDetail.scripterId}) {selectedChartYear}년 {selectedScripterMonth === 'ALL' ? '연간' : `${Number(selectedScripterMonth)}월`} 실적 명세서</h3>
                <button className="close-btn" onClick={() => setSelectedScripterDetail(null)}>×</button>
              </div>
              <div className="modal-body" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                <div style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  연락처: {selectedScripterDetail.contact} | 이메일: {selectedScripterDetail.email} | 전문: {selectedScripterDetail.specialtyText}
                </div>

                {filteredTasks.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>
                    선택한 기간({selectedChartYear}년 {selectedScripterMonth === 'ALL' ? '연간' : `${Number(selectedScripterMonth)}월`}) 내 완료된 작업 정산 실적이 없습니다.
                  </p>
                ) : (
                  <div className="table-wrapper">
                    <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>제출일</th>
                          <th>프로젝트 번호</th>
                          <th>프로젝트 명</th>
                          <th>구분</th>
                          <th>입력 시간</th>
                          <th>정산 시간</th>
                          <th>정산 금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map(t => {
                          const proj = projects.find(p => p.id === t.projectId);
                          return (
                            <tr key={t.id}>
                              <td>{t.submittedAt}</td>
                              <td>{proj?.projectNo}</td>
                              <td><strong>{proj?.name}</strong></td>
                              <td>{t.taskType === 'FGD' ? '좌담회' : '인터뷰'}</td>
                              <td>{t.durationMinutes}분</td>
                              <td>{t.roundedMinutes}분</td>
                              <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>₩{t.cost.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                        {/* Sum Row inside popup modal */}
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <td colSpan="6" style={{ fontWeight: 'bold', textAlign: 'right' }}>합계:</td>
                          <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                            ₩{totalCost.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setSelectedScripterDetail(null)}>닫기</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
