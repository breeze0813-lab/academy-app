// User & Auth Types
export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface User {
  id: number;
    email: string;
      name: string;
        role: UserRole;
          createdAt: string;
          }

          export interface AuthResponse {
            token: string;
              user: User;
              }

              // Student Types
              export interface Student {
                id: number;
                  name: string;
                    email: string;
                      phone: string | null;
                        parentPhone: string | null;
                          createdAt: string;
                          }

                          // Class Types
                          export interface Class {
                            id: number;
                              name: string;
                                description: string | null;
                                  teacherId: number;
                                    teacher?: { id: number; name: string };
                                    }

                                    // Attendance Types
                                    export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE';

                                    export interface AttendanceRecord {
                                      id: number;
                                        date: string;
                                          status: AttendanceStatus;
                                            memo: string | null;
                                              student: { id: number; name: string };
                                                class: { id: number; name: string };
                                                }

                                                // Invoice Types
                                                export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

                                                export interface Invoice {
                                                  id: number;
                                                    amount: number;
                                                      status: InvoiceStatus;
                                                        dueDate: string;
                                                          paidAt: string | null;
                                                            memo: string | null;
                                                              student: { id: number; name: string };
                                                                class: { id: number; name: string };
                                                                }

                                                                // Assignment Types
                                                                export interface Assignment {
                                                                  id: number;
                                                                    title: string;
                                                                      description: string | null;
                                                                        dueDate: string | null;
                                                                          classId: number;
                                                                            class?: { id: number; name: string };
                                                                              createdAt: string;
                                                                              }

                                                                              export interface AssignmentSubmission {
                                                                                id: number;
                                                                                  content: string;
                                                                                    submittedAt: string;
                                                                                      assignmentId: number;
                                                                                        studentId: number;
                                                                                          student?: { id: number; name: string };
                                                                                          }

                                                                                          // Notice Types
                                                                                          export interface Notice {
                                                                                            id: number;
                                                                                              title: string;
                                                                                                content: string;
                                                                                                  isPinned: boolean;
                                                                                                    author: { id: number; name: string };
                                                                                                      createdAt: string;
                                                                                                        updatedAt: string;
                                                                                                        }
                                                                                                        
                                                                                                        // API Response Types
                                                                                                        export interface PaginatedResponse<T> {
                                                                                                          data: T[];
                                                                                                            total: number;
                                                                                                              page: number;
                                                                                                                limit: number;
                                                                                                                }
                                                                                                                
                                                                                                                export interface ApiError {
                                                                                                                  error: string;
                                                                                                                    message?: string;
                                                                                                                    }
