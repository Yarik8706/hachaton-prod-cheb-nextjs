"use client"

import UserInterests from '@/app/home/profile/UserInterests'
import { useProfile } from '@/store/profile.store'

export default function ProfilePage() {
  
  const {profile} = useProfile()

  return (
    <div className="w-full flex flex-col px-6 py-10">

      
      <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-6 shadow-sm">

        {/* Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">N</span>
            </div>

            <div className="text-[16px] text-gray-800">
              Имя пользователя
            </div>
          </div>

          <div className="text-gray-400 text-xl">›</div>
        </div>

        {/* Interests */}
        <UserInterests
          interests={[
            "Программирование",
            "Информационная безопасность",
            "Фронтенд",
            "Игровая разработка",
          ]}
        />

        <div className="flex justify-end mt-1">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 transition text-black px-5 py-2 rounded-xl text-sm font-medium">
            Изменить интересы
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-10">
        <button className="px-5 py-3 bg-[#f4f6f9] rounded-2xl text-blue-500 font-medium">
          Выйти
        </button>
      </div>

    </div>
  );

}