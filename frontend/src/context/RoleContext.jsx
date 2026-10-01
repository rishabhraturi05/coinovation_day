import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext(null);

export const ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
};

export function RoleProvider({ children }) {
  // Load initial role from localStorage or default to student
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('campuspulse_role') || ROLES.STUDENT;
  });

  // Current demo student (default CP1042 Alex Rivera)
  const [currentStudent, setCurrentStudent] = useState({
    id: 1,
    student_code: 'CP1042',
    name: 'Alex Rivera',
    department: 'Computer Science',
    year: '2nd Year',
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('campuspulse_role', currentRole);
  }, [currentRole]);

  const switchRole = (role) => {
    setCurrentRole(role);
    setIsRoleModalOpen(false);
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole: switchRole,
        currentStudent,
        setCurrentStudent,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isCompanionOpen,
        setIsCompanionOpen,
        ROLES,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
