import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, CalendarPlus } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { courses } from '../../data/courses';

// --- Placeholder Data (Replace with actual data fetching later) ---
interface UserStatus {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  filledForms: boolean;
  paidDeposit: boolean;
  paidInFull: boolean;
  filesUploaded: boolean;
}

const dummyUsers: UserStatus[] = [
  { id: 'usr_1', firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '555-1234', filledForms: true, paidDeposit: true, paidInFull: false, filesUploaded: true },
  { id: 'usr_2', firstName: 'Jane', lastName: 'Smith', email: 'jane.s@email.com', phone: '555-5678', filledForms: true, paidDeposit: false, paidInFull: false, filesUploaded: false },
  { id: 'usr_3', firstName: 'Bob', lastName: 'Johnson', email: 'bobby.j@email.com', phone: '555-9999', filledForms: false, paidDeposit: false, paidInFull: false, filesUploaded: false },
];
// --- End Placeholder Data ---

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // State for user statuses (won't persist without backend)
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>(dummyUsers);

  // State for course scheduling
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleCheckboxChange = (userId: string, statusKey: keyof Omit<UserStatus, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>) => {
    setUserStatuses(prevStatuses =>
      prevStatuses.map(u =>
        u.id === userId ? { ...u, [statusKey]: !u[statusKey] } : u
      )
    );
    // TODO: Add backend call to update status
    console.log(`Status "${statusKey}" changed for user ${userId}`);
  };

  const handleScheduleCourse = () => {
    if (!selectedCourseId || !startDate || !endDate) {
      alert('Please select a course and both start and end dates.');
      return;
    }
    // TODO: Add backend call to schedule the date
    console.log(`Scheduling course ${selectedCourseId} from ${startDate} to ${endDate}`);
    alert(`Course ${courses.find(c => c.id === selectedCourseId)?.title} scheduled! (Check console)`);
    // Optionally reset fields
    // setSelectedCourseId(courses[0]?.id || '');
    // setStartDate('');
    // setEndDate('');
  };

  const handleDownloadFiles = (userId: string) => {
    // TODO: Add backend call to initiate file download for the user
    console.log(`Initiating file download for user ${userId}`);
    alert(`File download initiated for user ${userId}. (Check console)`);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login');
    return null; // Render nothing while redirecting
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4 space-y-8">

          {/* Admin Header */}
          <div className="bg-tactical-900 text-white rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">User status overview and course scheduling.</p>
          </div>

          {/* Section 1: User Status Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-500" />
              User Status Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-tactical-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Contact</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Forms</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Deposit</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Paid Full</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Files</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userStatuses.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-tactical-900">{u.firstName} {u.lastName}</div>
                      </td>
                       <td className="px-4 py-3 whitespace-nowrap text-sm text-tactical-600">
                         <div>{u.email}</div>
                         <div>{u.phone}</div>
                        </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                          checked={u.filledForms} onChange={() => handleCheckboxChange(u.id, 'filledForms')} />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                          checked={u.paidDeposit} onChange={() => handleCheckboxChange(u.id, 'paidDeposit')} />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                          checked={u.paidInFull} onChange={() => handleCheckboxChange(u.id, 'paidInFull')} />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                          checked={u.filesUploaded} onChange={() => handleCheckboxChange(u.id, 'filesUploaded')} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {u.filesUploaded && (
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadFiles(u.id)}>
                            <Download className="w-4 h-4 mr-1" />
                            Download Files
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Course Date Scheduling */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <CalendarPlus className="w-5 h-5 mr-2 text-accent-500" />
              Schedule New Course Date
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Course Dropdown */}
              <div className="md:col-span-2">
                <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Course
                </label>
                <select
                  id="courseSelect"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md shadow-sm"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3"
                />
              </div>

              {/* Schedule Button */}
              <div className="md:col-span-4 flex justify-end mt-4">
                 <Button variant="primary" onClick={handleScheduleCourse}>
                   Schedule Course Date
                 </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;