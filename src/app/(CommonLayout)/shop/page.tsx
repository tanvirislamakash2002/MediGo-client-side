import { medicineService } from '@/services/medicine.service';
import React from 'react';

const ShopPage = async () => {
    const { data } = await medicineService.getMedicines()
    console.log('data from shop-----', data);
    return (
        <div>
            This is shop page where you can see all the medicine.
        </div>
    );
};

export default ShopPage;