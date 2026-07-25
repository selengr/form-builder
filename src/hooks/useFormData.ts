// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import statsService from '@/services/statsService';

// const useFormData = () => {
//   const { id } = useParams();
//   const [formData, setFormData] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchFormData = async () => {
//     try {
//       setIsLoading(true);
//       const data = await statsService.getFormData(id.toString());
//       setFormData(data);
//     } catch (error) {
//       console.error('Error fetching form data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       await fetchFormData();
//     })();
//   }, [id]);

//   return { formData, isLoading };
// };

// export default useFormData;
