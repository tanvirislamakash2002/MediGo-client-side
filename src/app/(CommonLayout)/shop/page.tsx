import { MedicineCard } from '@/components/modules/shop/MedicineCard';
import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types';
import React from 'react';

const ShopPage = async () => {
    const { data } = await medicineService.getMedicines({
        search:''
    })
    return (
        <div className='grid grid-cols-4 gap-5 max-w-7xl mx-auto'>
            {
                data?.data?.map((medicineDetails: Medicine) => (
                    <MedicineCard key={medicineDetails.id} medicineDetails={medicineDetails}></MedicineCard>
                ))
            }
        </div>
    );
};

export default ShopPage;