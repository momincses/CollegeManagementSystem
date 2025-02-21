import EventManagement from '../Components/admin/EventManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* ... other admin routes ... */}
        <Route path="events" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EventManagement />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}; 