import { getMedicineById } from "@/actions/medicine.action";
import EditMedicineForm from "@/components/modules/seller/medicines/EditMedicineForm";
import { notFound } from "next/navigation";

const EditMedicinePage = async ({ params }: {
    params: Promise<{ id: string }>;
}) => {

    const { id } = await params;
    const result = await getMedicineById(id);

    if (!result.success || !result.data) {
        notFound();
    }
    return (
        <>
            <EditMedicineForm medicine={result.data}></EditMedicineForm>
        </>
    );
}

export default EditMedicinePage