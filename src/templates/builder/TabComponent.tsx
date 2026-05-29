'use client';

import { useMemo } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function DesignerTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('admin');
  const IsDataCollection = search === 'data-collection';

  const { builderId, currentTab } = useMemo(() => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    const builderIndex = segments.indexOf('builder');
    const id = builderIndex !== -1 ? segments[builderIndex + 1] : null;
    
    const lastSegment = segments.at(-1);
    let tab = 2; 
    if (lastSegment === 'condition') tab = 0;
    else if (lastSegment === 'calculator') tab = 1;
    
    return { builderId: id, currentTab: tab };
  }, [pathname]);

  const tabRoutes = useMemo(() => {
    if (!builderId) return [];
    return [
      `/builder/${builderId}/condition`,
      `/builder/${builderId}/calculator`,
      `/builder/${builderId}`,
    ];
  }, [builderId]);

  if (IsDataCollection || !builderId) {
    return null;
  }

  return (
    <Box
      width='100%'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: '4px',
        px: '16px',
      }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Tabs
          value={currentTab}
          TabIndicatorProps={{ style: { backgroundColor: '#2CDFC9' } }}
          sx={{
            '&.MuiTabs-root': { width: '100%', px: { md: '10px', lg: '40px' } },
            '& .MuiTabs-indicator': {
              height: '3px',
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.2s ease-in-out', 
            },
            '& .Mui-selected': {
              color: '#393939 !important',
              fontWeight: 700,
            },
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            },
          }}>
          <Tab 
            component={Link}
            href={`${tabRoutes[0]}?${searchParams.toString()}`}
            disableRipple 
            label='شرط'
            prefetch={true} 
          />
          <Tab 
            component={Link}
            href={`${tabRoutes[1]}?${searchParams.toString()}`}
            disableRipple 
            label='محاسبه‌گر'
            prefetch={true} 
          />
          <Tab 
            component={Link}
            href={`${tabRoutes[2]}?${searchParams.toString()}`}
            disableRipple 
            label='پرسشنامه'
            prefetch={true}
          />
        </Tabs>
      </Box>
    </Box>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { Box, Tab, Tabs } from '@mui/material';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// export default function DesignerTabs() {
//   const [value, setValue] = useState<number>(2);
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const search = searchParams.get('admin');
//   const IsDataCollection = search === 'data-collection';


//   const segments = pathname ? pathname.split('/').filter(Boolean) : [];
//   const builderIndex = segments.indexOf('builder');
//   const builderId = builderIndex !== -1 ? segments[builderIndex + 1] : null;

//   const handleChange = (_: React.SyntheticEvent, newValue: number) => {
//     if(IsDataCollection) { return }
//     if (newValue < 0 || newValue > 2) return;

//     setValue(newValue);

//     if (!builderId) return;

//     const tabRoutes = [`/builder/${builderId}/condition`, `/builder/${builderId}/calculator`, `/builder/${builderId}`];

//     const targetRoute = tabRoutes[newValue];
//     if (!targetRoute) return;

//     const query = searchParams.toString();
//     const finalRoute = query ? `${targetRoute}?${query}` : targetRoute;

//     router.push(finalRoute);
//   };


//   useEffect(() => {
//     if (!pathname) return;

//     const lastSegment = segments.at(-1);
//     let tabValue = 2;
//     if (lastSegment === 'condition') tabValue = 0;
//     else if (lastSegment === 'calculator') tabValue = 1;
//     else if (lastSegment === 'create') tabValue = 1;

//     setValue(tabValue);
//   }, [pathname]);

//   return (
//     <Box
//       width='100%'
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         mt: '4px',
//         px: '16px',
//       }}>
//       <Box
//         sx={{
//           borderBottom: 1,
//           borderColor: 'divider',
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           TabIndicatorProps={{ style: { backgroundColor: '#2CDFC9' } }}
//           sx={{
//             '&.MuiTabs-root': { width: '100%', px: { md: '10px', lg: '40px' } },
//             '& .MuiTabs-indicator': {
//               height: '3px',
//               borderRadius: '3px 3px 0 0',
//             },
//             '& .Mui-selected': {
//               color: '#393939 !important',
//               fontWeight: 700,
//             },
//             '& .MuiTabs-flexContainer': {
//               display: 'flex',
//               justifyContent: IsDataCollection ? 'end' : 'space-between',
//               width: '100%',
//             },
//           }}>
//           {!IsDataCollection && <Tab disableRipple label='شرط' />}
//           {!IsDataCollection && <Tab disableRipple label='محاسبه‌گر' />}
//           <Tab disableRipple label='پرسشنامه' />
//         </Tabs>
//       </Box>
//     </Box>
//   );
// }
