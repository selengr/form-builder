'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { AppBar, Box, Button, IconButton, Skeleton, Toolbar, Typography } from '@mui/material';
// components
import Avatar from '../Avatar/Avatar';
import { useUserInfoContext } from '@/context/UserInfoContext';

const TopAppBar = ({ customActions, appBarSx, toolbarSx, imageSx }: any) => {
  const router = useRouter();
  const { userInfo, isAuthenticated, clearUserInfo } = useUserInfoContext();
  const loading = false;

  const endPoint = process.env.NEXT_PUBLIC_MRESALAT_ENDPOINT || '';

  const handleAuth = async () => {
    if (isAuthenticated) {

      clearUserInfo()

      await signOut({ callbackUrl: '/' });
      toast.success('خروج با موفقیت انجام شد');
    } else {
      await signIn('authorize');
    }
  };

  const renderUserSection = () => {
    if (loading) {
      return (
        <div className='flex items-center gap-4'>
          <Skeleton variant='circular' width={50} height={50} />
          <div>
            <Skeleton width={100} />
            <Skeleton width={80} />
          </div>
        </div>
      );
    }

    if (userInfo) {
      return (
        <Link href={`${endPoint}/profile`}>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Avatar size='sm' name={userInfo?.user?.fullName || 'کاربر'} />
            <div>
              <Typography variant='body1'>{userInfo.user.fullName}</Typography>
              <Typography variant='caption'>مشاهده پروفایل</Typography>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Button onClick={handleAuth} sx={{ gap: 1 }}>
        <Image src='/images/home-page/login.svg' alt='ورود' width={24} height={24} />
        {customActions ?? <Typography color='#424242'>ورود</Typography>}
      </Button>
    );
  };

  return (
    <AppBar elevation={0} position='static' className={'bg-white'} sx={{ pt: 2, height: '100px', bgcolor: '#fff', color: 'black', ...appBarSx }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          ...toolbarSx,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', ...imageSx }}>{renderUserSection()}</Box>

        <Box className='flex items-center gap-2'>
          <IconButton size='small' onClick={() => router.push('#')}>
            <Image src='/images/home-page/search.svg' alt='search' width={24} height={24} draggable={false} />
          </IconButton>

          <IconButton size='small'>
            <Image src='/images/home-page/notification.svg' alt='notification' width={24} height={24} draggable={false} />
          </IconButton>
          {userInfo && (
            <IconButton onClick={handleAuth}>
              {loading ? (
                <Skeleton variant='circular' width={24} height={24} />
              ) : (
                <Image className={userInfo ? 'rotate-180' : ''} src={'/images/home-page/logout.svg'} alt={'خروج'} width={24} height={24} />
              )}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
