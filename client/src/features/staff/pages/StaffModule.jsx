import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Plus, Edit, Trash2, Users, CheckCircle } from 'lucide-react';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../../../store/slices/staffSlice';
import StaffModal from '../components/StaffModal';
import StatsCard from '../../dashboard/components/StatsCard';

export default function StaffModule({ showToast, requestConfirm }) {
  const dispatch = useDispatch();
  const { staffList, status } = useSelector((state) => state.staff);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalData, setModalData] = useState({
    name: '', employeeId: '', email: '', phone: '', role: 'staff', isActive: true, password: ''
  });
  const [modalErrors, setModalErrors] = useState({});

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const activeCount = staffList.filter(s => s.isActive).length;

  const generateEmployeeId = () => 'EMP-' + Math.floor(1000 + Math.random() * 9000);
  const generatePassword = () => Math.random().toString(36).slice(-8);

  const openModal = (staff = null) => {
    if (staff) {
      setSelectedStaff(staff);
      setModalData({
        name: staff.name,
        employeeId: staff.employeeId || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role,
        isActive: staff.isActive,
        password: ''
      });
    } else {
      setSelectedStaff(null);
      setModalData({
        name: '', 
        employeeId: generateEmployeeId(), 
        email: '',
        phone: '', 
        role: 'staff', 
        isActive: true, 
        password: generatePassword()
      });
    }
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({ ...prev, [name]: value }));
    if (modalErrors[name]) setModalErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!modalData.name.trim()) tempErrors.name = 'Name is required';
    if (modalData.role !== 'customer' && !modalData.employeeId.trim()) tempErrors.employeeId = 'Employee ID is required';
    if (modalData.role === 'customer' && !modalData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (modalData.role === 'customer' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalData.email)) {
      tempErrors.email = 'Invalid email address';
    }
    
    // Password required only for new user
    if (!selectedStaff && !modalData.password) {
      tempErrors.password = 'Password is required for new user';
    } else if (modalData.password && modalData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(tempErrors).length > 0) {
      setModalErrors(tempErrors);
      return;
    }

    try {
      const payload = { ...modalData };
      if (!payload.password) {
        delete payload.password;
      }
      if (payload.role === 'customer') {
        delete payload.employeeId;
      } else {
        delete payload.email;
      }

      if (selectedStaff) {
        await dispatch(updateStaff({ id: selectedStaff._id, data: payload })).unwrap();
        if (showToast) showToast('User updated successfully');
      } else {
        await dispatch(createStaff(payload)).unwrap();
        if (showToast) showToast('New user created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      if (showToast) showToast(typeof err === 'string' ? err : 'Failed to save user', 'Error');
    }
  };

  const handleDelete = async (id, name) => {
    if (id === currentUser._id) {
      if (showToast) showToast('You cannot delete your own account.', 'Error');
      return;
    }
    requestConfirm(`Are you sure you want to delete ${name}?`, async () => {
      try {
        await dispatch(deleteStaff(id)).unwrap();
        if (showToast) showToast(`User ${name} deleted successfully`);
      } catch (err) {
        if (showToast) showToast(typeof err === 'string' ? err : 'Failed to delete user', 'Error');
      }
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header / Intro */}
      <div className="border-b border-gold/10 pb-5 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-title-md md:text-title-lg font-display bg-gradient-to-r from-gold-light via-gold to-cream bg-clip-text text-transparent font-bold drop-shadow-md tracking-wider uppercase">User Management</h2>
          <p className="text-body-sm text-cream/60 mt-1.5">
            Manage restaurant staff, admin, and client accounts, check roles, and update profile statuses.
          </p>
          <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent mt-4 rounded-full" />
        </div>
        <button
          onClick={() => openModal(null)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#1A0A00] font-bold text-label-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(201,149,42,0.18)] hover:shadow-[0_6px_22px_rgba(201,149,42,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left animate-fade-in">
        <StatsCard label="Total Users" value={staffList.length} icon={Users} valueColorClass="text-gold" />
        <StatsCard label="Active Status" value={activeCount} icon={CheckCircle} valueColorClass="text-emerald-400" />
      </section>

      <section className="border border-gold/15 bg-gradient-to-b from-[#1F1108]/85 to-[#0F0500]/95 backdrop-blur-md shadow-2xl overflow-hidden rounded-xl relative animate-scale-up">
        <div className="overflow-x-auto w-full relative z-10">
          {status === 'loading' ? (
            <div className="py-20 text-center text-cream/40 text-body-sm font-body">Loading users...</div>
          ) : staffList.length === 0 ? (
            <div className="py-20 text-center text-cream/40 text-body-sm font-body">No users found.</div>
          ) : (
            <table className="w-full text-left border-collapse text-body-md">
              <thead>
                <tr className="border-b border-gold/15 text-gold uppercase tracking-[0.15em] text-label-sm bg-[#120500]/80 font-body">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-4">Employee ID / Email</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gold/[0.03] transition-colors duration-300">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-ivory font-display text-body-lg font-bold tracking-wide">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-cream/85 font-mono font-semibold">
                      {staff.role === 'customer' ? staff.email : staff.employeeId}
                    </td>
                    <td className="py-4 px-4 text-cream/80 capitalize font-body font-semibold">
                      {staff.role === 'customer' ? 'Client' : staff.role}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full border text-label-xs uppercase tracking-wider font-bold ${staff.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(staff)}
                          className="p-1.5 border border-gold/15 hover:border-gold/45 bg-[#1A0A00]/50 text-cream/60 hover:text-gold rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff._id, staff.name)}
                          className="p-1.5 border border-accent-red/25 hover:border-accent-red/65 bg-[#1A0A00]/50 text-accent-red/60 hover:text-ivory rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <StaffModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedStaff={selectedStaff}
        modalData={modalData}
        modalErrors={modalErrors}
        handleModalInputChange={handleModalInputChange}
        handleModalSave={handleModalSave}
      />
    </div>
  );
}
