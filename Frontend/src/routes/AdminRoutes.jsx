import EventManagement from '../Components/admin/EventManagement';
import AdminFacilityPanel from '../Components/FacilityBooking/AdminFacilityPanel';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="events" element={
          <ProtectedRoute allowedRoles={["admin","board-member"]}>
            <EventManagement />
          </ProtectedRoute>
        } />
        
      </Route>
    </Routes>
  );
}; 