import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutComponentAdmin from './components/layout/layoutAdmin';
import LayoutComponentUser from './components/layout/layoutUser';
import LoadingLayout from './components/loadingLayout';
import Error from './pages/error';
import Login from './pages/login';
import ProtectedRoute from './routes/ProtectedRoute';
import { CheckRole } from './utils';


const CreateUser = React.lazy(() => import('./pages/user/create'));
const ManageUser = React.lazy(() => import('./pages/user/manager'));
const Messages = React.lazy(() => import('./pages/messages/index'));
const TitleSetting = React.lazy(() => import('./pages/titleSetting/index'));
const ChatboxLogoSetting = React.lazy(() => import('./pages/chatboxLogoSetting/index'));
const RandomChatSetting = React.lazy(() => import('./pages/randomChatSetting/index'));
const DoctorReferralSetting = React.lazy(() => import('./pages/doctorReferralSetting/index'));
const Friend = React.lazy(() => import('./pages/friends/index'));
const History = React.lazy(() => import('./pages/history/index'));
const ManageLabel = React.lazy(() => import('./pages/label/manager'));
const CreateLabel = React.lazy(() => import('./pages/label/create'));
const ManagerBlockIP = React.lazy(() => import('./pages/blockIp/manager'));
const CreateBlockIp = React.lazy(() => import('./pages/blockIp/create'));
const Profile = React.lazy(() => import('./pages/profile'));
const ChatOrder = React.lazy(() => import('./pages/chatOrder'));
const TimeDisplayChat = React.lazy(() => import('./pages/timeDisplaychat'));
const LiveChatColorSettings = React.lazy(() => import('./pages/liveChatColorSettings'));



function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* 👤 USER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.ADMIN.toString(), CheckRole.QUANLY.toString(), CheckRole.TUVAN.toString(), CheckRole.GOOGLE.toString()]} />}>
        <Route path="/" element={<LayoutComponentUser />}>
          <Route index element={<Suspense fallback={<LoadingLayout />}> <Messages /></Suspense>} />
          <Route path="cai-dat-tieu-de-chat-random" element={<Suspense fallback={<LoadingLayout />}><TitleSetting /></Suspense>} />
          <Route path="cai-dat-logo-chat-box" element={<Suspense fallback={<LoadingLayout />}><ChatboxLogoSetting /></Suspense>} />
          <Route path="cai-dat-chat-random" element={<Suspense fallback={<LoadingLayout />}><RandomChatSetting /></Suspense>} />
          <Route path="cai-dat-gioi-thieu-bac-si" element={<Suspense fallback={<LoadingLayout />}><DoctorReferralSetting /></Suspense>} />
          <Route path="add-friend" element={<Suspense fallback={<LoadingLayout />}><Friend /></Suspense>} />
          <Route path="history" element={<Suspense fallback={<LoadingLayout />}><History /></Suspense>} />
          <Route path="ho-so-ca-nhan" element={<Suspense fallback={<LoadingLayout />}><Profile /></Suspense>} />
          <Route path="cai-dat-thu-tu-nhan-chat-tu-van" element={<Suspense fallback={<LoadingLayout />}><ChatOrder /></Suspense>} />
          <Route path="cai-dat-thoi-gian" element={<Suspense fallback={<LoadingLayout />}><TimeDisplayChat /></Suspense>} />
          <Route path="cai-dat-mau-sac-live-chat" element={<Suspense fallback={<LoadingLayout />}><LiveChatColorSettings /></Suspense>} />
        </Route>
      </Route>

      {/* 🛠️ ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.ADMIN.toString()]} />}>
        <Route path="/admin" element={<LayoutComponentAdmin />}>
          <Route path="quan-ly-nguoi-dung" element={<Suspense fallback={<LoadingLayout />}><ManageUser /></Suspense>} />
          <Route path="quan-ly-nguoi-dung/them-moi" element={<Suspense fallback={<LoadingLayout />}> <CreateUser /> </Suspense>} />
          <Route path="quan-ly-nguoi-dung/cap-nhat/:id" element={<Suspense fallback={<LoadingLayout />}> <CreateUser /></Suspense>} />

          {/* router label */}
          <Route path="quan-ly-nhan" element={<Suspense fallback={<LoadingLayout />}><ManageLabel /></Suspense>} />
          <Route path="quan-ly-nhan/them-moi" element={<Suspense fallback={<LoadingLayout />}><CreateLabel /></Suspense>} />
          <Route path="quan-ly-nhan/cap-nhat/:id" element={<Suspense fallback={<LoadingLayout />}><CreateLabel /></Suspense>} />

          {/* danh sách ip chặn */}
          <Route path="quan-ly-ip" element={<Suspense fallback={<LoadingLayout />}><ManagerBlockIP /></Suspense>} />
          <Route path="quan-ly-ip/them-moi" element={<Suspense fallback={<LoadingLayout />}><CreateBlockIp /></Suspense>} />
          <Route path="quan-ly-ip/cap-nhat/:id" element={<Suspense fallback={<LoadingLayout />}><CreateBlockIp /></Suspense>} />
        </Route>
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default App
