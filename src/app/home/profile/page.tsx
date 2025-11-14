"use client"

import UserInterests from '@/app/home/profile/UserInterests'
import { useProfile } from '@/store/profile.store'
import { useInterestsModal } from '@/components/dialogs/GlobalInterestsDialog'
import CommonSpinner from '@/components/common/CommonSpinner'
import { useEffect } from 'react'

export default function ProfilePage() {

  const setOpen = useInterestsModal((s) => s.setOpen);
  const {profile, isLoading, fetchProfile } = useProfile()

  useEffect(() => {
    if (profile == null){
      fetchProfile()
    } 
  }, [])

  return (
    <div className="w-full flex flex-col md:px-6 py-10">
      {isLoading && <CommonSpinner variant={"outline"} title={"Загрузка профиля..."} />}
      {!isLoading && profile &&
        <>
          <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-6 shadow-sm">
            <div className="text-2xl font-semibold">Профиль</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{profile?.email?.[0]}</span>
                </div>

                <div className="text-[16px] text-gray-800">
                  {profile?.email}
                </div>
              </div>
            </div>

            <UserInterests
              interests={profile!.interests}
            />

            <div className="flex justify-end mt-1">
              <button
                onClick={() => setOpen(true)}
                className="bg-[var(--main-color)] hover:bg-yellow-500 transition text-black px-5 py-3 rounded-xl text-sm font-medium">
                Изменить интересы
              </button>
            </div>
          </div>
          <div className="mt-10">
            <button className="px-5 py-3 bg-white rounded-2xl text-blue-500 font-medium shadow-sm">
              Выйти
            </button>
          </div>
        </>
      }
    </div>
  );

}