'use client';

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { PackagingRequestComment } from '../types';

interface CommentChatListProps {
  comments: PackagingRequestComment[];
}

export default function CommentChatList({ comments }: CommentChatListProps) {
  const orderedComments = useMemo(() => [...comments].reverse(), [comments]);

  if (!orderedComments.length) {
    return (
      <Box
        sx={{
          width: '100%',
          borderRadius: '12px',
          bgcolor: '#F7F7FF',
          px: 2,
          py: 2,
          textAlign: 'center',
        }}>
        <Typography fontSize={14} color="#666">
          هنوز پیامی ثبت نشده است
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
        گفتگوها:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          px: 0.5,
        }}>
        {orderedComments.map((item, index) => {
          const isAdmin = item.isAdmin;

          return (
            <Box
              key={`${index}-${item.msg.slice(0, 12)}`}
              sx={{
                display: 'flex',
                justifyContent: isAdmin ? 'flex-start' : 'flex-end',
                width: '100%',
              }}>
              <Box
                sx={{
                  maxWidth: '85%',
                  px: 2,
                  py: 1.25,
                  borderRadius: isAdmin ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  bgcolor: isAdmin ? '#F7F7FF' : '#ECFAFF',
                  border: `1px solid ${isAdmin ? '#DDE1E6' : '#B8E8FF'}`,
                }}>
                <Typography fontSize={12} fontWeight={700} color="#393939" mb={0.5}>
                  {isAdmin ? 'ادمین' : 'شما'}
                </Typography>
                <Typography fontSize={14} color="#161616" sx={{ whiteSpace: 'pre-wrap' }}>
                  {item.msg}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
