import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, MessageSquare, LogOut, Home, Users, MessageCircle, User } from 'lucide-react';
import { api } from '../services/api';

interface FriendsListProps {
  onLogout: () => void;
  username: string;
}

export default function FriendsList({ onLogout, username }: FriendsListProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const data = await api.getFriends();
      setFriends(data);
    } catch (err: any) {
      setErrorMsg(err.message || '無法載入好友列表');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans text-[#1a1c1c] antialiased">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm flex justify-between items-center px-4 h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#d0e5f5]">
            <img 
              alt="User profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCevB4LfGDU9pZZLIl15l-zcVO1cF-ZB93dUfLJ8uCAWNLayik26KFC54Af22VLNfbl3HdUSRkBefBRh1Hf4pst4P-Q2Mvt0vBFqsAZEUgqQhTZU5IQE4AirwqEUW_6IoPLo1vOA9bBCQx5oTTMW2yqZaNqMuzVdHW1v7wpXlmbfL7qbXvsd_UCCrp3y7PRCMk0z22uDeKvOQERVq-9o6_dTFdvkf5Ys74jM-4PQMrvXp2jUAVSP9or7IetbAp7-u-RNSWh7ghFygQB" 
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{username}'s Friends</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 duration-150">
          <Settings className="text-slate-500 w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="pb-32 px-4 pt-4 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mica-effect rounded-xl shadow-sm border border-[#c3c7cb]/30 overflow-hidden"
        >
          {/* Friend List Container */}
          <div className="divide-y divide-[#c3c7cb]/30">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">載入中...</div>
            ) : errorMsg ? (
              <div className="p-8 text-center text-red-500">{errorMsg}</div>
            ) : friends.length === 0 ? (
              <div className="p-8 text-center text-slate-500">目前沒有其他註冊好友</div>
            ) : (
              friends.map((friend) => (
                <motion.div 
                  key={friend.id}
                  whileHover={{ backgroundColor: "rgba(243, 243, 243, 1)" }}
                  className="flex items-center justify-between p-4 transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        className="w-12 h-12 rounded-full object-cover bg-gray-200" 
                        src={friend.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                        alt={friend.username}
                        referrerPolicy="no-referrer"
                      />
                      {friend.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1c1c] leading-tight">{friend.username}</p>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">{friend.status || 'Offline'}</p>
                    </div>
                  </div>
                  <MessageSquare className="text-[#73787c] w-5 h-5" />
                </motion.div>
              ))
            )}

            {/* Logout Button Section */}
            <div className="p-6 flex flex-col items-center">
              <button 
                onClick={onLogout}
                className="w-full py-3 px-4 bg-[#ffdad6] text-[#93000a] rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90"
              >
                <LogOut size={20} />
                Logout
              </button>
              <p className="mt-4 text-xs text-[#73787c] italic">Showing all {friends.length} users</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 h-16 flex justify-around items-center px-4 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl">
        <NavItem icon={<Home size={22} />} label="Home" />
        <NavItem icon={<Users size={22} />} label="Friends" active />
        <NavItem icon={<MessageCircle size={22} />} label="Chat" />
        <NavItem icon={<User size={22} />} label="Me" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      className={`flex flex-col items-center justify-center py-1 px-3 transition-colors rounded-md ${active ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-100'}`} 
      href="#"
    >
      {icon}
      <span className="text-[11px] font-medium mt-1">{label}</span>
    </a>
  );
}
