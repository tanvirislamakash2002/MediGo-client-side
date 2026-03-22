import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types';
import React from 'react';

// export async function generateStaticParams() {
//     const { data } = await medicineService.getMedicines();
//     return data?.data?.map((medicine: Medicine) => ({ id: medicine.id })).splice(0, 6)
// }

const MedicineDetailsPage = async ({
    params
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;
    const { data } = await medicineService.getMedicineById(id)
    console.log('from details', data);
    return (
        <div>
            this is medicine details page: {id}
            <br />
            the name of the medicine is {data.name}
        </div>
    );
};

export default MedicineDetailsPage;