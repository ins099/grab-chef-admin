'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowDown,
  Calendar,
  CircleCheck,
  CircleX,
  Search,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import ReviewTable from './components/Reviewtable';
import { getCookie } from 'cookies-next/client';
import axios from 'axios';
import { BASE_API_URL } from '@/common/constants';
import { toast } from 'sonner';

const Review = () => {
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie('token');
      const response = await axios.get(`${BASE_API_URL}/admin/get-reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(
        '===response.data===>',
        JSON.stringify(response.data, null, 1),
      );
      setData(response?.data?.reviews);
    } catch (error: any) {
      toast(error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReviewStatus = useCallback(
    async (reviewId: string, status: boolean) => {
      try {
        setLoading(true);
        const token = getCookie('token');
        const response = await axios.post(
          `${BASE_API_URL}/admin/update-review-status/${reviewId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (error: any) {
        toast(error?.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className='p-6 w-full'>
      {/* Page Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>Review</h1>
        <p>Review/Task</p>
      </div>

      {/* Search and Filter Bar */}
      <div className='flex items-center justify-between mb-6'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-icon-hex h-4 w-4' />
          <Input
            placeholder='Search here'
            className='pr-10 bg-gray-50 rounded-4xl border-gray-200'
          />
        </div>

        <div className='flex items-center space-x-2'>
          {selectedReviews.length > 0 && (
            <div className='mr-10 flex gap-5 items-center'>
              <Button
                variant='outline'
                className='flex rounded-4xl hover:text-green-400 items-center space-x-2 bg-green-200 text-green-400 border border-green-400'
              >
                <CircleCheck className='h-4 w-4 ' />
                <span className='flex items-center gap-2'>Publish </span>
              </Button>
              <Button
                variant='outline'
                className='flex rounded-4xl hover:text-red-400 bg-red-200 border border-red-400 text-red-400 items-center space-x-2'
              >
                <CircleX className='h-4 w-4 ' />
                <span className='flex items-center gap-2'>Delete</span>
              </Button>
            </div>
          )}
          <Button
            variant='outline'
            className='flex rounded-4xl items-center space-x-2'
          >
            <Calendar className='h-4 w-4 text-icon-hex' />
            <span className='flex items-center gap-2'>
              Filter <ArrowDown className='text-icon-hex' />
            </span>
          </Button>
          <Button className='bg-yellow-400 w-10 h-10 rounded-full hover:bg-yellow-500 text-black'>
            <span className=''>⊕</span>
          </Button>
        </div>
      </div>

      <div className='min-h-screen py-8'>
        <div className='container mx-auto px-4'>
          <ReviewTable
            selectedReviews={selectedReviews}
            setSelectedReviews={setSelectedReviews}
            data={data || []}
            setData={setData}
            updateReviewStatus={updateReviewStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Review;
