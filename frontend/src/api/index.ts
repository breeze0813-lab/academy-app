import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
          },
          });

          api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
              if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
                    }
                      return config;
                      });

                      // Auth API
                      export const authApi = {
                        login: (data: { email: string; password: string }) =>
                            api.post('/auth/login', data),
                              register: (data: { name: string; email: string; phone: string; password: string; role: string }) =>
                                  api.post('/auth/register', data),
                                  };

                                  // Students API
                                  export const studentsApi = {
                                    getAll: (academyId: number) =>
                                        api.get(`/students?academyId=${academyId}`),
                                          getById: (id: number) =>
                                              api.get(`/students/${id}`),
                                              };

                                              // Attendance API
                                              export const attendanceApi = {
                                                create: (data: { studentId: number; classId: number; date: string; status: string; memo?: string }) =>
                                                    api.post('/attendance', data),
                                                      getByClass: (classId: number, date?: string) =>
                                                          api.get(`/attendance/class/${classId}${date ? `?date=${date}` : ''}`),
                                                            getByStudent: (studentId: number) =>
                                                                api.get(`/attendance/student/${studentId}`),
                                                                  update: (id: number, data: { status: string; memo?: string }) =>
                                                                      api.put(`/attendance/${id}`, data),
                                                                        getSummary: (academyId: number) =>
                                                                            api.get(`/attendance/summary/${academyId}`),
                                                                            };

                                                                            // Invoice API
                                                                            export const invoicesApi = {
                                                                              create: (data: { studentId: number; academyId: number; month: string; tuitionFee: number; extraFee?: number; dueDate: string }) =>
                                                                                  api.post('/invoices', data),
                                                                                    bulkCreate: (data: { academyId: number; month: string; tuitionFee: number; dueDate: string }) =>
                                                                                        api.post('/invoices/bulk', data),
                                                                                          getAll: (params?: { academyId?: number; month?: string; status?: string }) =>
                                                                                              api.get('/invoices', { params }),
                                                                                                getUnpaid: (academyId: number) =>
                                                                                                    api.get(`/invoices/unpaid?academyId=${academyId}`),
                                                                                                      pay: (id: number) =>
                                                                                                          api.patch(`/invoices/${id}/pay`),
                                                                                                            getByStudent: (studentId: number) =>
                                                                                                                api.get(`/invoices/student/${studentId}`),
                                                                                                                };
                                                                                                                
                                                                                                                // Assignments API
                                                                                                                export const assignmentsApi = {
                                                                                                                  create: (data: { title: string; content?: string; dueDate: string; classId: number }) =>
                                                                                                                      api.post('/assignments', data),
                                                                                                                        getByClass: (classId: number) =>
                                                                                                                            api.get(`/assignments/class/${classId}`),
                                                                                                                              getById: (id: number) =>
                                                                                                                                  api.get(`/assignments/${id}`),
                                                                                                                                    submit: (assignmentId: number, data: { content?: string }) =>
                                                                                                                                        api.post(`/assignments/${assignmentId}/submit`, data),
                                                                                                                                          grade: (submissionId: number, data: { score: number; feedback?: string }) =>
                                                                                                                                              api.patch(`/assignments/submissions/${submissionId}/grade`, data),
                                                                                                                                              };
                                                                                                                                              
                                                                                                                                              // Notices API
                                                                                                                                              export const noticesApi = {
                                                                                                                                                create: (data: { title: string; content: string; academyId: number }) =>
                                                                                                                                                    api.post('/notices', data),
                                                                                                                                                      getByAcademy: (academyId: number) =>
                                                                                                                                                          api.get(`/notices/${academyId}`),
                                                                                                                                                            update: (id: number, data: { title: string; content: string }) =>
                                                                                                                                                                api.put(`/notices/${id}`, data),
                                                                                                                                                                  delete: (id: number) =>
                                                                                                                                                                      api.delete(`/notices/${id}`),
                                                                                                                                                                      };
                                                                                                                                                                      
                                                                                                                                                                      export default api;
