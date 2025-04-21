import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Package, Settings, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { courseDates } from '../../data/dates';
import { courses } from '../../data/courses';
import { formatCurrency } from '../../utils/formatters';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'courses'>('upcoming');

  // Fetch booking data
  const upcomingTrainings = courseDates
    .filter(date => new Date(date.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10);

  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Admin Header */}
          <div className="bg-tactical-900 text-white rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-heading font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-300">
                  Manage courses, dates, and user bookings for Elite Tactical Training.
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Link to="/admin/courses/new">
                  <Button variant="outline" className="border-white/30 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </Link>
                <Link to="/admin/dates/new">
                  <Button variant="accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Training Date
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-tactical-800 text-white p-4">
                  <h2 className="font-medium">Admin Menu</h2>
                </div>
                <div className="divide-y">
                  <button 
                    className={`w-full text-left px-4 py-3 flex items-center hover:bg-tactical-50 transition-colors ${activeTab === 'upcoming' ? 'bg-tactical-100 font-medium' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <Calendar className="w-5 h-5 mr-3 text-tactical-700" />
                    <span>Upcoming Trainings</span>
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-3 flex items-center hover:bg-tactical-50 transition-colors ${activeTab === 'courses' ? 'bg-tactical-100 font-medium' : ''}`}
                    onClick={() => setActiveTab('courses')}
                  >
                    <Package className="w-5 h-5 mr-3 text-tactical-700" />
                    <span>Manage Courses</span>
                  </button>
                  <Link 
                    to="/admin/settings" 
                    className="w-full text-left px-4 py-3 flex items-center hover:bg-tactical-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3 text-tactical-700" />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-accent-500 mr-2" />
                    <h3 className="font-medium text-tactical-900">Upcoming Sessions</h3>
                  </div>
                  <p className="text-2xl font-bold text-tactical-900">
                    {courseDates.filter(date => new Date(date.startDate) >= new Date()).length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-accent-500 mr-2" />
                    <h3 className="font-medium text-tactical-900">Total Bookings</h3>
                  </div>
                  <p className="text-2xl font-bold text-tactical-900">
                    {courseDates.reduce((sum, date) => sum + date.currentParticipants, 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <Package className="w-5 h-5 text-accent-500 mr-2" />
                    <h3 className="font-medium text-tactical-900">Active Courses</h3>
                  </div>
                  <p className="text-2xl font-bold text-tactical-900">
                    {courses.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Upcoming Trainings */}
              {activeTab === 'upcoming' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-xl font-bold text-tactical-900">
                      Upcoming Training Sessions
                    </h2>
                    <Link to="/admin/calendar">
                      <Button variant="outline" size="sm">
                        View Calendar
                      </Button>
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-tactical-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">
                            Dates
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">
                            Participants
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingTrainings.length > 0 ? (
                          upcomingTrainings.map((date) => {
                            const course = getCourseById(date.courseId);
                            const startDate = new Date(date.startDate);
                            const endDate = new Date(date.endDate);
                            const isStartingSoon = startDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                            
                            return (
                              <tr key={date.id} className="hover:bg-tactical-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-tactical-900">{course?.title}</div>
                                  <div className="text-sm text-tactical-600">{formatCurrency(course?.price || 0)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-tactical-900">{format(startDate, 'MMM d, yyyy')}</div>
                                  <div className="text-sm text-tactical-600">to {format(endDate, 'MMM d, yyyy')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 text-tactical-500 mr-2" />
                                    <span>{date.currentParticipants}/{date.maxParticipants}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        date.currentParticipants / date.maxParticipants > 0.8 
                                          ? 'bg-green-600' 
                                          : 'bg-accent-500'
                                      }`} 
                                      style={{ width: `${(date.currentParticipants / date.maxParticipants) * 100}%` }}
                                    ></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    isStartingSoon 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {isStartingSoon ? 'Starting Soon' : 'Scheduled'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <Link to={`/admin/dates/${date.id}`} className="text-accent-600 hover:text-accent-900 mr-3">
                                    Edit
                                  </Link>
                                  <Link to={`/admin/dates/${date.id}/participants`} className="text-accent-600 hover:text-accent-900">
                                    View Participants
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-tactical-600">
                              No upcoming training sessions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Manage Courses */}
              {activeTab === 'courses' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-xl font-bold text-tactical-900">
                      Manage Course Packages
                    </h2>
                    <Link to="/admin/courses/new">
                      <Button variant="primary" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Course
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => (
                      <div 
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-5 hover:border-tactical-300 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-heading font-semibold text-lg text-tactical-900">
                              {course.title}
                            </h3>
                            <div className="text-xl font-bold text-tactical-900 mt-1">
                              {formatCurrency(course.price)}
                            </div>
                          </div>
                          {course.isPopular && (
                            <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        
                        <p className="text-tactical-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex gap-2 mb-4">
                          <span className="bg-tactical-100 text-tactical-800 rounded-full px-2.5 py-0.5 text-xs font-medium">
                            {course.duration} days
                          </span>
                          <span className="bg-tactical-100 text-tactical-800 rounded-full px-2.5 py-0.5 text-xs font-medium">
                            {course.rounds} rounds
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center text-tactical-600 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Last updated: {format(new Date(), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/admin/courses/${course.id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Link to={`/admin/courses/${course.id}/dates`}>
                              <Button variant="ghost" size="sm">
                                Manage Dates
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;