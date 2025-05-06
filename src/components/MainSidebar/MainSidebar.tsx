"use client";

import {signIn, signOut} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton"; // ✅ اضافه شده
import MenuSidebar from "@/components/SideBar/MenuSidebar";
import MresalatLogo from "@/../public/images/home-page/mresalat_logo.svg";
import LogoutIcon from "@/../public/images/home-page/logout.svg";
import InfoIcon from "@/../public/images/home-page/info-icon.svg";
import {toast} from "sonner";
import MiddleSidebar from "../MiddleSidebar/MiddleSidebar";
import Avatar from "@/components/Avatar/Avatar";
import {useUserInfo} from "@/hooks/useUserInfo";

export default function MainSidebar() {
    const {userInfo, loading} = useUserInfo();

    const handleAuthAction = async () => {
        if (!userInfo) {
            await signIn("authorize");
        } else {
            toast.success("خروج با موفقیت انجام شد");
            await signOut({callbackUrl: "/"});
        }
    };


    return (
        <>
            <div className='flex flex-col justify-between min-w-[100px] bg-white overflow-y-auto no-scrollbar'>
                <div className='flex flex-col gap-4 items-center pt-4'>
                    <Link href='/'>
                        <Image src={MresalatLogo} alt='Mresalat_Logo' width={64} height={15} priority/>
                    </Link>
                    {loading ? (
                        <div className='w-16 h-16 bg-neutral-200 border-2 border-blue-600 rounded-full' />
                    ) : (
                        <>{userInfo?.user?.fullName ? <Avatar size={'lg'} name={userInfo?.user?.fullName} /> : <div className='w-16 h-16 bg-neutral-200 border-2 border-blue-600 rounded-full' />}</>
                    )}
                </div>

                <div className='relative h-[520px] min-h-[520px] w-[80px]'>
                    <Image src='/images/home-page/right_sidebar_bg.svg' alt='Sidebar Background' fill className='object-cover z-0' priority />
                    <div className='relative z-10'>
                        <MenuSidebar />
                    </div>
                </div>

                <div className='flex flex-col gap-6 items-start pr-5 justify-center p-4'>
                    <button>
                        <Image src={InfoIcon} alt='Info' width={24} height={24} draggable={false} />
                    </button>

                    <button
                        onClick={async () => {
                            if (!userInfo) {
                                await signIn('authorize');
                            } else {
                                await signOut({ redirect: false });
                                toast.success('خروج با موفقیت انجام شد');
                                location.replace('/');
                            }
                        }}
                        className='flex items-center justify-center flex-col gap-1 min-h-[40px]'>
                        {loading ? (
                            <div className='w-6 h-6 bg-neutral-200 rounded-full animate-pulse' />
                        ) : (
                            <Image className={userInfo ? 'rotate-180' : 'rotate-0'} src={LogoutIcon} alt='Logout' width={24} height={24} />
                        )}

                        <span className='text-[10px] text-black font-bold'>{loading ? '...' : userInfo ? 'خروج' : 'ورود'}</span>
                    </button>
                </div>
            </div>

            <MiddleSidebar />
        </>
    );
}