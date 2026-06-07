import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../../../store/slices/staffSlice';
import StaffModal from '../components/StaffModal';

export default function StaffModule({ showToast, requestConfirm }) {
  const dispatch = useDispatch();
  const { staffList, status } = useSelector((state) => state.staff);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalData, setModalData] = useState({
    name: '', employeeId: '', phone: '', role: 'staff', isActive: true, password: ''
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
    if (!modalData.employeeId.trim()) tempErrors.employeeId = 'Employee ID is required';
    
    // Password required only for new staff
    if (!selectedStaff && !modalData.password) {
      tempErrors.password = 'Password is required for new staff';
    } else if (modalData.password && modalData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(tempErrors).length > 0) {
      setModalErrors(tempErrors);
      return;
    }

    try {
      if (selectedStaff) {
        const payload = { ...modalData };
        if (!payload.password) delete payload.password;
        await dispatch(updateStaff({ id: selectedStaff._id, data: payload })).unwrap();
      } else {
        await dispatch(createStaff(modalData)).unwrap();
        if (showToast) showToast('New staff member created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      if (showToast) showToast(typeof err === 'string' ? err : 'Failed to save staff member', 'Error');
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
        if (showToast) showToast(`Staff member ${name} deleted successfully`);
      } catch (err) {
        if (showToast) showToast(typeof err === 'string' ? err : 'Failed to delete staff member', 'Error');
      }
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header / Intro */}
      <div className="border-b border-gold/10 pb-4 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-title-md md:text-title-lg font-display text-gold-light font-bold drop-shadow-md tracking-wide">Staff Management</h2>
          <p className="text-body-sm text-cream/60 mt-1">
            Manage restaurant staff members, check roles, and update current access statuses.
          </p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="w-full md:w-auto px-5 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-bold text-label-xs uppercase tracking-widest rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Staff
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Total Staff</span>
          <span className="font-display text-title-md text-gold block mt-2 font-bold">{staffList.length}</span>
        </div>
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Active Status</span>
          <span className="font-display text-title-md text-emerald-400 block mt-2 font-bold">{activeCount}</span>
        </div>
      </section>

      <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
        <div className="overflow-x-auto w-full relative z-10">
          {status === 'loading' ? (
            <div className="py-16 text-center text-cream/40 text-body-sm font-body">Loading...</div>
          ) : staffList.length === 0 ? (
            <div className="py-16 text-center text-cream/40 text-body-sm font-body">No staff found.</div>
          ) : (
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-4">Employee ID</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gold/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-ivory font-display text-body-md font-bold">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-cream/80 font-mono">{staff.employeeId}</td>
                    <td className="py-4 px-4 text-cream/80 capitalize">{staff.role}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${staff.isActive ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25' : 'bg-amber-950/40 text-amber-400 border-amber-500/25'}`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(staff)}
                        className="p-1.5 text-cream/50 hover:text-gold transition-colors"
                        title="Edit Staff"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(staff._id, staff.name)}
                        className="p-1.5 text-cream/50 hover:text-accent-red transition-colors"
                        title="Delete Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
