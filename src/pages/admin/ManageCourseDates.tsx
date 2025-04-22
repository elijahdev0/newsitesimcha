import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { courses } from '../../data/courses'; // Keep for fetching course title for now

// Define the structure of data returned by Supabase (snake_case)
interface SupabaseCourseDate {
    id: string; // UUID from Supabase
    course_id: string;
    start_date: string; // TIMESTAMPTZ as ISO string
    end_date: string;   // TIMESTAMPTZ as ISO string
    max_participants: number;
    current_participants: number;
    created_at: string; // TIMESTAMPTZ as ISO string
}

const ManageCourseDates: React.FC = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const { user } = useAuthStore();

    // Use the Supabase-specific type for state
    const [dates, setDates] = useState<SupabaseCourseDate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const course = courses.find(c => c.id === courseId);

    const fetchDates = useCallback(async () => {
        if (!courseId) return;
        setIsLoading(true);
        setError(null);
        try {
            // Fetch data (Supabase client returns snake_case keys)
            const { data, error: fetchError } = await supabase
                .from('course_dates')
                .select('*')
                .eq('course_id', courseId)
                .order('start_date', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }
            // Assert the fetched data shape matches SupabaseCourseDate
            setDates((data as SupabaseCourseDate[]) || []);
        } catch (err: any) {
            console.error('Error fetching course dates:', err);
            setError(`Failed to fetch dates: ${err.message}. Ensure RLS policies are correct for admins.`);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchDates();
    }, [fetchDates]);

    const handleAddDate = async (/* newDateData */) => {
        // TODO: Implement Supabase insert
        console.log('Add date logic to be implemented');
        // After successful add, call fetchDates() to refresh
    };

    const handleUpdateDate = async (/* dateId, updatedDateData */) => {
        // TODO: Implement Supabase update
        console.log('Update date logic to be implemented');
        // After successful update, call fetchDates() to refresh
    };

    const handleDeleteDate = async (dateId: string) => {
        if (window.confirm('Are you sure you want to delete this date slot?')) {
             try {
                 setIsLoading(true);
                 const { error: deleteError } = await supabase
                     .from('course_dates')
                     .delete()
                     .eq('id', dateId);

                 if (deleteError) throw deleteError;
                 fetchDates(); // Refresh list
             } catch (err: any) {
                  console.error('Error deleting date:', err);
                  setError(`Failed to delete date: ${err.message}`);
             } finally {
                  setIsLoading(false);
             }
        }
    };

    return (
        <>
            <Header variant="dark-text" />
            <main className="min-h-screen bg-tactical-50 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                         <Link to="/admin/dashboard" className="text-accent-600 hover:text-accent-800 text-sm">
                            &larr; Back to Admin Dashboard
                        </Link>
                        <h1 className="text-3xl font-heading font-bold text-tactical-900 mt-2 mb-1">Manage Dates</h1>
                         <p className="text-tactical-700">Course: <span className="font-semibold">{course ? course.title : 'Loading...'} ({courseId})</span></p>
                    </div>

                    {/* Add Date Button */}
                    <div className="mb-6 text-right">
                        <Button onClick={() => {/* TODO: Open Add Modal */ alert('Add Date form not implemented yet.'); }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Date Slot
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-700 mx-auto mb-4"></div>
                            <p>Loading Dates...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold mr-2">Error!</strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* Dates List */}
                    {!isLoading && !error && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-tactical-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">Start Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">End Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">Participants</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">Created At</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-tactical-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dates.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-tactical-500">
                                                <Calendar className="w-10 h-10 mx-auto mb-2 text-tactical-400" />
                                                No date slots found for this course. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        dates.map((date) => (
                                            <tr key={date.id} className="hover:bg-tactical-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tactical-900">
                                                    {format(new Date(date.start_date), 'MMM d, yyyy HH:mm')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-700">
                                                    {format(new Date(date.end_date), 'MMM d, yyyy HH:mm')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-700">
                                                    {date.current_participants} / {date.max_participants}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-600">
                                                    {format(new Date(date.created_at), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => {/* TODO: Open Edit Modal */ alert('Edit Date form not implemented yet.'); }}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDate(date.id)} className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ManageCourseDates;

// Ensure CourseDate type is defined in src/types/index.ts
// Example:
// export type CourseDate = {
//   id: string; // Changed to string if using UUIDs from Supabase
//   courseId: string; // Should match the type of courseId used
//   startDate: string; // ISO String format from Supabase (TIMESTAMPTZ)
//   endDate: string; // ISO String format from Supabase
//   maxParticipants: number;
//   currentParticipants: number;
// }; 