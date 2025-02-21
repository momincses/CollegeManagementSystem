import EventManagement from '../Components/admin/EventManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="events" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EventManagement />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}; 