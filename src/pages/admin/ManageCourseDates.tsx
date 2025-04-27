import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Calendar, Loader, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { courses } from '../../data/courses'; // Static course data for title
import { Modal } from '../../components/common/Modal';
import { Tables } from '../../../supabase/schema_types'; // Import generated types

// Use generated types
type CourseDate = Tables<'course_dates'>;
type BookingWithUser = Tables<'bookings'> & {
  users: Pick<Tables<'users'>, 'first_name' | 'last_name' | 'email'> | null;
};

// Type for the form data
interface CourseDateFormState {
  start_date: string;
  end_date: string;
  max_participants: number;
}

// Constants
const PAGE_SIZE = 20; // Number of dates to fetch per page

const ManageCourseDates: React.FC = () => {
    const { id: courseId } = useParams<{ id: string }>();
    // Removed unused 'user' state from useAuthStore for now
    // const { user } = useAuthStore(); 

    const [dates, setDates] = useState<CourseDate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreDates, setHasMoreDates] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // State for Add/Edit Modal
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingDate, setEditingDate] = useState<CourseDate | null>(null);
    const [formState, setFormState] = useState<CourseDateFormState>({
      start_date: '',
      end_date: '',
      max_participants: 10,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // State for View Participants Modal
    const [isViewParticipantsModalOpen, setIsViewParticipantsModalOpen] = useState(false);
    const [selectedDateForParticipants, setSelectedDateForParticipants] = useState<CourseDate | null>(null);
    const [participants, setParticipants] = useState<BookingWithUser[]>([]);
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
    const [participantsError, setParticipantsError] = useState<string | null>(null);

    // Memoize course to prevent unnecessary re-renders
    const course = useMemo(() => courses.find(c => c.id === courseId), [courseId]);

    const fetchDates = useCallback(async (page = 0, append = false) => {
        if (!courseId) {
             setError("Course ID is missing.");
             setIsLoading(false);
             return;
        }
        
        if (page === 0) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }
        
        setError(null);
        
        try {
            const from = page * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            
            const { data, error: fetchError, count } = await supabase
                .from('course_dates')
                .select('*', { count: 'exact' })
                .eq('course_id', courseId)
                .order('start_date', { ascending: true })
                .range(from, to);

            if (fetchError) throw fetchError;
            
            // Set if there are more dates to load
            setHasMoreDates(data && data.length === PAGE_SIZE);
            
            if (append && data) {
                setDates(prevDates => [...prevDates, ...data]);
            } else {
                setDates(data || []);
            }
        } catch (err: any) {
            console.error('Error fetching course dates:', err);
            setError(`Failed to fetch dates: ${err.message}. Check RLS policies.`);
            if (!append) {
                setDates([]); // Only clear dates on error for initial load
            }
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [courseId]);

    const loadMoreDates = () => {
        if (!isFetchingMore && hasMoreDates) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchDates(nextPage, true);
        }
    };

    useEffect(() => {
        setCurrentPage(0);
        fetchDates(0, false);
    }, [fetchDates]);

    // --- Modal Handling ---

    const openAddModal = () => {
        setEditingDate(null);
        setFormState({ start_date: '', end_date: '', max_participants: 10 });
        setFormError(null);
        setIsAddEditModalOpen(true);
    };

    const openEditModal = (date: CourseDate) => {
        setEditingDate(date);
        // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
        const formatForInput = (dateStr: string) => {
            try {
                return format(new Date(dateStr), "yyyy-MM-dd'T'HH:mm");
            } catch {
                return ''; // Handle invalid date format gracefully
            }
        };
        setFormState({
            start_date: formatForInput(date.start_date),
            end_date: formatForInput(date.end_date),
            max_participants: date.max_participants,
        });
        setFormError(null);
        setIsAddEditModalOpen(true);
    };

    const closeAddEditModal = () => {
        setIsAddEditModalOpen(false);
        setEditingDate(null);
        setFormError(null);
    };

    const openViewParticipantsModal = async (date: CourseDate) => {
        setSelectedDateForParticipants(date);
        setIsViewParticipantsModalOpen(true);
        setIsLoadingParticipants(true);
        setParticipantsError(null);
        setParticipants([]); // Clear previous participants
        try {
            const { data, error: participantsFetchError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    users ( first_name, last_name, email )
                `)
                .eq('course_date_id', date.id)
                .limit(50); // Limit number of participants loaded to avoid performance issues

            if (participantsFetchError) throw participantsFetchError;
             // Explicitly cast the data to the expected type
            setParticipants((data as BookingWithUser[]) || []);
        } catch (err: any) {
            console.error('Error fetching participants:', err);
            setParticipantsError(`Failed to fetch participants: ${err.message}`);
        } finally {
            setIsLoadingParticipants(false);
        }
    };

    const closeViewParticipantsModal = () => {
        setIsViewParticipantsModalOpen(false);
        setSelectedDateForParticipants(null);
        setParticipants([]);
        setParticipantsError(null);
    };

    // --- CRUD Operations ---

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormState(prevState => ({
        ...prevState,
        [name]: name === 'max_participants' ? parseInt(value, 10) || 0 : value,
      }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) {
            setFormError("Cannot save date without a course ID.");
            return;
        }
        if (!formState.start_date || !formState.end_date || formState.max_participants <= 0) {
            setFormError("Please provide valid start date, end date, and max participants (> 0).");
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        try {
            const startDateIso = new Date(formState.start_date).toISOString();
            const endDateIso = new Date(formState.end_date).toISOString();

            if (editingDate) {
                // Update existing date
                const { error: updateError } = await supabase
                    .from('course_dates')
                    .update({
                        start_date: startDateIso,
                        end_date: endDateIso,
                        max_participants: formState.max_participants,
                    })
                    .eq('id', editingDate.id);
                if (updateError) throw updateError;
            } else {
                // Add new date
                const { error: insertError } = await supabase
                    .from('course_dates')
                    .insert({
                        course_id: courseId,
                        start_date: startDateIso,
                        end_date: endDateIso,
                        max_participants: formState.max_participants,
                        // current_participants defaults to 0 in DB schema presumably
                    });
                 if (insertError) throw insertError;
            }
            closeAddEditModal();
            // Reset to first page and refresh all dates
            setCurrentPage(0);
            fetchDates(0); 
        } catch (err: any) {
             console.error('Error saving course date:', err);
             setFormError(`Failed to save date: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDate = async (dateId: string, currentParticipants: number) => {
        if (currentParticipants > 0) {
             if (!window.confirm(`Warning: ${currentParticipants} user(s) are booked for this date slot. You cannot delete this date until all bookings are removed or reassigned. Would you like to view the participants?`)) {
                 return;
             }
             // Instead of trying to delete, open the participants modal to show who is booked
             const dateToView = dates.find(d => d.id === dateId);
             if (dateToView) {
                openViewParticipantsModal(dateToView);
             }
             return;
        } else {
            if (!window.confirm('Are you sure you want to delete this date slot?')) {
                return;
            }
        }
        
        try {
            // Only proceed with deletion if there are no participants
            // Optimistic UI update to improve perceived performance
            setDates(prevDates => prevDates.filter(d => d.id !== dateId));
             
            const { error: deleteError } = await supabase
                .from('course_dates')
                .delete()
                .eq('id', dateId);

            if (deleteError) {
                throw deleteError;
                // If there was an error, we'll reload all dates in the catch block
            }
             
        } catch (err: any) {
            console.error('Error deleting date:', err);
            
            // Check if it's a foreign key constraint violation
            if (err.message && err.message.includes("violates foreign key constraint")) {
                setError(`Failed to delete date: This date has bookings associated with it. You must handle these bookings before deleting the date.`);
            } else {
                setError(`Failed to delete date: ${err.message}`);
            }
            
            // Reset to first page and refresh all dates if there was an error
            setCurrentPage(0);
            fetchDates(0); 
        }
    };

    // --- Render ---

    // Memoize formatted dates to prevent unnecessary re-renders
    const formattedDates = useMemo(() => {
        return dates.map(date => ({
            ...date,
            formattedStartDate: format(new Date(date.start_date), 'MMM d, yyyy HH:mm'),
            formattedEndDate: format(new Date(date.end_date), 'MMM d, yyyy HH:mm'),
            formattedCreatedAt: format(new Date(date.created_at), 'MMM d, yyyy')
        }));
    }, [dates]);

    return (
        <>
            <Header variant="dark-text" />
            <main className="min-h-screen bg-tactical-50 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header and Back Link */}
                    <div className="mb-6 flex justify-between items-center">
                         <div>
                              <Link to="/admin/dashboard" className="text-accent-600 hover:text-accent-800 text-sm mb-2 inline-block">
                            &larr; Back to Admin Dashboard
                        </Link>
                              <h1 className="text-3xl font-heading font-bold text-tactical-900">Manage Dates</h1>
                              <p className="text-tactical-700">Course: <span className="font-semibold">{course ? course.title : 'Loading...'} ({courseId || 'N/A'})</span></p>
                    </div>
                         <Button onClick={openAddModal} variant="primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Date Slot
                        </Button>
                    </div>

                    {/* Main Error Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold mr-2">Error!</strong>
                            <span className="block sm:inline">{error}</span>
                            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <X className="h-6 w-6 text-red-500" />
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-10">
                           <Loader className="w-12 h-12 animate-spin text-accent-600 mx-auto mb-4" />
                            <p className="text-tactical-600">Loading Dates...</p>
                        </div>
                    )}

                    {/* Dates Table */}
                    {!isLoading && !error && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-tactical-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">Start Date & Time</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">End Date & Time</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-tactical-700 uppercase tracking-wider">Participants</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tactical-700 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-tactical-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formattedDates.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-tactical-500">
                                                <Calendar className="w-10 h-10 mx-auto mb-2 text-tactical-400" />
                                                No date slots found for this course. Add one using the button above.
                                            </td>
                                        </tr>
                                    ) : (
                                        formattedDates.map((date) => (
                                            <tr key={date.id} className="hover:bg-tactical-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tactical-900">
                                                    {date.formattedStartDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-700">
                                                    {date.formattedEndDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-700 text-center">
                                                    {date.current_participants} / {date.max_participants}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-tactical-600">
                                                    {date.formattedCreatedAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                                     <Button variant="outline" size="sm" onClick={() => openViewParticipantsModal(date)} title="View Participants">
                                                        <Users className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => openEditModal(date)} title="Edit Date">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => handleDeleteDate(date.id, date.current_participants)} 
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                                        title="Delete Date"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Load More Button */}
                            {hasMoreDates && (
                                <div className="px-6 py-4 text-center border-t border-gray-200">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={loadMoreDates}
                                        disabled={isFetchingMore}
                                    >
                                        {isFetchingMore ? (
                                            <>
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                Loading More Dates...
                                            </>
                                        ) : (
                                            'Load More Dates'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Add/Edit Date Modal */}
            <Modal isOpen={isAddEditModalOpen} onClose={closeAddEditModal} title={editingDate ? 'Edit Course Date' : 'Add New Course Date'}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {formError && (
                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm" role="alert">
                             {formError}
                         </div>
                    )}
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            value={formState.start_date}
                            onChange={handleFormChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                        />
                    </div>
                     <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            value={formState.end_date}
                            onChange={handleFormChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                        />
                    </div>
                     <div>
                        <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                        <input
                            type="number"
                            id="max_participants"
                            name="max_participants"
                            value={formState.max_participants}
                            onChange={handleFormChange}
                            required
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-3">
                         <Button type="button" variant="outline" onClick={closeAddEditModal} disabled={isSubmitting}>
                             Cancel
                         </Button>
                         <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (editingDate ? 'Update Date' : 'Add Date')}
                         </Button>
                    </div>
                </form>
            </Modal>

             {/* View Participants Modal */}
             <Modal 
                isOpen={isViewParticipantsModalOpen} 
                onClose={closeViewParticipantsModal} 
                title={`Participants for ${selectedDateForParticipants ? format(new Date(selectedDateForParticipants.start_date), 'MMM d, yyyy') : 'Date'}`}
             >
                 <div className="mt-4 min-h-[200px] bg-white text-tactical-900 rounded-md p-4"> {/* Added light background and text color */}
                    {participantsError && (
                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4" role="alert">
                             <strong className="font-bold mr-1">Error!</strong> {participantsError}
                         </div>
                    )}
                    {isLoadingParticipants && (
                        <div className="flex justify-center items-center py-10">
                            <Loader className="w-8 h-8 animate-spin text-accent-600" />
                            <span className="ml-2 text-tactical-700">Loading participants...</span>
                         </div>
                    )}
                     {!isLoadingParticipants && !participantsError && (
                        participants.length === 0 ? (
                             <p className="text-center text-tactical-500 py-10">No participants booked for this date slot yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto bg-white rounded-md">
                                {participants.map(booking => (
                                    <li key={booking.id} className="py-3 px-3 bg-white hover:bg-tactical-50 transition-colors">
                                        <p className="text-sm font-medium text-tactical-900">
                                             {booking.users?.first_name || 'N/A'} {booking.users?.last_name || ''}
                                         </p>
                                         <p className="text-sm text-tactical-600">{booking.users?.email || 'No email'}</p>
                                         <p className="text-xs text-tactical-500 mt-1">Booking ID: {booking.id} | Status: {booking.payment_status}</p>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                    <div className="mt-6 text-right">
                        <Button variant="outline" onClick={closeViewParticipantsModal}>Close</Button>
                    </div>
                 </div>
            </Modal>
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