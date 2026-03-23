import EditMedicineForm from "@/components/modules/seller/EditMedicineForm";

const EditMedicinePage = async ({ params }: {
    params: Promise<{ id: string }>;
}) => {

    const { id } = await params;

    return (
        <>
            <EditMedicineForm id={id}></EditMedicineForm>
        </>
    );
}

export default EditMedicinePage