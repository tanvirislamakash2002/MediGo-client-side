import EditMedicineForm from "@/components/modules/seller/EditMedicineForm";

const EditMedicinePage = async ({ params }: {
    params: Promise<{ id: string }>;
}) => {

    const { id } = await params;

    return (
        <>
        {/* <div className="bg-amber-400 h-169">r</div> */}
            <EditMedicineForm id={id}></EditMedicineForm>
        </>
    );
}

export default EditMedicinePage