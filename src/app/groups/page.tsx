'use client';

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import TotalGrid from "@/../public/images/home-page/total-grid.svg";
import PlusIcon from "@/../public/images/home-page/Add-fill.svg";
import SearchInput from "@/components/ListGrid/SearchInput";
import { GroupListItem, IGroup } from "./components/groupListItem";
import { CreateGroupDialog } from "@/app/groups/components/createGroupDialog";

// ⚠️ IMPORTANT: You MUST define or import getAccessToken() here.
// For example, if you use NextAuth.js and getToken:
// import { getToken } from 'next-auth/jwt'; // This is for server-side
// For client-side, it often comes from a hook or a client-side utility:
// import { useSession } from 'next-auth/react';
// Or, if it's a custom utility:
// import { getAccessToken } from '@/utils/auth'; // <--- Adjust this path based on your project structure

// Let's assume getAccessToken is a simple async function available in this scope
// For demonstration, I'll mock it. In your real app, import it from its source.
async function getAccessToken(): Promise<string | null> {
  // Replace this with your actual logic to retrieve the access token.
  // This could involve reading from a cookie, a global state, or making an API call.
  // For NextAuth.js, you might fetch session and extract token or use client-side methods.
  console.log('Attempting to retrieve access token...');
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate fetching a token
      const token = localStorage.getItem('myAppAuthToken') || 'dummy-jwt-token-12345';
      console.log('Token retrieved:', token ? 'YES' : 'NO');
      resolve(token);
    }, 100);
  });
}


// Define types for the data we expect from our API route
interface GroupItemAPI {
  groupName: string;
  groupId: number;
  groupMemberCount: number;
}

interface GroupListResponse {
  content: GroupItemAPI[];
  totalElements: number;
}

export default function GroupsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [groups, setGroups] = useState<IGroup[]>([]); // State to hold fetched groups
  const [totalGroups, setTotalGroups] = useState(0); // State for total count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch groups
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Token is now fetched using getAccessToken()
      const token = await getAccessToken();

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      // Construct the searchFilterModel string
      // This is a basic example; you might want to make this dynamic based on SearchInput
      const defaultSearchFilterModel = {
        searchFilterBoxList: [{ restrictionList: [] }],
        sortList: [{ fieldName: "id", type: "DSC" }],
        page: 0,
        rows: 10,
      };
      const encodedSearchFilterModel = encodeURIComponent(JSON.stringify(defaultSearchFilterModel));

      const response = await fetch(`/api/group/list?searchFilterModel=${encodedSearchFilterModel}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch groups');
      }

      const data: GroupListResponse = await response.json();

      // Map the API response to your IGroup interface
      const transformedGroups: IGroup[] = data.content.map(item => ({
        id: item.groupId,
        name: item.groupName,
        description: '', // API does not provide description, so leave it empty or fetch separately
        userCount: item.groupMemberCount,
      }));

      setGroups(transformedGroups);
      setTotalGroups(data.totalElements);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchGroups(); // Fetch groups on component mount
  }, [fetchGroups]);

  // Existing useEffect for CreateGroupDialog
  useEffect(() => {
    const isNewGroupQuery = searchParams.get('new');
    if (pathname === '/groups' && isNewGroupQuery !== null) {
      setShowCreateGroupDialog(true);
    } else {
      setShowCreateGroupDialog(false);
    }
  }, [pathname, searchParams]);

  const handleViewGroup = (groupId: string | number) => {
    router.push(`/groups/${groupId}`);
  };

  const handleDeleteGroup = (groupId: string | number) => {
    // Implement delete logic here, then refetch groups:
    // After deletion, call fetchGroups();
    console.log(`Delete group with ID: ${groupId}`);
  };

  const handleCreateGroupSubmit = (groupName: string) => {
    // After successful group creation, you might want to refetch the list
    router.back(); // Close dialog
    fetchGroups(); // Refresh the list
  };

  return (
    <div className="p-2 w-full h-[calc(100vh - 60px)] md:h-screen flex flex-col" draggable={false}>
      <main className="p-4 bg-white flex flex-col rounded-xl h-full">
        <div className="min-h-[52px] flex items-center justify-center relative rounded-xl bg-[#F7F7FF] mb-4 px-2">
          <p className="text-[16px] font-bold text-[#2a2a2a]">گروه‌ها</p>
          <button
            onClick={() => router.push("/")}
            className="absolute right-2 p-1 rounded-full hover:bg-gray-200"
            aria-label="بازگشت به صفحه اصلی"
          >
            <MdOutlineKeyboardArrowRight size={24} color="#292D32" />
          </button>
        </div>

        <div className="flex justify-center items-center mb-2">
          <div className="flex w-full max-w-lg items-center">
            <div className="flex-1 bg-[#ECFAFF] rounded-xl px-4 py-3.5 flex justify-between items-center ml-2">
              <div className="flex items-center gap-2 text-sm text-[#393939]">
                <Suspense fallback={<div>...</div>}>
                  <Image src={TotalGrid} width={20} height={20} alt="filter" draggable={false} />
                </Suspense>
                <span>تعداد کل گروه‌ها:</span>
              </div>
              <span className="font-semibold text-[#2a2a2a]">{totalGroups} عدد</span>
            </div>

            <button
              onClick={() => router.push("/groups?new")}
              className="w-[50px] h-[50px] border border-[#1758BA] rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="افزودن گروه جدید"
            >
              <Suspense fallback={<div>...</div>}>
                <Image src={PlusIcon} alt="افزودن" width={24} height={24} draggable={false} />
              </Suspense>
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-3">
          <div className="w-full max-w-lg">
            <Suspense fallback={<div>در حال بارگذاری جستجو...</div>}>
              <SearchInput />
            </Suspense>
          </div>
        </div>

        <div className="flex justify-center flex-1 overflow-y-auto pb-6 min-h-0">
          {loading ? (
            <p className="text-gray-600">در حال بارگذاری گروه‌ها...</p>
          ) : error ? (
            <p className="text-red-500">خطا در بارگذاری گروه‌ها: {error}</p>
          ) : groups.length === 0 ? (
            <p className="text-gray-500">هیچ گروهی برای نمایش وجود ندارد.</p>
          ) : (
            <div className="w-full max-w-lg flex flex-col gap-[10px]">
              {groups.map((group) => (
                <GroupListItem
                  key={group.id}
                  group={group}
                  onViewGroup={handleViewGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreateGroupDialog && (
        <CreateGroupDialog
          onClose={() => router.back()}
          onSubmit={handleCreateGroupSubmit}
        />
      )}
    </div>
  );
}